'use client'
import * as React from 'react'
import { Button } from '../../ui/button'
import { Form, FormControl, FormField, FormItem } from '../../ui/form'
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
import { axiosInstance, postApi } from '../../../lib/http'
import { useAuthHeader } from 'react-auth-kit'
import { MoveRight } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormInput } from '@renderer/components/ui/forms-input'
import { Combobox } from '@renderer/components/ui/Combobox'

const formSchema = z.object({
  name: z.string(),
  age: z.string(),
  dateOfBirth: z.string(),
  placeOfBirth: z.string(),
  currentResidence: z.string(),
  gender: z.string(),
  directorateGlobalId: z.string(),
  phoneNumber: z.string(),
  submissionDate: z.string(),
  diseaseGlobalId: z.string(),
  categoryGlobalId: z.string(),
  state: z.string()
})

type UserFormValue = z.infer<typeof formSchema>
export type Category = {
  id: number
  globalId: string
  name: string
  SupportRatio: number
  deleted: boolean
  description: string
  version: number
  lastModified: Date
}
export type GovernorateInfo = {
  id: number
  globalId: string
  name: string
  deleted: boolean
  version: number
  lastModified: Date
}
export type Governorate = {
  id: number
  globalId: string
  governorateGlobalId?: string
  name: string
  deleted: boolean
  version: number
  lastModified: Date
  Governorate?: GovernorateInfo
}
export type Disease = {
  id: number
  globalId: string
  name: string
  deleted: boolean
  description: string
  version: number
  lastModified: Date
}
export default function FormApplicant() {
  const [category, setCategory] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [directorates, setDirectorates] = useState<Governorate[]>([])
  const [selectedDirectorate, setSelectedDirectorate] = useState<Governorate | null>(null)
  const [disease, setDisease] = useState<Disease[]>([])
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null)
  const authToken = useAuthHeader()
  const { toast } = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema)
  })

  const [states, _setStates] = useState([
    { value: 'active', label: 'نشط' },
    { value: 'not active', label: 'غير نشط' }
  ])
  const [gender, _setGender] = useState([
    { value: 'M', label: 'ذكر' },
    { value: 'F', label: 'انثى' }
  ])
  const [delayedSubmitting, _setDelayedSubmitting] = useState(form.formState.isSubmitting)
  console.log('selectedDirectorate?.globalId', selectedDirectorate?.globalId)
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/category', {
          headers: {
            Authorization: `${authToken()}`
          }
        })
        setCategory(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    const fetchDirectorate = async () => {
      try {
        const response = await axiosInstance.get('/directorate', {
          headers: {
            Authorization: `${authToken()}`
          }
        })
        setDirectorates(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    const fetchDisease = async () => {
      try {
        const response = await axiosInstance.get('/disease', {
          headers: {
            Authorization: `${authToken()}`
          }
        })
        setDisease(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
    fetchDirectorate()
    fetchDisease()
  }, [])

  const { mutate } = useMutation({
    mutationKey: ['AddApplicant'],
    mutationFn: (data: UserFormValue) =>
      postApi(
        '/applicant',
        {
          name: data.name,
          age: +data.age,
          dateOfBirth: new Date(data.dateOfBirth).toISOString(),
          placeOfBirth: data.placeOfBirth,
          currentResidence: data.currentResidence,
          gender: data.gender,
          directorateGlobalId: data.directorateGlobalId,
          phoneNumber: data.phoneNumber,
          submissionDate: new Date(data.submissionDate).toISOString(),
          diseaseGlobalId: data.diseaseGlobalId,
          categoryGlobalId: data.categoryGlobalId,
          state: data.state
        },
        {
          headers: {
            Authorization: `${authToken()}`
          }
        }
      ),
    onSuccess: () => {
      toast({
        title: 'اشعار',
        variant: 'success',
        description: 'تمت الاضافة بنجاح'
      })
      queryClient.invalidateQueries({ queryKey: ['applicant'] })
      navigate('/applicants')
    },
    onError: (error) => {
      toast({
        title: 'لم تتم العملية',
        description: error.message,
        variant: 'destructive'
      })
    }
  })
  React.useEffect(() => {
    if (selectedDirectorate?.globalId) {
      console.log('selectedDirectorate?.globalId', selectedDirectorate.globalId)
      form.setValue('directorateGlobalId', selectedDirectorate.globalId)
    } else {
      form.setValue('directorateGlobalId', '')
    }

    if (selectedCategory?.globalId) {
      console.log('selectedCategory?.globalId', selectedCategory.globalId)
      form.setValue('categoryGlobalId', selectedCategory.globalId)
    } else {
      form.setValue('categoryGlobalId', '')
    }

    if (selectedDisease?.globalId) {
      console.log('selectedDisease?.globalId', selectedDisease.globalId)
      form.setValue('diseaseGlobalId', selectedDisease.globalId)
    } else {
      form.setValue('diseaseGlobalId', '')
    }
  }, [selectedDirectorate, selectedCategory])

  const onSubmit = async (data: UserFormValue) => {
    mutate(data)
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
              className="w-[120px] border-2 border-black flex justify-center items-center"
              onClick={() => navigate('/applicants')}
            >
              <MoveRight className="" />

              <h1 className="-translate-y-1 mr-2 font-bold">رجوع</h1>
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
                      <label htmlFor="" className="text-[#A2A1A8]">
                        الاسم
                      </label>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FormInput
                                label="ادخل الاسم"
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
                      <label htmlFor="" className="text-[#A2A1A8]">
                        الجنس
                      </label>
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="">
                                  <SelectValue placeholder="اختر الجنس" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>الجنس</SelectLabel>
                                    {gender.map((genders) => (
                                      <SelectItem key={genders.value} value={genders.value}>
                                        {genders.label}
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
                      <label htmlFor="" className="text-[#A2A1A8]">
                        العمر
                      </label>
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FormInput
                                label="ادخل العمر"
                                type="Text"
                                {...field}
                                disabled={delayedSubmitting}
                                className="text-right bg-primary/5"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2 ">
                      <label htmlFor="" className="text-[#A2A1A8]">
                        تاريخ الميلاد
                      </label>
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FormInput
                                type="date"
                                {...field}
                                disabled={delayedSubmitting}
                                lang="en"
                                className="text-right bg-primary/5 "
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <label htmlFor="" className="text-[#A2A1A8]">
                        رقم الجوال
                      </label>
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FormInput
                                label="ادخل رقم الجوال"
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
                      <label htmlFor="" className="text-[#A2A1A8]">
                        المديرية
                      </label>
                      <Combobox
                        options={directorates}
                        valueKey="id"
                        displayKey="name"
                        placeholder="أختر مديرية"
                        emptyMessage="لم يتم العثور على مديرية"
                        onSelect={(directorate) =>
                          setSelectedDirectorate(directorate as Governorate)
                        }
                      />
                    </div>
                    <div className="col-span-1">
                      <label htmlFor="" className="text-[#A2A1A8]">
                        السكن الحالي
                      </label>
                      <FormField
                        control={form.control}
                        name="currentResidence"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FormInput
                                label="ادخل السكن الحالي"
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
                      <label htmlFor="" className="text-[#A2A1A8]">
                        الأمراض
                      </label>
                      <Combobox
                        options={disease}
                        valueKey="id"
                        displayKey="name"
                        placeholder="أختر المرض"
                        emptyMessage="لم يتم العثور على الأمراض"
                        onSelect={(diseasies) => setSelectedDisease(diseasies as Disease)}
                      />
                    </div>
                    <div className="col-span-1 ">
                      <label htmlFor="" className="text-[#A2A1A8]">
                        الفئة
                      </label>
                      <Combobox
                        options={category}
                        valueKey="id"
                        displayKey="name"
                        placeholder="أختر فئة"
                        emptyMessage="لم يتم العثور على الفئة"
                        onSelect={(categories) => setSelectedCategory(categories as Category)}
                      />
                    </div>
                    <div className="col-span-1 ">
                      <label htmlFor="" className="text-[#A2A1A8]">
                        الحالة
                      </label>
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="">
                                  <SelectValue placeholder="اختر الحالة" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>الحالات</SelectLabel>
                                    {states.map((state) => (
                                      <SelectItem key={state.value} value={state.label}>
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
                    <div className="col-span-1">
                      <label htmlFor="" className="text-[#A2A1A8]">
                        مكان الميلاد
                      </label>
                      <FormField
                        control={form.control}
                        name="placeOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FormInput
                                label="ادخل مكان الميلاد"
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
                    <div className="col-span-1 ">
                      <label htmlFor="" className="text-[#A2A1A8]">
                        تاريخ التقديم
                      </label>
                      <FormField
                        control={form.control}
                        name="submissionDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FormInput
                                type="date"
                                {...field}
                                disabled={delayedSubmitting}
                                lang="en"
                                className="text-right bg-primary/5 "
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-[120px] bg-[#196CB0] hover:bg-[#2b4d68]">
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
