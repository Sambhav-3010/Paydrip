'use client'

import React from "react"

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { notifySuccess, notifyError } from '@/lib/notifications'
import { Plus } from 'lucide-react'

export function CreateStreamModal() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      console.log('[v0] Stream creation submitted:', {
        recipient: formData.get('recipient'),
        amount: formData.get('amount'),
        duration: formData.get('duration'),
      })

      await new Promise((resolve) => setTimeout(resolve, 1000))

      notifySuccess('Stream created successfully!', 'The salary stream is now active.')
      setOpen(false)
      e.currentTarget.reset()
    } catch (error) {
      notifyError('Failed to create stream', 'Please try again.')
      console.error('[v0] Stream creation error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="brutal-button gap-2">
          <Plus className="w-5 h-5" />
          Create Stream
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] brutal-card border-2 border-border p-0">
        <DialogHeader className="p-6 border-b-2 border-border bg-primary">
          <DialogTitle className="text-xl brutal-title text-primary-foreground">
            Create New Stream
          </DialogTitle>
          <DialogDescription className="text-primary-foreground/80">
            Set up a continuous salary stream for your employee.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-sm uppercase tracking-wider font-semibold">
              Recipient Address
            </Label>
            <Input
              id="recipient"
              name="recipient"
              placeholder="0x742d35Cc6634C0532925a3b844Bc927e73f5E0bb"
              required
              className="brutal-input brutal-mono text-sm p-3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm uppercase tracking-wider font-semibold">
              Total Amount (ETH)
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              placeholder="10.00"
              required
              min="0"
              className="brutal-input p-3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm uppercase tracking-wider font-semibold">
              Duration (days)
            </Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              placeholder="365"
              required
              min="1"
              className="brutal-input p-3"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 brutal-button brutal-button-secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 brutal-button"
            >
              {isLoading ? 'Creating...' : 'Create Stream'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
