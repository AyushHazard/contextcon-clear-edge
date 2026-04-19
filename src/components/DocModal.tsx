'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Props = {
  title: string
  children: React.ReactNode
  onClose: () => void
}

export default function DocModal({ title, children, onClose }: Props) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col gap-0 p-0 border-2 rounded-none bg-background overflow-hidden">
        <DialogHeader className="p-6 border-b-2 bg-muted/30">
          <DialogTitle className="text-xl font-black tracking-tighter uppercase italic">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-8">
          <div className="text-muted-foreground space-y-4 font-medium leading-relaxed text-sm">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
