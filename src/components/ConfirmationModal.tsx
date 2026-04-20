import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string | React.ReactNode
  confirmText?: string
  cancelText?: string
  type?: 'info' | 'warning' | 'success' | 'danger'
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info'
}: ConfirmationModalProps) {
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      const timer = setTimeout(() => setActive(true), 10)
      return () => clearTimeout(timer)
    } else {
      setActive(false)
      const timer = setTimeout(() => setMounted(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!mounted) return null

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-orange-400" />
      case 'danger':
        return <AlertTriangle className="h-6 w-6 text-red-500" />
      case 'success':
        return <CheckCircle2 className="h-6 w-6 text-emerald-400" />
      default:
        return <Info className="h-6 w-6 text-blue-400" />
    }
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-orange-500/10'
      case 'danger':
        return 'bg-red-500/10'
      case 'success':
        return 'bg-emerald-500/10'
      default:
        return 'bg-blue-500/10'
    }
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div 
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        className={`relative w-full max-w-md overflow-hidden rounded-3xl border border-white/5 bg-[#121214] p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 ease-out ${
          active ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${getTypeStyles()}`}>
            {getIcon()}
          </div>
          
          <h2 className="text-xl font-bold tracking-tight text-white mb-3">{title}</h2>
          <div className="text-sm text-gray-400 mb-8 text-left w-full">{message}</div>

          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-2xl bg-white/5 py-3.5 text-sm font-semibold text-gray-400 transition-all hover:bg-white/10 hover:text-white active:scale-[0.98]"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 rounded-2xl py-3.5 text-sm font-bold text-white transition-all active:scale-[0.98] ${
                type === 'warning' ? 'bg-orange-500 hover:bg-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.2)]' : 
                type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 
                type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 
                'bg-blue-600 hover:bg-blue-700 shadow-[0_0_20px_rgba(37,99,235,0.2)]'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
