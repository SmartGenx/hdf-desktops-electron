import { Edit2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@renderer/components/ui/alert-dialog'

interface DeleteDialogProps {
  disabled?: boolean

  content: React.ReactNode
}

export default function EditDialog({ disabled = false, content }: DeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={`m-0 flex w-full items-center gap-1 rounded px-2 py-1.5 text-right text-red-500 hover:bg-gray-100 ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
        disabled={disabled}
      >
        <Edit2 className="text-[#475467]" size={15} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="*:text-right">
          <AlertDialogTitle>{'تعديل'}</AlertDialogTitle>
          {content}
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}
