import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger
} from '@renderer/components/ui/dialog'
import { AlertDialogHeader } from '@renderer/components/ui/alert-dialog'
import { Label } from '@renderer/components/ui/label'
import { Button } from '@renderer/components/ui/button'
import SubmitIcon from '@renderer/components/icons/submit-icon'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@renderer/components/ui/use-toast'
import { useAuthHeader } from 'react-auth-kit'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form' // Corrected
import { zodResolver } from '@hookform/resolvers/zod'
import { postApi } from '@renderer/lib/http'
import { Form, FormControl, FormField, FormItem } from '@renderer/components/ui/form' // Corrected
import { FormInput } from '@renderer/components/ui/forms-input'
import { useEffect } from 'react'

const formSchema = z.object({
  backupName: z.string(),
  token: z.string()
})

type BackUpFormValue = z.infer<typeof formSchema>

export default function BackupDialog() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const authToken = useAuthHeader()
  const navigate = useNavigate()
  const form = useForm<BackUpFormValue>({
    resolver: zodResolver(formSchema)
  })
  const getTokenFromLocalStorage = () => {
    // Replace 'auth_token_key' with the actual key used to store the token
    return localStorage.getItem('_auth')
  }
  // Example usage
  const token = getTokenFromLocalStorage()


  const { mutate } = useMutation({
    mutationKey: ['uploadBackUp'],
    mutationFn: (datas: BackUpFormValue) =>
      postApi(
        '/backUp',
        {
          backupName: datas.backupName,
          token: token
        },
        {
          headers: {
            Authorization: `${authToken()}`
          }
        }
      ),
    onSuccess: () => {
      toast({
        title: 'اشعار',
        variant: 'success',
        description: 'تمت الاضافة بنجاح'
      })
      queryClient.invalidateQueries({ queryKey: ['backUp'] })
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      navigate('/backup')
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      // Added type for error
      toast({
        title: 'لم تتم العملية',
        description: error.message || 'حدث خطأ ما',
        variant: 'destructive'
      })
    }
  })
  useEffect(() => {
    form.setValue('token', token || '')
  }, [])
  const onSubmit = (datas: BackUpFormValue) => {
    mutate(datas)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-[#92A709] hover:bg-[#5b6806] focus:ring-[#92A709] text-white hover:text-white"
        >
          <i className="ml-2">
            <SubmitIcon />
          </i>
          أنشاء نسخة
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <AlertDialogHeader>
          <DialogTitle className="text-start">أنشاء نسخة جديدة</DialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="" id="UploadDatabaseBackUp">
            <div className="grid gap-1 py-4">
              <div className="grid grid-cols-1 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  اسم النسخة
                </Label>
                <FormField
                  control={form.control}
                  name="backupName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormInput
                          className="h-10 py-5 px-0  rounded-xl text-sm"
                          placeholder=" اسم النسخة"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <DialogClose asChild>
                <Button size={'lg'} variant="outline">
                  إلغاء
                </Button>
              </DialogClose>
              <Button
                form="UploadDatabaseBackUp"
                className="bg-[#196cb0]"
                type="submit"
                size={'lg'}
              >
                حفظ
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
