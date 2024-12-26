'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@renderer/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Governorate, Pharmacy } from '@renderer/types'
import { getApi, putApi } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'
import { toast } from '@renderer/components/ui/use-toast'
import { AlertDialogAction, AlertDialogCancel } from '@renderer/components/ui/alert-dialog'
import { useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
const formSchema = z.object({
  governorateGlobalId: z.string(),
  name: z.string(),
  location: z.string(),
  startDispenseDate: z.coerce
    .number()
    .min(1)
    .max(31, { message: 'الرقم يجب أن يكون أقل أو مساوي 31' }),
  endispenseDate: z.coerce.number().min(1).max(31)
})
interface Props {
  id: string
}
export default function EditPharmacyForm({ id }: Props) {
  const authToken = useAuthHeader()
  const queryClient = useQueryClient()
  const { data: pharmacy, isSuccess } = useQuery({
    queryKey: ['pharmacy', id],
    queryFn: async () =>
      await getApi<Pharmacy>(`/pharmacy/${id}`, {
        headers: {
          Authorization: authToken()
        }
      })
  })
  const { data: governorates } = useQuery({
    queryKey: ['governorate'],
    queryFn: () =>
      getApi<Governorate[]>('/governorate', {
        headers: {
          Authorization: authToken()
        }
      })
  })

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })
  useEffect(() => {
    if (isSuccess) {
      form.reset({
        name: pharmacy.data.name,
        endispenseDate: pharmacy.data.endispenseDate,
        location: pharmacy.data.location,
        governorateGlobalId: pharmacy.data.governorateGlobalId,
        startDispenseDate: pharmacy.data.startDispenseDate
      })
    }
  }, [pharmacy])
  const { mutate } = useMutation({
    mutationKey: ['editPharmacy'],
    mutationFn: (values: z.infer<typeof formSchema>) => {
      // Return the API call to be executed
      return putApi(
        `/pharmacy/${id}`,
        {
          ...values,
          startDispenseDate: +values.startDispenseDate,
          endispenseDate: +values.endispenseDate
        },
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

      queryClient.invalidateQueries({ queryKey: ['pharmacy'] })
    },
    onError(error: any) {
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid w-full grid-cols-6 gap-y-4 gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormControl>
                    <Input
                      label="إضافة صيدلية"
                      placeholder="إضافة صيدلية"
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
                <FormItem className="col-span-3">
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder="إضافة محافظة" />
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
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <Input
                      label="الموقع"
                      placeholder="الموقع"
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
              name="startDispenseDate"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <Input
                      label="تاريخ بدء الصرف"
                      placeholder="تاريخ بدء الصرف"
                      type="number"
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
              name="endispenseDate"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <Input
                      label="تاريخ انتهاء الصرف"
                      placeholder="تاريخ انتهاء الصرف"
                      type="number"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-between">
            <AlertDialogCancel className="text-muted-foregrounds">إلغاء</AlertDialogCancel>
            <Button variant={'Hdf'} type="button">
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
