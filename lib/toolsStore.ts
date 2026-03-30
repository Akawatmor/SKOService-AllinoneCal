'use client'

export interface ToolInfo {
  id: string
  href: string
  starred: boolean
  lastUsed?: number
}

const STORAGE_KEY = 'skoservice-tools'
const MAX_RECENT = 5

export function getToolsData(): Record<string, ToolInfo> {
  if (typeof window === 'undefined') return {}
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return {}
  
  try {
    return JSON.parse(stored)
  } catch {
    return {}
  }
}

export function setToolsData(data: Record<string, ToolInfo>) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function markToolUsed(toolId: string, href: string) {
  const data = getToolsData()
  data[toolId] = {
    ...data[toolId],
    id: toolId,
    href,
    lastUsed: Date.now(),
  }
  setToolsData(data)
}

export function toggleToolStar(toolId: string, href: string) {
  const data = getToolsData()
  const current = data[toolId]
  
  data[toolId] = {
    id: toolId,
    href,
    starred: current ? !current.starred : true,
    lastUsed: current?.lastUsed,
  }
  
  setToolsData(data)
  return data[toolId].starred
}

export function getRecentTools(): ToolInfo[] {
  const data = getToolsData()
  return Object.values(data)
    .filter(tool => tool.lastUsed)
    .sort((a, b) => (b.lastUsed || 0) - (a.lastUsed || 0))
    .slice(0, MAX_RECENT)
}

export function getStarredTools(): ToolInfo[] {
  const data = getToolsData()
  return Object.values(data)
    .filter(tool => tool.starred)
    .sort((a, b) => (b.lastUsed || 0) - (a.lastUsed || 0))
}

export function isToolStarred(toolId: string): boolean {
  const data = getToolsData()
  return data[toolId]?.starred || false
}
