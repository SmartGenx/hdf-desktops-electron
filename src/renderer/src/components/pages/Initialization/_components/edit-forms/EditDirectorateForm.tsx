'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@renderer/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {  Directorate, Governorate } from '@renderer/types'
import { getApi, putApi } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'
import { toast } from '@renderer/components/ui/use-toast'
import { AlertDialogAction, AlertDialogCancel } from '@renderer/components/ui/alert-dialog'
import { useEffect } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@renderer/components/ui/select'
const formSchema = z.object({
  governorateGlobalId: z.string(),
  name: z.string(),
 
})
interface Props {
  id: string
}
export default function EditDirectorateForm({ id }: Props) {
  const authToken = useAuthHeader()
  const queryClient = useQueryClient()
  const { data: governorates } = useQuery({
    queryKey: ['governorates'],
    queryFn: async () =>
      await getApi<Governorate[]>(`/governorate`, {
        headers: {
          Authorization: authToken()
        }
      })
  })
  const { data: directorate,isSuccess } = useQuery({
    queryKey: ['directorate', id],
    queryFn: async () =>
      await getApi<Directorate>(`/directorate/${id}`, {
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
        name:directorate.data.name,
        governorateGlobalId:directorate.data.governorateGlobalId
      })
    }
  
    
  }, [directorate])
  const { mutate } = useMutation({
    mutationKey: ['editDirectorate'],
    mutationFn: (values: z.infer<typeof formSchema>) => {
      // Return the API call to be executed
      return putApi(
        `/directorate/${id}`,
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

      queryClient.invalidateQueries({queryKey:["directorate"]})
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
        <div className="grid w-full grid-cols-2 gap-x-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      label="إضافة مديرية"
                      placeholder="إضافة مديرية"
                      type="text"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="governorateGlobalId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="">
                        <SelectValue placeholder="إضافة محافظة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>المحافظات</SelectLabel>
                          {governorates && governorates.data.map((governorate) => (
                            <SelectItem key={governorate.id} value={String(governorate.globalId)}>
                              {governorate.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
