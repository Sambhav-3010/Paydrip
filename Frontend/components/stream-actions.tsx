'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Pause, Play, StopCircle, Download } from 'lucide-react'
import { notifyLoading, notifySuccess, notifyError, dismissToast } from '@/lib/notifications'

interface StreamActionsProps {
  status: 'active' | 'paused' | 'completed' | 'terminated'
  isEmployer?: boolean
  available?: number
}

export function StreamActions({ status, isEmployer, available }: StreamActionsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async (action: string) => {
    setIsLoading(true)
    notifyLoading(`Processing ${action}...`)

    try {
      console.log(`[v0] Executing action: ${action}`)

      // Simulate transaction processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      dismissToast()

      const actionMessages: Record<string, { title: string; description: string }> = {
        pause: {
          title: 'Stream paused',
          description: 'The salary stream has been paused successfully.',
        },
        resume: {
          title: 'Stream resumed',
          description: 'The salary stream is now active again.',
        },
        terminate: {
          title: 'Stream terminated',
          description: 'The salary stream has been terminated.',
        },
        withdraw: {
          title: 'Withdrawal successful',
          description: `${available?.toFixed(3)} ETH has been withdrawn to your wallet.`,
        },
      }

      const message = actionMessages[action]
      if (message) {
        notifySuccess(message.title, message.description)
      }
    } catch (error) {
      dismissToast()
      notifyError('Action failed', 'Please try again.')
      console.error(`[v0] Error executing ${action}:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {isEmployer ? (
        <div className="space-y-3">
          {status === 'active' && (
            <>
              <Button
                variant="outline"
                className="w-full gap-2 bg-transparent"
                onClick={() => handleAction('pause')}
                disabled={isLoading}
              >
                <Pause className="w-4 h-4" />
                Pause Stream
              </Button>
              <Button
                variant="destructive"
                className="w-full gap-2"
                onClick={() => handleAction('terminate')}
                disabled={isLoading}
              >
                <StopCircle className="w-4 h-4" />
                Terminate Stream
              </Button>
            </>
          )}
          {status === 'paused' && (
            <Button
              variant="outline"
              className="w-full gap-2 bg-transparent"
              onClick={() => handleAction('resume')}
              disabled={isLoading}
            >
              <Play className="w-4 h-4" />
              Resume Stream
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {available && available > 0 && (
            <Button
              className="w-full gap-2"
              onClick={() => handleAction('withdraw')}
              disabled={isLoading}
            >
              <Download className="w-4 h-4" />
              Withdraw {available.toFixed(3)} ETH
            </Button>
          )}
          {(!available || available === 0) && status === 'active' && (
            <p className="text-sm text-muted-foreground text-center">
              No available balance to withdraw
            </p>
          )}
        </div>
      )}
    </div>
  )
}
