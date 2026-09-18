'use client'

import {  User } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface ActivityHistoryEntry {
  timestamp: string
  author: string
  action: string
  details: string
  type: 'update' | 'status' | 'comment' | 'attachment'
}

interface ActivityHistorySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activity?: {
    title: string
    project: string
    provider: string
    status: string
    priority: string
  }
}

export function ActivityHistorySheet({ open, onOpenChange, activity }: ActivityHistorySheetProps) {
  // Mock history data
  const history: ActivityHistoryEntry[] = [
    {
      timestamp: '17/09/2026 14:32',
      author: 'Victor Fazekas',
      action: 'Status alterado',
      details: 'De "A fazer" para "Em andamento"',
      type: 'status',
    },
    {
      timestamp: '17/09/2026 10:15',
      author: 'João Silva',
      action: 'Adicionou comentário',
      details: 'Precisamos validar a conexão WebSocket em todas as regiões antes de prosseguir.',
      type: 'comment',
    },
    {
      timestamp: '16/09/2026 16:45',
      author: 'Maria Souza',
      action: 'Anexou arquivo',
      details: 'websocket-testing-report.pdf',
      type: 'attachment',
    },
    {
      timestamp: '16/09/2026 09:30',
      author: 'Victor Fazekas',
      action: 'Prioridade alterada',
      details: 'De "Média" para "Alta"',
      type: 'update',
    },
    {
      timestamp: '15/09/2026 13:20',
      author: 'Carlos Santos',
      action: 'Atividade criada',
      details: 'Criada no projeto Workshop Automation',
      type: 'status',
    },
  ]

  const getTypeColor = (type: ActivityHistoryEntry['type']) => {
    switch (type) {
      case 'status':
        return 'text-blue-500'
      case 'update':
        return 'text-amber-500'
      case 'comment':
        return 'text-emerald-500'
      case 'attachment':
        return 'text-purple-500'
      default:
        return 'text-muted-foreground'
    }
  }

  const getTypeIcon = (type: ActivityHistoryEntry['type']) => {
    switch (type) {
      case 'status':
        return '●'
      case 'update':
        return '↻'
      case 'comment':
        return '💬'
      case 'attachment':
        return '📎'
      default:
        return '•'
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[500px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Histórico da atividade</SheetTitle>
        </SheetHeader>

        {activity && (
          <div className="mb-4 space-y-2 rounded-lg bg-muted/50 p-4">
            <h3 className="font-medium text-sm line-clamp-2">{activity.title}</h3>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>{activity.project}</span>
              <span>•</span>
              <span>{activity.provider}</span>
              <span>•</span>
              <span className="text-foreground font-medium">{activity.status}</span>
            </div>
          </div>
        )}

        <Separator className="mb-4" />

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {history.map((entry, index) => (
              <div key={index} className="space-y-2">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`flex size-8 items-center justify-center rounded-full bg-muted text-sm ${getTypeColor(entry.type)}`}>
                      {getTypeIcon(entry.type)}
                    </div>
                    {index < history.length - 1 && (
                      <div className="mt-2 h-6 w-0.5 bg-border" />
                    )}
                  </div>

                  <div className="flex-1 pt-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{entry.action}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1">
                          <User className="size-3" />
                          {entry.author}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                        {entry.timestamp}
                      </p>
                    </div>

                    {entry.details && (
                      <div className="mt-2 rounded bg-background/50 p-2.5 border border-border/50">
                        <p className="text-xs text-foreground">{entry.details}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator className="mt-4 mb-3" />
        <p className="text-xs text-muted-foreground">
          Mostrando 5 últimas alterações
        </p>
      </SheetContent>
    </Sheet>
  )
}
