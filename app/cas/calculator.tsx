'use client'

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { ArrowDownLeft, ArrowLeft, ArrowRight, BookOpen, ChevronDown, Delete, History, Terminal, Trash2 } from 'lucide-react'
import katex from 'katex'
import type { MathfieldElement } from 'mathlive'
import { formulaToGiac } from './formula'
import { categories, examples, incompleteFormula, type FunctionKey } from './keys'
import styles from './calculator.module.css'

export type GiacEngine = { evaluate: (input: string) => string }
type EngineStatus = 'loading' | 'ready' | 'error'
type InputMode = 'formula' | 'command'
type Draft = { mode: InputMode; input: string }
type Result = { raw: string; tex: string }
type HistoryItem = Draft & Result & { id: number }

function MathDisplay({ tex, fallback }: { tex: string; fallback: string }) {
  const html = useMemo(() => {
    if (!tex) return ''
    try {
      return katex.renderToString(tex, { displayMode: true, trust: false })
    } catch {
      return ''
    }
  }, [tex])
  return html ? <span dangerouslySetInnerHTML={{ __html: html }} /> : <code>{fallback}</code>
}

function Key({
  children, name, action, disabled, kind = 'function',
}: {
  children: ReactNode
  name: string
  action: () => void
  disabled?: boolean
  kind?: 'function' | 'number' | 'operator' | 'control' | 'execute'
}) {
  return (
    <button type="button" className={styles.key} data-kind={kind} title={name} aria-label={name}
      disabled={disabled} onMouseDown={event => event.preventDefault()} onClick={action}>
      {children}
    </button>
  )
}

const basicKeys = [
  { label: '7' }, { label: '8' }, { label: '9' }, { label: '÷', value: '\\div', name: 'หาร' },
  { label: 'DEL', name: 'ลบหนึ่งตำแหน่ง' },
  { label: '4' }, { label: '5' }, { label: '6' }, { label: '×', value: '\\times', name: 'คูณ' },
  { label: 'AC', name: 'ล้างจอ' },
  { label: '1' }, { label: '2' }, { label: '3' }, { label: '−', value: '-', name: 'ลบ' },
  { label: '=', name: 'เครื่องหมายเท่ากับ' },
  { label: '0' }, { label: '.', name: 'จุดทศนิยม' }, { label: 'Ans', name: 'ใช้คำตอบล่าสุด' },
  { label: '+', name: 'บวก' }, { label: 'EXE', name: 'EXE คำนวณ' },
]

