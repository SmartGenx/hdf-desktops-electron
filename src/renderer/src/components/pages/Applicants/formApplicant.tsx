'use client'
import * as React from 'react'
import { Button } from '../../ui/button'
import { Form, FormControl, FormField, FormItem } from '../../ui/form'
import { Input } from '../../ui/input'
import { useToast } from '../../ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { cn } from '../../../lib/utils'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../../../lib/http'
import { useSignIn } from 'react-auth-kit'
import Boutton from '@renderer/components/Boutton'
import { Mail } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(1, { message: 'ادخل الاسم الكامل' }),
  age: z.number().min(1, { message: 'ادخل العمر' }),
  dateOfBirth: z.string().min(1, { message: 'ادخل تاريخ الميلاد' }),
  placeOfBirth: z.string().min(1, { message: 'ادخل مكان الميلاد' }),
  currentResidence: z.string().min(1, { message: 'ادخل مكان السكن الحالي' }),
  gender: z.string().min(1, { message: 'ادخل الجنس' }),
  phoneNumber: z.string().min(1, { message: 'ادخل رقم الجوال' }),
  submissionDate: z.string().min(1, { message: 'ادخل تاريخ التقديم' }),
  state: z.string().min(1, { message: 'ادخل الحالة' })
})

type UserFormValue = z.infer<typeof formSchema>

export default function FormApplicant() {
  const signIn = useSignIn()
  const { toast } = useToast()
  const navigate = useNavigate()
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema)
  })
  const [delayedSubmitting, setDelayedSubmitting] = useState(form.formState.isSubmitting)

  const onSubmit = async (data: UserFormValue) => {
    try {
      const payload = {
        name: data.name,
        age: data.age,
        dateOfBirth: data.dateOfBirth,
        placeOfBirth: data.placeOfBirth,
        currentResidence: data.currentResidence,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        submissionDate: data.submissionDate,
        state: data.state
      }

      const response = await axiosInstance.post('/applicant', payload)

      if (response.status === 200 || response.status === 201) {
        const signInResult = signIn({
          token: response.data.token,
          expiresIn: 10080,
          tokenType: 'Bearer',
          authState: response.data
        })
        if (signInResult) {
          toast({
            title: 'مرحبا مجددا',
            description: 'تم تسجيل الدخول بنجاح',
            variant: 'success'
          })
          navigate('/')
        } else {
          toast({
            title: 'حصل خطا ما',
            description: 'حاول تسجيل الدخول مجددا',
            variant: 'destructive'
          })
        }
      }
    } catch (error) {
      console.error('Error occurred:', error)
      return JSON.stringify(error)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div>
            <Button
              variant={'outline'}
              className="w-[120px]"
              onClick={() => navigate('/applicants')}
            >
              رجوع
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="w-[120px]" onClick={() => navigate('/applicants')}>
              الغاء
            </Button>
            <Button variant={'keep'} className="w-[120px]">
              حفظ
            </Button>
          </div>
        </div>
        <div className="flex justify-center px-4 bg-red-600">
          <div className="w-full max-w-4xl">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn('w-full space-y-4', {
                  'pointer-events-none opacity-50': delayedSubmitting
                })}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            label="الاسم الكامل"
                            placeholder="ادخل الاسم الكامل"
                            type="text"
                            {...field}
                            disabled={delayedSubmitting}
                            className="text-right bg-primary/5"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            label="العمر"
                            placeholder="ادخل العمر"
                            type="number"
                            {...field}
                            disabled={delayedSubmitting}
                            className="text-right bg-primary/5"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            label="تاريخ الميلاد"
                            placeholder="ادخل تاريخ الميلاد"
                            type="date"
                            {...field}
                            disabled={delayedSubmitting}
                            className="text-right bg-primary/5"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="placeOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            label="مكان الميلاد"
                            placeholder="ادخل مكان الميلاد"
                            type="text"
                            {...field}
                            disabled={delayedSubmitting}
                            className="text-right bg-primary/5"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currentResidence"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            label="مكان السكن الحالي"
                            placeholder="ادخل مكان السكن الحالي"
                            type="text"
                            {...field}
                            disabled={delayedSubmitting}
                            className="text-right bg-primary/5"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            label="الجنس"
                            placeholder="ادخل الجنس"
                            type="text"
                            {...field}
                            disabled={delayedSubmitting}
                            className="text-right bg-primary/5"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            label="رقم الجوال"
                            placeholder="ادخل رقم الجوال"
                            type="text"
                            {...field}
                            disabled={delayedSubmitting}
                            className="text-right bg-primary/5"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="submissionDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            label="تاريخ التقديم"
                            placeholder="ادخل تاريخ التقديم"
                            type="date"
                            {...field}
                            disabled={delayedSubmitting}
                            className="text-right bg-primary/5"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            label="الحالة"
                            placeholder="ادخل الحالة"
                            type="text"
                            {...field}
                            disabled={delayedSubmitting}
                            className="text-right bg-primary/5"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  className="mt-4 h-12 w-full bg-[#196BAE] text-sm hover:bg-[#D4D5D5] hover:text-[#8D8D8D]"
                  type="submit"
                  disabled={delayedSubmitting}
                >
                  حفظ
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}
