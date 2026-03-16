'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Pause, Play, StopCircle, Download } from 'lucide-react'
import { notifyLoading, notifySuccess, notifyError, dismissToast } from '@/lib/notifications'
import { useWeb3 } from '@/contexts/Web3Context'
import { pauseStream, resumeStream, terminateStream, withdrawSalary } from '@/lib/stream-contract'

interface StreamActionsProps {
  streamId: number
  status: 'active' | 'paused' | 'completed' | 'terminated'
  isEmployer?: boolean
  available?: number
  onUpdated?: () => Promise<void> | void
}

export function StreamActions({ streamId, status, isEmployer, available, onUpdated }: StreamActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { contract, isConnected } = useWeb3()

  const handleAction = async (action: string) => {
    if (!contract || !isConnected) {
      notifyError('Wallet not connected', 'Connect your wallet to perform this action.')
      return
    }

    setIsLoading(true)
    notifyLoading(`Processing ${action}...`)

    try {
      if (action === 'pause') await pauseStream(contract, streamId)
      if (action === 'resume') await resumeStream(contract, streamId)
      if (action === 'terminate') await terminateStream(contract, streamId)
      if (action === 'withdraw') await withdrawSalary(contract, streamId)
      await onUpdated?.()

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