export default function ScientificCalculator({ engine, engineStatus }: { engine: GiacEngine | null; engineStatus: EngineStatus }) {
  const [category, setCategory] = useState(categories[0])
  const [mode, setMode] = useState<InputMode>('formula')
  const [editorStatus, setEditorStatus] = useState<EngineStatus>('loading')
  const [formula, setFormula] = useState('')
  const [command, setCommand] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [lastAnswer, setLastAnswer] = useState('')
  const host = useRef<HTMLDivElement>(null)
  const field = useRef<MathfieldElement>(null)
  const rawInput = useRef<HTMLTextAreaElement>(null)
  const historyId = useRef(0)
  const pendingFocus = useRef<InputMode>(null)

  useEffect(() => {
    const container = host.current
    if (!container) return
    let active = true
    const syncFormula = () => {
      setFormula(field.current?.value ?? '')
      setResult(null)
      setError('')
    }
    import('mathlive').then(({ MathfieldElement }) => {
      if (!active) return
      // The application's KaTeX stylesheet already loads these font families.
      MathfieldElement.fontsDirectory = null
      MathfieldElement.soundsDirectory = null
      const editor = new MathfieldElement()
      editor.mathVirtualKeyboardPolicy = 'manual'
      editor.smartFence = true
      editor.setAttribute('aria-label', 'นิพจน์')
      editor.className = styles.mathfield
      editor.addEventListener('input', syncFormula)
      field.current = editor
      container.append(editor)
      setEditorStatus('ready')
    }).catch(() => {
      if (active) setEditorStatus('error')
    })
    return () => {
      active = false
      field.current?.removeEventListener('input', syncFormula)
      field.current?.remove()
      field.current = null
    }
  }, [])

  useEffect(() => {
    if (pendingFocus.current !== mode) return
    pendingFocus.current = null
    if (mode === 'formula') field.current?.focus()
    else {
      const input = rawInput.current
      input?.focus()
      input?.setSelectionRange(input.value.length, input.value.length)
    }
  }, [mode])

  function switchMode(next: InputMode) {
    if (next === mode) return
    setMode(next)
    setError('')
    setResult(null)
  }

  function loadDraft(draft: Draft) {
    if (draft.mode === 'formula') {
      const editor = field.current
      if (!editor) return
      editor.setValue(draft.input, { silenceNotifications: true })
      setFormula(editor.value)
      if (mode === 'formula') editor.focus()
    } else {
      setCommand(draft.input)
      if (mode === 'command') rawInput.current?.focus()
    }
    if (mode !== draft.mode) pendingFocus.current = draft.mode
    setMode(draft.mode)
    setResult(null)
    setError('')
  }

  function evaluate() {
    if (!engine) return
    const input = (mode === 'formula' ? field.current?.value ?? '' : command).trim()
    if (!input) return
    let expression = input
    if (mode === 'formula') {
      try {
        expression = formulaToGiac(input, lastAnswer)
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : 'อ่านสูตรไม่ได้'
        setError(message)
        setResult(null)
        if (message === incompleteFormula && field.current) {
          field.current.focus()
          field.current.position = 0
          field.current.executeCommand('moveToNextPlaceholder')
        }
        return
      }
    }

    try {
      const raw = engine.evaluate(expression).trim()
      if (!raw || raw === 'undef') throw new Error('ผลลัพธ์ไม่ถูกนิยาม กรุณาตรวจสอบโจทย์')
      let tex = ''
      try {
        const value = engine.evaluate(`latex(quote(${raw}))`)
        if (value.startsWith('"') && value.endsWith('"')) tex = value.slice(1, -1)
      } catch {
        // Giac can return sequences or objects that have no TeX representation.
      }
      const next = { raw, tex }
      const id = ++historyId.current
      setResult(next)
      setError('')
      setLastAnswer(raw)
      setHistory(items => [{ id, mode, input, ...next }, ...items])
    } catch (cause) {
      setResult(null)
      setError(cause instanceof Error ? cause.message : 'คำนวณไม่ได้ กรุณาตรวจสอบโจทย์')
    }
  }

  function handleEnter(event: KeyboardEvent) {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing || event.shiftKey) return
    if (mode === 'command' && !event.ctrlKey && !event.metaKey) return
    event.preventDefault()
    event.stopPropagation()
    evaluate()
  }

  function insert(template: string) {
    field.current?.focus()
    field.current?.insert(template, { format: 'latex', selectionMode: 'placeholder' })
  }

  function applyFunction(key: FunctionKey) {
    const editor = field.current
    if (!editor) return
    if (key.wrap && editor.selectionIsCollapsed && editor.value) editor.select()
    insert(key.template)
  }

  function runCommand(name: 'moveToPreviousChar' | 'moveToNextChar' | 'deleteBackward') {
    field.current?.focus()
    field.current?.executeCommand(name)
  }

  function insertFence(fence: string) {
    field.current?.focus()
    field.current?.executeCommand(['typedText', fence, { simulateKeystroke: true }])
  }

  function clearDisplay() {
    loadDraft({ mode, input: '' })
  }

  const editorReady = editorStatus === 'ready'
  const canEvaluate = engineStatus === 'ready' && Boolean((mode === 'formula' ? formula : command).trim())
  const loading = engineStatus === 'loading' || (mode === 'formula' && editorStatus === 'loading')
  const statusMessage = engineStatus === 'error' ? 'โหลด Giac ไม่สำเร็จ'
    : mode === 'formula' && editorStatus === 'error' ? 'โหลดจอสูตรไม่สำเร็จ'
    : loading ? 'กำลังโหลด' : 'พร้อม'

  return (
    <div className={styles.workspace}>
      <section className={styles.device} aria-label="แป้นเครื่องคิดเลขวิทยาศาสตร์">
        <div className={styles.screen}>
          <div className={styles.screenBar}>
            <span className={styles.status} data-ready={!loading && engineStatus === 'ready' && (mode === 'command' || editorReady)}>
              <span aria-hidden="true" />{statusMessage}
            </span>
            <button type="button" className={styles.mode} aria-pressed={mode === 'command'}
              onClick={() => switchMode(mode === 'formula' ? 'command' : 'formula')}>
              <Terminal size={14} aria-hidden="true" />{mode === 'formula' ? 'คำสั่ง Giac' : 'จอสูตร'}
            </button>
          </div>
          <div hidden={mode !== 'formula'} className={styles.editor} onKeyDownCapture={handleEnter}>
            {formula === '' && <span className={styles.placeholder} aria-hidden="true">ป้อนนิพจน์</span>}
            <div ref={host} />
          </div>
          {mode === 'command' && (
            <textarea aria-label="คำสั่ง Giac" ref={rawInput} className={styles.raw}
              placeholder="solve(x^2-5*x+6=0,x)" rows={3} spellCheck={false}
              value={command} onKeyDown={handleEnter} onChange={event => {
                setCommand(event.target.value)
                setResult(null)
                setError('')
              }} />
          )}
          <div className={styles.result} role="status" aria-live="polite">
            {error && <p className={styles.error}>{error}</p>}
            {result && (
              <>
                <span className={styles.resultSign} aria-hidden="true">=</span>
                <div className={styles.resultValue} data-result={result.raw}>
                  <MathDisplay tex={result.tex} fallback={result.raw} />
                </div>
              </>
            )}
          </div>
        </div>

        {mode === 'formula' ? (
          <>
            <div className={styles.categories} role="group" aria-label="หมวดฟังก์ชัน">
              {categories.map(group => (
                <button key={group.id} type="button" aria-pressed={category.id === group.id} onClick={() => setCategory(group)}>
                  {group.label}
                </button>
              ))}
            </div>
            <div className={styles.keys} role="group" aria-label={category.label}>
              {category.keys.map(key => (
                <Key key={key.name} name={key.name} action={() => applyFunction(key)} disabled={!editorReady}>
                  {key.label === '□/□' ? (
                    <span className={styles.fraction} aria-hidden="true"><span>□</span><span>□</span></span>
                  ) : key.label}
                </Key>
              ))}
            </div>
            <div className={styles.keys} role="group" aria-label="แก้ไขนิพจน์">
              <Key name="เลื่อนซ้าย" action={() => runCommand('moveToPreviousChar')} disabled={!editorReady}><ArrowLeft size={17} /></Key>
              <Key name="เลื่อนขวา" action={() => runCommand('moveToNextChar')} disabled={!editorReady}><ArrowRight size={17} /></Key>
              <Key name="วงเล็บเปิด" action={() => insertFence('(')} disabled={!editorReady}>(</Key>
              <Key name="วงเล็บปิด" action={() => insertFence(')')} disabled={!editorReady}>)</Key>
              <Key name="ตัวแปร x" action={() => insert('x')} disabled={!editorReady}>x</Key>
            </div>
            <div className={styles.keys} role="group" aria-label="ตัวเลขและการคำนวณ">
              {basicKeys.map(({ label, value, name }) => {
                if (label === 'EXE') return <Key key={label} name={name!} action={evaluate} disabled={!canEvaluate} kind="execute">{label}</Key>
                if (label === 'AC') return <Key key={label} name={name!} action={clearDisplay} disabled={!editorReady} kind="control">{label}</Key>
                if (label === 'DEL') return <Key key={label} name={name!} action={() => runCommand('deleteBackward')} disabled={!editorReady} kind="control"><Delete size={20} /><span className="sr-only">DEL</span></Key>
                if (label === 'Ans') return <Key key={label} name={name!} action={() => insert('\\operatorname{Ans}')} disabled={!editorReady || !lastAnswer}>{label}</Key>
                return <Key key={label} name={name ?? label} action={() => insert(value ?? label)} disabled={!editorReady}
                  kind={name && label !== '.' ? 'operator' : 'number'}>{label}</Key>
              })}
            </div>
          </>
        ) : (
          <div className={styles.rawActions}>
            <kbd>Ctrl + Enter</kbd>
            <Key name="ล้างจอ" action={clearDisplay} kind="control">AC</Key>
            <Key name="EXE คำนวณ" action={evaluate} disabled={!canEvaluate} kind="execute">EXE</Key>
          </div>
        )}
      </section>

      <aside className={styles.side}>
        <section className={styles.panel} aria-labelledby="cas-history-title">
          <div className={styles.panelHeading}>
            <h2 id="cas-history-title"><History size={17} aria-hidden="true" /> ประวัติ</h2>
            {history.length > 0 && (
              <button type="button" className={styles.clearHistory} onClick={() => setHistory([])}>
                <Trash2 size={14} aria-hidden="true" /> ล้าง
              </button>
            )}
          </div>
          {history.length === 0 ? <p className={styles.empty}>คำตอบจาก EXE จะแสดงที่นี่</p> : (
            <ul className={styles.history}>
              {history.map(item => (
                <li key={item.id}>
                  <button type="button" onClick={() => loadDraft(item)} title="นำโจทย์กลับมาแก้">
                    <span className={styles.historyInput}>
                      <MathDisplay tex={item.mode === 'formula' ? item.input : ''} fallback={item.input} />
                    </span>
                    <ArrowDownLeft size={16} aria-label="นำโจทย์กลับมาแก้" />
                    <span className={styles.historyResult}><MathDisplay tex={item.tex} fallback={item.raw} /></span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
        <details className={styles.panel}>
          <summary className={styles.panelHeading}>
            <span><BookOpen size={17} aria-hidden="true" /> ตัวอย่าง</span>
            <ChevronDown size={16} aria-hidden="true" />
          </summary>
          <div className={styles.examples}>
            {examples.map(example => (
              <button key={example.id} type="button" disabled={mode === 'formula' && !editorReady}
                onClick={() => loadDraft({ mode, input: mode === 'formula' ? example.tex : example.command })}>
                <span>{example.label}</span>
                <MathDisplay tex={mode === 'formula' ? example.tex : ''} fallback={example.command} />
              </button>
            ))}
          </div>
        </details>
      </aside>
    </div>
  )
}
