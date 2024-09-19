'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@renderer/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import CategoryTabel from '../_components/CategoryTabel'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Category as CategoryType } from '@renderer/types'
import { getApi, postApi } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'
import { toast } from '@renderer/components/ui/use-toast'
const formSchema = z.object({
  name: z.string(),
  SupportRatio: z.string(),
  description: z.string()
})

export default function Category() {
  const authToken = useAuthHeader()
  const queryClient = useQueryClient()

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })
  const { data: category, refetch } = useQuery({
    queryKey: ['category'],
    queryFn: () =>
      getApi<CategoryType[]>('/category', {
        headers: {
          Authorization: authToken()
        }
      })
  })
  const { mutate } = useMutation({
    mutationKey: ['addCategory'],
    mutationFn: (values: z.infer<typeof formSchema>) => {
      // Return the API call to be executed
      return postApi(
        '/category',
        { ...values, SupportRatio: +values.SupportRatio },
        {
          headers: {
            Authorization: `${authToken()}`
          }
        }
      )
    },
    onSuccess: () => {
      toast({
        title: 'تمت العملية',
        description: 'تمت الاضافة بنجاح',
        variant: 'success'
      })
      queryClient.invalidateQueries({ queryKey: ['addCategory'] })
      refetch()
    },
    onError: (error) => {
      toast({
        title: 'لم تتم العملية',
        description: error.message,
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-between gap-x-2">
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
          <Button variant={'Hdf'} type="submit">
            إضافة
          </Button>
        </form>
      </Form>
      <CategoryTabel info={category?.data || []} page="2" total={5} />
    </div>
  )
}
