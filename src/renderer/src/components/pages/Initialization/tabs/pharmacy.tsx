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
import { Governorate, Pharmacy as PharmacyType } from '@renderer/types'
import { getApi, postApi } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'
import { toast } from '@renderer/components/ui/use-toast'
import PharmacyTabel from '../_components/PharmacyTabel'
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

export default function Pharmacy() {
  const authToken = useAuthHeader()
  const queryClient = useQueryClient()

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      governorateGlobalId: '',
      location: '',
      startDispenseDate: 0,
      endispenseDate: 0
      // file: undefined // Uncomment if using file input
    }
  })
  const { data: pharmacies, refetch } = useQuery({
    queryKey: ['pharmacy'],
    queryFn: () =>
      getApi<PharmacyType[]>('/pharmacy', {
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
  const { mutate } = useMutation({
    mutationKey: ['addPharmacy'],
    mutationFn: (values: z.infer<typeof formSchema>) => {
      // Return the API call to be executed
      return postApi(
        '/pharmacy',
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
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    mutate(values)
  }

  return (
    <div className="space-y-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-between gap-x-2">
          <div className="grid w-full grid-cols-10  gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-5">
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
                <FormItem className="col-span-5">
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <FormItem className="col-span-3">
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
                <FormItem className="col-span-3">
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
                <FormItem className="col-span-3">
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
            <Button className="col-span-1 w-full " variant={'Hdf'} type="submit">
              إضافة
            </Button>
          </div>
        </form>
      </Form>
      <PharmacyTabel info={pharmacies?.data || []} page="2" pageSize="5" total={5} />
    </div>
  )
}
