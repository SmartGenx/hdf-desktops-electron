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
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance, postApi, putApi } from '../../../lib/http'
import { useAuthHeader, useSignIn } from 'react-auth-kit'
import { MoveRight } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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
export type ApplicantResponse = {
  id: number
  globalId: string
  name: string
  age: number
  dateOfBirth: Date
  placeOfBirth: string
  currentResidence: string
  gender: string
  directorateGlobalId: string
  phoneNumber: string
  submissionDate: Date
  deleted: boolean
  accredited: boolean
  categoryGlobalId: string
  state: string
  version: number
  lastModified: Date
}
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
export default function UpdateApplicant() {
  const { id } = useParams<{ id: string }>()
  const [category, setCategory] = useState<Category[]>([])
  const [directorates, setDirectorates] = useState<Governorate[]>([])
  const [disease, setDisease] = useState<Disease[]>([])
  const authToken = useAuthHeader()
  const signIn = useSignIn()
  const { toast } = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema)
  })

  const [states, setStates] = useState([
    { value: 'active', label: 'نشط' },
    { value: 'not active', label: 'غير نشط' }

    // Add more options as needed
  ])
  const [delayedSubmitting, setDelayedSubmitting] = useState(form.formState.isSubmitting)

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

  const fetchAgencyData = async () => {
    const response = await axiosInstance.get<ApplicantResponse>(`/applicant/${id}`, {
      headers: {
        Authorization: `${authToken()}`
      }
    })
    return response.data
  }
  const {
    data: applicantData,
    error: applicantError,
    isLoading: applicantIsLoading
  } = useQuery({
    queryKey: ['applicant', id],
    queryFn: fetchAgencyData,
    enabled: !!id
  })

  console.log('asdsdas', applicantData.d)
  React.useEffect(() => {
    if (applicantData) {
      form.reset({
        name: applicantData.name,
        age: String(applicantData.age),
        dateOfBirth: new Date(applicantData.dateOfBirth).toISOString().split('T')[0],
        placeOfBirth: applicantData.placeOfBirth,
        currentResidence: applicantData.currentResidence,
        gender: applicantData.gender,
        directorateGlobalId: applicantData.directorateGlobalId,
        phoneNumber: applicantData.phoneNumber,
        submissionDate: new Date(applicantData.submissionDate).toISOString().split('T')[0],
        diseaseGlobalId: applicantData.directorateGlobalId,
        categoryGlobalId: applicantData.categoryGlobalId,
        state: applicantData.state
      })
    }
  }, [applicantData])

  const { mutate } = useMutation({
    mutationKey: ['AddApplicant'],
    mutationFn: (data: UserFormValue) =>
      putApi(
        `/applicant/${id}`,
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
                      <label htmlFor="" className="text-[#A2A1A8]">
                        الاسم الكامل
                      </label>
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
                      <label htmlFor="" className="text-[#A2A1A8]">
                        الجنس
                      </label>
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
                              <Input
                                label=" العمر"
                                placeholder="ادخل العمر"
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
                    <div className="col-span-2 translate-y-6">
                      <label htmlFor="" className="text-[#A2A1A8] "></label>
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
                      <label htmlFor="" className="text-[#A2A1A8]">
                        مديرية
                      </label>
                      <FormField
                        control={form.control}
                        name="directorateGlobalId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={
                                  field.value
                                    ? String(field.value)
                                    : String(applicantData?.directorateGlobalId)
                                }
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="">
                                  <SelectValue placeholder="اخر مديرية" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>المديريات</SelectLabel>
                                    {directorates.map((directorate) => (
                                      <SelectItem key={directorate.id} value={directorate.globalId}>
                                        {directorate.name}
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
                        السكن الحالي
                      </label>
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
                      <label htmlFor="" className="text-[#A2A1A8]">
                        الأمراض
                      </label>
                      <FormField
                        control={form.control}
                        name="diseaseGlobalId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={
                                  field.value
                                    ? String(field.value)
                                    : String(applicantData?.directorateGlobalId)
                                }
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="">
                                  <SelectValue placeholder="اختر المرض" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>الامراض</SelectLabel>
                                    {disease.map((diseases) => (
                                      <SelectItem key={diseases.id} value={diseases.globalId}>
                                        {diseases.name}
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
                      <label htmlFor="" className="text-[#A2A1A8]">
                        الفئة
                      </label>
                      <FormField
                        control={form.control}
                        name="categoryGlobalId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={
                                  field.value
                                    ? String(field.value)
                                    : String(applicantData?.categoryGlobalId)
                                }
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="">
                                  <SelectValue placeholder="اختر فئة" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {category.map((category) => (
                                      <SelectItem key={category.id} value={category.globalId}>
                                        {category.name}
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
                      <label htmlFor="" className="text-[#A2A1A8]">
                        الحالة
                      </label>
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={
                                  field.value ? String(field.value) : String(applicantData?.state)
                                }
                                defaultValue={field.value}
                              >
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
                    <div className="col-span-1">
                      <label htmlFor="" className="text-[#A2A1A8]">
                        مكان الولادة
                      </label>
                      <FormField
                        control={form.control}
                        name="placeOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                label="مكان الولادة"
                                placeholder="ادخل مكان الولادة"
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
                    <div className="col-span-1 translate-y-[1.55rem]">
                      <FormField
                        control={form.control}
                        name="submissionDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                label="تاريخ الميلاد"
                                placeholder="ادخل تاريخ الميلاد"
                                type="date"
                                {...field}
                                disabled={delayedSubmitting}
                                className="text-right bg-primary/5 "
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-[120px] bg-[#196CB0]">
                  تعديل
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}
