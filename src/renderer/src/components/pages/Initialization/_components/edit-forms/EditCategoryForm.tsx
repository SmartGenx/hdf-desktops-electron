'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@renderer/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Category as CategoryType } from '@renderer/types'
import { getApi, putApi } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'
import { toast } from '@renderer/components/ui/use-toast'
import { AlertDialogAction, AlertDialogCancel } from '@renderer/components/ui/alert-dialog'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
const formSchema = z.object({
  name: z.string(),
  SupportRatio: z.string(),
  description: z.string()
})
interface Props {
  id: string
}
export default function EditCategoryForm({ id }: Props) {
  const authToken = useAuthHeader()
  const queryClient = useQueryClient()
  const { data: category,isSuccess: isCategorySuccess } = useQuery({
    queryKey: ['category', id],
    queryFn: async () =>
      await getApi<CategoryType>(`/category/${id}`, {
        headers: {
          Authorization: authToken()
        }
      })
  })

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.data.name,
      description: category?.data.description,
      SupportRatio: category?.data.SupportRatio?.toString()
    }
  })
  useEffect(() => {
    if (isCategorySuccess) {
      form.reset({
        name:category.data.name,
        description:category.data.description,
        SupportRatio:category.data.SupportRatio?.toString()
      })
    }
  
    
  }, [category])
  
  
  const { mutate,error,isSuccess, isError } = useMutation({
    mutationKey: ['editCategory'],
    mutationFn: (values: z.infer<typeof formSchema>) => {
      // Return the API call to be executed
      return putApi(
        `/category/${id}`,
        { ...values, SupportRatio: +values.SupportRatio },
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
    },
    onError(error) {
      toast({
        title: 'لم تتم العملية',
        description: error.message,
        variant: 'destructive'
      })
    },
    
    
  })
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values)
  }
  

  
  return (
    <div className="space-y-3">
      <Form {...form}>
        <form className="space-y-3">
          <div className="grid grid-cols-7 gap-x-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <Input label="اسم الفئة" placeholder="اسم الفئة" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormControl>
                    <Input label="الوصف" placeholder="الوصف" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="SupportRatio"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormControl>
                    <Input
                      label="النسبة"
                      placeholder="النسبة"
                      type="number"
                      {...field}
                      value={Number(field.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-between">
            <AlertDialogCancel className="text-muted-foregrounds">إلغاء</AlertDialogCancel>
            <Button variant={'Hdf'}>
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
