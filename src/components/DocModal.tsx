'use client'

import { useEffect, useRef } from 'react'

type Props = {
  title: string
  children: React.ReactNode
  onClose: () => void
}

export default function DocModal({ title, children, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center p-6 overflow-y-auto"
    >
      <div className="relative bg-zinc-950 border border-zinc-800 rounded-md w-full max-w-2xl my-8 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-950 border-b border-zinc-800 px-5 py-4 flex items-center justify-between rounded-t-md z-10">
          <span className="text-zinc-100 font-semibold text-sm">{title}</span>
          <button
            onClick={onClose}
            className="text-zinc-600 hover:text-zinc-300 transition-colors p-1 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-6 space-y-4 text-sm text-zinc-400 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}
