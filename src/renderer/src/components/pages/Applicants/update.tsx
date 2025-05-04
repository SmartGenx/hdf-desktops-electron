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
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance, getApi, putApi } from '../../../lib/http'
import { useAuthHeader } from 'react-auth-kit'
import { MoveRight } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApplicantsInfoResp } from '@renderer/types'
import { FormInput } from '@renderer/components/ui/forms-input'

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
  const { toast } = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema)
  })

  const [states, _setStates] = useState('نشط')
  const [delayedSubmitting, _setDelayedSubmitting] = useState(form.formState.isSubmitting)

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

  const { isPending, data: applicants } = useQuery({
    queryKey: ['applicant', id],
    queryFn: () =>
      getApi<ApplicantsInfoResp[]>(`/applicant/${id}`, {
        // params: {
        //   'include[directorate]': true,
        //   'include[category]': true,
        //   'include[diseasesApplicants]': true,
        // },
        headers: {
          Authorization: authToken()
        }
      })
  })

  React.useEffect(() => {
    form.setValue('state', states)
    if (applicants?.data) {
      form.reset({
        name: applicants?.data[0].name,
        age: String(applicants?.data[0].age),
        dateOfBirth: new Date(applicants?.data[0].dateOfBirth).toISOString().split('T')[0],
        placeOfBirth: applicants?.data[0].placeOfBirth,
        currentResidence: applicants?.data[0].currentResidence,
        gender: applicants?.data[0].gender,
        directorateGlobalId: applicants?.data[0].directorateGlobalId,
        phoneNumber: applicants?.data[0].phoneNumber,
        submissionDate: new Date(applicants?.data[0].submissionDate).toISOString().split('T')[0],
        diseaseGlobalId: applicants?.data[0].diseasesApplicants[0].diseaseGlobalId,
        categoryGlobalId: applicants?.data[0].categoryGlobalId,
        state: applicants?.data[0].state
      })
    }
  }, [applicants?.data])

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
          state: states
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
        description: 'تم تحديث بيانات المريض بنجاح'
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
  if (isPending) return <div>loading...</div>
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
                              <FormInput
                                label="ادخل الجنس"
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
                              <FormInput
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
                      <label htmlFor="" className="text-[#A2A1A8] ">
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
                                lang="en"
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
                    <div className="col-span-1 ">
                      <label htmlFor="" className="text-[#A2A1A8] ">
                        رقم الجوال
                      </label>
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FormInput
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
                      <label htmlFor="" className="text-[#A2A1A8] ">
                        المديرية
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
                                    : String(applicants?.data[0].directorateGlobalId)
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
                    <div className="col-span-1 ">
                      <label htmlFor="" className="text-[#A2A1A8] ">
                        السكن الحالي
                      </label>
                      <FormField
                        control={form.control}
                        name="currentResidence"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FormInput
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
                                    : String(
                                        applicants?.data[0].diseasesApplicants[0].diseaseGlobalId
                                      )
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
                                    : String(applicants?.data[0].categoryGlobalId)
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
                    <div className="col-span-1">
                      <label htmlFor="" className="text-[#A2A1A8] ">
                        مكان الميلاد
                      </label>
                      <FormField
                        control={form.control}
                        name="placeOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FormInput
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
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    
                    <div className="col-span-1 ">
                      <label htmlFor="" className="text-[#A2A1A8] ">
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
                                lang="en"
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
