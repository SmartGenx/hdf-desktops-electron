'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@renderer/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {  Square } from '@renderer/types'
import { getApi, putApi } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'
import { toast } from '@renderer/components/ui/use-toast'
import { AlertDialogAction, AlertDialogCancel } from '@renderer/components/ui/alert-dialog'
import { useEffect } from 'react'
const formSchema = z.object({
  name: z.string(),
 
})
interface Props {
  id: string
}
export default function EditSquareForm({ id }: Props) {
  const authToken = useAuthHeader()
  const queryClient = useQueryClient()
  const { data: square,isSuccess } = useQuery({
    queryKey: ['square', id],
    queryFn: async () =>
      await getApi<Square>(`/square/${id}`, {
        headers: {
          Authorization: authToken()
        }
      })
  })


  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    
  })
  useEffect(() => {
    if (isSuccess) {
      form.reset({
        name:square.data.name
      })
    }
  
    
  }, [square])
  const { mutate } = useMutation({
    mutationKey: ['editSquare'],
    mutationFn: (values: z.infer<typeof formSchema>) => {
      // Return the API call to be executed
      return putApi(
        `/square/${id}`,
        { ...values },
        {
          headers: {
            Authorization: `${authToken()}`
          }
        }
      )
    },
    onSuccess() {
      toast({
        title: 'تمت العملية',
        description: 'تمت التعديل بنجاح',
        variant: 'success'
      })

      queryClient.invalidateQueries({queryKey:["square"]})
    },
    onError(error:any) {
      const errorMessage = error?.response?.data?.message || 'حدث خطأ ما'
     
      toast({
        title: 'لم تتم العملية',
        description: errorMessage,
        variant: 'destructive'
      })
    }
  })
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values)
  }

  return (
    <div className="space-y-3">
      <Form {...form}>
        <form className="space-y-3">
          <div className="grid grid-cols-1 gap-x-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <Input label="المحافظة" placeholder="المحافظة" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-between">
            <AlertDialogCancel className="text-muted-foregrounds">إلغاء</AlertDialogCancel>
            <Button variant={'Hdf'} type='button'>
              <AlertDialogAction
                className="bg-transparent w-fit hover:bg-transparent"
                onClick={() => {
                  onSubmit(form.getValues())
                }}
              >
                حفظ
              </AlertDialogAction>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
