import { toast } from 'sonner'

export function notifySuccess(message: string, description?: string) {
  toast.success(message, {
    description,
    duration: 4000,
  })
}

export function notifyError(message: string, description?: string) {
  toast.error(message, {
    description,
    duration: 4000,
  })
}

export function notifyInfo(message: string, description?: string) {
  toast.info(message, {
    description,
    duration: 4000,
  })
}

export function notifyLoading(message: string) {
  toast.loading(message, {
    duration: Infinity,
  })
}

export function dismissToast() {
  toast.dismiss()
}
