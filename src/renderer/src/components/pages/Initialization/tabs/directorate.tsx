'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@renderer/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Directorate as DirectorateType, Governorate } from '@renderer/types'
import { getApi, postApi } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'
import DirectorateTabel from '../_components/DirectorateTabel'
import { toast } from '@renderer/components/ui/use-toast'

const formSchema = z.object({
  governorateGlobalId: z.string(),
  name: z.string()
})

export default function Directorate() {
  const authToken = useAuthHeader()
  const queryClient = useQueryClient()

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      governorateGlobalId: ''
    }
  })
  const { data: governorates, refetch } = useQuery({
    queryKey: ['governorate'],
    queryFn: () =>
      getApi<Governorate[]>('/governorate', {
        headers: {
          Authorization: authToken()
        }
      })
  })
  const { data: directorates } = useQuery({
    queryKey: ['directorate'],
    queryFn: () =>
      getApi<DirectorateType[]>('/directorate', {
        headers: {
          Authorization: authToken()
        }
      })
  })
  const { mutate } = useMutation({
    mutationKey: ['addDirectorate'],
    mutationFn: (values: z.infer<typeof formSchema>) => {
      // Return the API call to be executed
      return postApi(
        '/directorate',
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
      queryClient.invalidateQueries({ queryKey: ['directorate'] })
      refetch()
      form.reset()
    },
    onError: (error: any) => {
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-between gap-x-2">
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
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        form.setValue('governorateGlobalId', value) // Update the value in the form
                      }}
                      value={field.value || ''} // Make sure the value is derived from the form
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder="اختار محافظة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>المحافظات</SelectLabel>
                          {governorates &&
                            governorates.data.map((governorate) => (
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
          <Button variant={'Hdf'} type="submit">
            إضافة
          </Button>
        </form>
      </Form>
      <DirectorateTabel info={directorates?.data || []} page="2" total={5} />
    </div>
  )
}
