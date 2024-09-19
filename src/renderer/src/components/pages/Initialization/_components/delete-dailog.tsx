import { useAuthHeader } from 'react-auth-kit'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@renderer/components/ui/alert-dialog'
import { useToast } from '@renderer/components/ui/use-toast'
import { deleteApi } from '@renderer/lib/http'

interface DeleteDialogProps {
  url: string
  disabled?: boolean
  keys?: string[]
  path: string
}

export default function DeleteDialog({ url, disabled = false, keys, path }: DeleteDialogProps) {
  const authToken = useAuthHeader()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { toast } = useToast()

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: () =>
      deleteApi(`${url}`, {
        headers: {
          Authorization: authToken()
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys })
      navigate(`/${path}`)
    }
  })

  useEffect(() => {
    if (isPending) {
      toast({
        title: 'جاري الحدف',
        description: 'يرجئ الانتظار قليل',
        variant: 'default'
      })
    }
  }, [isPending, toast])

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'تمت العملية بنجاح',
        description: 'تم حذف البيانات بنجاح',
        variant: 'success'
      })
    }
  }, [isSuccess, toast])

  useEffect(() => {
    if (isError) {
      toast({
        title: 'فشلت العملية',
        description: error?.toString(),
        variant: 'destructive'
      })
    }
  }, [isError, error, toast])

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={`m-0 flex w-full items-center gap-1 rounded px-2 py-1.5 text-right text-red-500 hover:bg-gray-100 ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
        disabled={disabled}
      >
        <Trash2 className="text-[#475467]" size={15} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="*:text-right">
          <AlertDialogTitle>{'هل أنت متأكد؟'}</AlertDialogTitle>
          <AlertDialogDescription>
            {'لا يمكنك التراجع فيما بعد. سوف يتم حذف البيانات بشكل نهائي.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="!justify-between gap-3">
          <AlertDialogCancel className="text-muted-foregrounds">إلغاء</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white hover:bg-red-500"
            onClick={() => {
              mutate()
            }}
          >
            حذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
