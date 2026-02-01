'use client'

import { useState, useEffect } from 'react'

interface AccrualCalculation {
  startDate: Date
  endDate: Date
  totalAmount: number
  initialWithdrawn: number
}

export function useAccrual({ startDate, endDate, totalAmount, initialWithdrawn }: AccrualCalculation) {
  const [accrued, setAccrued] = useState(0)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    const calculateAccrual = () => {
      const now = new Date()
      const totalDuration = endDate.getTime() - startDate.getTime()
      const elapsed = now.getTime() - startDate.getTime()

      if (elapsed < 0) {
        setAccrued(0)
        setRemaining(totalAmount)
        return
      }

      if (elapsed >= totalDuration) {
        setAccrued(totalAmount)
        setRemaining(totalAmount - initialWithdrawn)
        return
      }

      const proportionalAccrual = (elapsed / totalDuration) * totalAmount
      setAccrued(proportionalAccrual)
      setRemaining(Math.max(0, proportionalAccrual - initialWithdrawn))
    }

    calculateAccrual()

    const interval = setInterval(calculateAccrual, 1000)
    return () => clearInterval(interval)
  }, [startDate, endDate, totalAmount, initialWithdrawn])

  return { accrued, remaining }
}
