'use client'
import * as React from 'react'
import { Button } from '../../ui/button'
import { Form, FormControl, FormField, FormItem } from '../../ui/form'
import { Input } from '../../ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '../../ui/select'
import { useToast } from '../../ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { cn } from '../../../lib/utils'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../../../lib/http'
import { useSignIn } from 'react-auth-kit'

const formSchema = z.object({
  name: z.string(),
  age: z.string(),
  dateOfBirth: z.string(),
  currentResidence: z.string(),
  gender: z.string(),
  phoneNumber: z.string(),
  directorateGlobalId: z.string(),
  diseaseGlobalId: z.string(),
  categoryGlobalId: z.string(),

  state: z.string()
})

type UserFormValue = z.infer<typeof formSchema>

export default function FormApplicant() {
  const signIn = useSignIn()
  const { toast } = useToast()
  const navigate = useNavigate()
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema)
  })
  const [directorates, setDirectorates] = useState([
    { value: 'directorate1', label: 'مدرية 1' },
    { value: 'directorate2', label: 'مدرية 2' },
    { value: 'directorate3', label: 'مدرية 3' }
    // Add more options as needed
  ])
  const [diseases, setDiseases] = useState([
    { value: 'directorate1', label: 'مرض 1' },
    { value: 'directorate2', label: 'مرض 2' },
    { value: 'directorate3', label: 'مرض 3' }
    // Add more options as needed
  ])
  const [category, setCategory] = useState([
    { value: 'directorate1', label: 'فئة 1' },
    { value: 'directorate2', label: 'فئة 2' },
    { value: 'directorate3', label: 'فئة 3' }
    // Add more options as needed
  ])
  const [states, setStates] = useState([
    { value: '1', label: 'نشط' },
    { value: '2', label: 'غير نشط' }

    // Add more options as needed
  ])
  const [delayedSubmitting, setDelayedSubmitting] = useState(form.formState.isSubmitting)

  const onSubmit = async (data: UserFormValue) => {
    console.log("🚀 ~ onSubmit ~ data:yty ty ty ty t yty ")

    // try {
    //   const payload = {
    //     name: data.name,
    //     age: data.age,
    //     dateOfBirth: data.dateOfBirth,
    //     placeOfBirth: data.placeOfBirth,
    //     currentResidence: data.currentResidence,
    //     gender: data.gender,
    //     directorateGlobalId: data.directorateGlobalId,
    //     phoneNumber: data.phoneNumber,
    //     submissionDate: data.submissionDate,
    //     diseaseGlobalId: data.diseaseGlobalId,
    //     categoryGlobalId: data.categoryGlobalId,
    //     state: data.state
    //   }
    //   console.log('🚀 ~ onSubmit ~ payload:', payload)

    //   const response = await axiosInstance.post('/applicant', payload)

    //   if (response.status === 200 || response.status === 201) {
    //     const signInResult = signIn({
    //       token: response.data.token,
    //       expiresIn: 10080,
    //       tokenType: 'Bearer',
    //       authState: response.data
    //     })
    //     if (signInResult) {
    //       toast({
    //         title: 'مرحبا مجددا',
    //         description: 'تم تسجيل الدخول بنجاح',
    //         variant: 'success'
    //       })
    //       navigate('/')
    //     } else {
    //       toast({
    //         title: 'حصل خطا ما',
    //         description: 'حاول تسجيل الدخول مجددا',
    //         variant: 'destructive'
    //       })
    //     }
    //   }
    // } catch (error) {
    //   console.error('Error occurred:', error)
    //   return JSON.stringify(error)
    // }
  }

  return (
    <>
      <div className="flex flex-col gap-6 ">
        <div className="">
          <h1 className="text-2xl font-bold">بيانات المتقدم</h1>
        </div>
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
            <Button form="formId" type="submit" variant={'keep'} className="w-[120px]">
              حفظ
            </Button>
          </div>
        </div>

        <div className="flex  flex-col justify-center px-6 gap-16 bg-white rounded-[8px] pb-20">
          <div className="border-[#DADADA80]/50 border-b-2 ">
            <div className="w-fit border-[#196CB0] border-b-2 pb-4 pt-2">
              <h1 className="text-xl font-bold  text-[#196CB0]   ">بيانات المتقدم </h1>
            </div>
          </div>

          <div>
            <Form {...form}>
              {process.env.NODE_ENV === 'development' && (
            <>
              <p>Ignore it, it just in dev mode</p>
              <div>{JSON.stringify(form.formState.errors)}</div>
            </>
          )}
              <form
                id="formId"
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn('w-full space-y-4', {
                  'pointer-events-none opacity-50': delayedSubmitting
                })}
              >
                <div className="  flex flex-col gap-6 ">
                  <div className="grid grid-cols-6 gap-2">
                    <div className="col-span-2">
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
                                className="text-right bg-[#EFF1F9]/50 rounded-[8px]"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1">
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                label="الجنس"
                                placeholder="ادخل الجنس"
                                type="number"
                                {...field}
                                disabled={delayedSubmitting}
                                className="text-right bg-primary/5"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1">
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                label=" العمر"
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
                    </div>
                    <div className="col-span-2">
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
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
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
                    </div>
                    <div className="col-span-1 ">
                      <FormField
                        control={form.control}
                        name="directorateGlobalId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="">
                                  <SelectValue placeholder="اخر مديرية" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>المديريات</SelectLabel>
                                    {directorates.map((directorate) => (
                                      <SelectItem key={directorate.value} value={directorate.value}>
                                        {directorate.label}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1">
                      <FormField
                        control={form.control}
                        name="currentResidence"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                label="السكن الحالي"
                                placeholder="السكن الحالي"
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
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1 ">
                      <FormField
                        control={form.control}
                        name="diseaseGlobalId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="">
                                  <SelectValue placeholder="اخر المرض" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>الامراض</SelectLabel>
                                    {diseases.map((disease) => (
                                      <SelectItem key={disease.value} value={disease.value}>
                                        {disease.label}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1 ">
                      <FormField
                        control={form.control}
                        name="categoryGlobalId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="">
                                  <SelectValue placeholder="اخر فئة" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>الفئات</SelectLabel>
                                    {category.map((category) => (
                                      <SelectItem key={category.value} value={category.value}>
                                        {category.label}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1 ">
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="">
                                  <SelectValue placeholder="اخر الحالة" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>الحالات</SelectLabel>
                                    {states.map((state) => (
                                      <SelectItem key={state.value} value={state.value}>
                                        {state.label}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1 ">
                      <FormField
                        control={form.control}
                        name="diseaseGlobalId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FormField
                                control={form.control}
                                name="currentResidence"
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
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <Button  type="submit" variant={'keep'} className="w-[120px]">
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
