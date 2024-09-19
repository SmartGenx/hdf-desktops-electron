'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@renderer/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Governorate as GovernorateType } from '@renderer/types'
import { useAuthHeader } from 'react-auth-kit'
import { getApi, postApi } from '@renderer/lib/http'
import GovernorateTabel from '../_components/GovernorateTabel'
import { toast } from '@renderer/components/ui/use-toast'
const formSchema = z.object({
  name: z.string()
})

export default function Governorate() {
  const authToken = useAuthHeader()
  const queryClient = useQueryClient()

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })
  const { data: governorates, refetch } = useQuery({
    queryKey: ['governorate'],
    queryFn: () =>
      getApi<GovernorateType[]>('/governorate', {
        headers: {
          Authorization: authToken()
        }
      })
  })
  const { mutate } = useMutation({
    mutationKey: ['addGovernorate'],
    mutationFn: (values: z.infer<typeof formSchema>) => {
      // Return the API call to be executed
      return postApi(
        '/governorate',
        { ...values },
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
          <div className="grid w-full grid-cols-1 gap-x-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      label="إضافة محافظة"
                      placeholder="إضافة محافظة"
                      type="text"
                      {...field}
                      className="w-full"
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
      <GovernorateTabel info={governorates?.data || []} page="2" total={5} />
    </div>
  )
}