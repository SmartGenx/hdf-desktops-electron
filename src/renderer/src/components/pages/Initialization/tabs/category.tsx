'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@renderer/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import CategoryTabel from '../_components/CategoryTabel'
const formSchema = z.object({
  username: z.string().min(2).max(50)
})

export default function Category() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: ''
    }
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    <div className='space-y-3'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-between gap-x-2">
          <div className='grid grid-cols-7 gap-x-2'>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormControl>
                    <Input
                      label="اسم الفئة"
                      placeholder="اسم الفئة"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className='col-span-4'>
                  <FormControl>
                    <Input
                      label="الوصف"
                      placeholder="الوصف"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className='col-span-1'>
                  <FormControl>
                    <Input
                      label="الوصف"
                      placeholder="الوصف"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button variant={'Hdf'} type="submit">إضافة</Button>
        </form>
      </Form>
      <CategoryTabel info={[]} page='2' pageSize='5' total={5}/>
    </div>
  )
}
