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
import { axiosInstance, getApi, postApi } from '../../../lib/http'
import { useAuthHeader, useSignIn } from 'react-auth-kit'
import { Pen } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Pharmacy, Square,AccreditedInfo  } from '@renderer/types'
import FileUploader from '@renderer/components/fileUploader'

const formSchema = z.object({
  squareGlobalId: z.string(),
  treatmentSite: z.string(),
  doctor: z.string(),
  state: z.string(),
  numberOfRfid: z.string(),
  formNumber: z.string(),
  applicantGlobalId: z.string(),
  pharmacyGlobalId: z.string(),
  type: z.string(),
  prescriptionDate: z.string(),
  atch: z.instanceof(File),
  pt: z.instanceof(File)
})

type AccreditedFormValue = z.infer<typeof formSchema>

export default function FormAccredited() {
  const signIn = useSignIn()
  const { toast } = useToast()
  const navigate = useNavigate()
  const form = useForm<AccreditedFormValue>({
    resolver: zodResolver(formSchema)
  })
  const [Rfid, setRfid] = useState('')
  const [statuses, setstatuse] = useState<{ id: string; label: string }[]>([
    { id: 'مستمر', label: 'مستمر' },
    { id: 'موقف', label: 'موقف' }

    // Add more options as needed
  ])
  const authToken = useAuthHeader()
  const { data: Pharmacys } = useQuery({
    queryKey: ['Pharmacy'],
    queryFn: () =>
      getApi<Pharmacy[]>('/pharmacy', {
        headers: {
          Authorization: authToken()
        }
      })
  })
  const { data: squares } = useQuery({
    queryKey: ['square'],
    queryFn: () =>
      getApi<Square[]>('/square', {
        headers: {
          Authorization: authToken()
        }
      })
  })
  const { data: applicant } = useQuery({
    queryKey: ['applicant'],
    queryFn: () =>
      getApi<Square[]>('/applicant', {
        headers: {
          Authorization: authToken()
        }
      })
  })

  const [type, settype] = useState([
    { type: 'جواز', label: ' جواز' },
    { type: 'بطاقة', label: ' بطاقة' }

    // Add more options as needed
  ])
  const [states, setStates] = useState([
    { value: '1', label: 'نشط' },
    { value: '2', label: 'غير نشط' }

    // Add more options as needed
  ])
  const [delayedSubmitting, setDelayedSubmitting] = useState(form.formState.isSubmitting)
  const generateRfid = () => {
    // Example function to generate a random RFID number
    const newRfid = Math.floor(100000000 + Math.random() * 900000000).toString()
    setRfid(newRfid)
    form.setValue('numberOfRfid', newRfid) // Update the form's value if using a form library like React Hook Form
  }
  const { mutate} = useMutation({
    // mutationKey: ['AccreditedInfo'],
    mutationFn: (datas: AccreditedFormValue) =>
      postApi(
        '/accredited',
        {
          squareGlobalId: datas.squareGlobalId,
          treatmentSite: datas.treatmentSite,
          doctor: datas.doctor,
          state: datas.state,
          numberOfRfid: datas.numberOfRfid,
          formNumber: datas.formNumber,
          applicantGlobalId: datas.applicantGlobalId,
          pharmacyGlobalId: datas.pharmacyGlobalId,
          type: datas.type,
          prescriptionDate: datas.prescriptionDate,
          atch:datas.atch,
          pt:datas.pt

        },
        {
          headers: {
            Authorization: `${authToken()}`
          }
        }
      ),
    onSuccess: (data, variables, context) => {
      toast({
        title: 'تمت العملية',
        description: 'تمت الاضافة بنجاح',
        variant: 'success'
      })
    },
    onError: (error, variables, context) => {
      toast({
        title: 'لم  تتم العملية',
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  const onSubmit = async (data: AccreditedFormValue) => {
    console.log('🚀 ~ onSubmit ~ data:yty ty ty ty t yty ')
    mutate(data)

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
          <h1 className="text-2xl font-bold"> بيانات المعتمد</h1>
        </div>
        <div className="flex justify-between">
          <div>
            <Button
              variant={'outline'}
              className="w-[120px]"
              onClick={() => navigate('/accredited')}
            >
              رجوع
            </Button>
          </div>
          <div className="flex gap-2"></div>
        </div>

        <div className="flex  flex-col justify-center px-6 gap-16 bg-white rounded-[8px] pb-20">
          <div className="border-[#DADADA80]/50 border-b-2 ">
            <div className="w-fit border-[#196CB0] border-b-2 pb-4 pt-2">
              <h1 className="text-xl font-bold  text-[#196CB0]   "> بيانات المعتمد </h1>
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
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <FormField
                        control={form.control}
                        name="doctor"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                label=" اسم الدكتور"
                                placeholder="اسم الدكتور  "
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
                        name="treatmentSite"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                label="اسم المركز الصحي"
                                placeholder="اسم المركز الصحي"
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

                    <div className="col-span-1 flex gap-2">
                      <div className="grid grid-cols-5 gap-2">
                        <div className="col-span-4">
                          <FormField
                            control={form.control}
                            name="numberOfRfid"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    readOnly
                                    label="رقم بطاقة الصرف"
                                    placeholder="ادخل رقم بطاقة الصرف"
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
                          <Button
                            variant="keep"
                            className="w-[104px] h-[42px] bg-[#196CB0]"
                            onClick={generateRfid}
                            type="button"
                          >
                            توليد رقم
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <FormField
                        control={form.control}
                        name="formNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                label="رقم الاستمارة"
                                placeholder="ادخل رقم الاستمارة"
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
                                    {statuses.map((statuse) => (
                                      <SelectItem key={statuse.id} value={statuse.id}>
                                        {statuse.label}
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
                        name="pharmacyGlobalId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="">
                                  <SelectValue placeholder="اختر الصيدلية" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>الحالات</SelectLabel>
                                    {Pharmacys?.data.map((pharmacy) => (
                                      <SelectItem key={pharmacy.globalId} value={pharmacy.name}>
                                        {pharmacy.name}
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
                        name="squareGlobalId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="">
                                  <SelectValue placeholder="اخر المربع" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>الامراض</SelectLabel>
                                    {squares?.data.map((square) => (
                                      <SelectItem key={square.globalId} value={square.globalId}>
                                        {square.name}
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
                        name="prescriptionDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FormField
                                control={form.control}
                                name="prescriptionDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        label="تاريخ الوصفة"
                                        placeholder="ادخل تاريخ الوصفة"
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
                    <div className="col-span-1 ">
                      <FormField
                        control={form.control}
                        name="applicantGlobalId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="">
                                  <SelectValue placeholder="اخر المتقدم" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>الحالات</SelectLabel>
                                    {applicant?.data.map((applicant) => (
                                      <SelectItem
                                        key={applicant.globalId}
                                        value={applicant.globalId}
                                      >
                                        {applicant.name}
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
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="col-span-1 ">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="">
                                  <SelectValue placeholder="اخر نوع الهوية" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>الحالات</SelectLabel>
                                    {type.map((applicant) => (
                                      <SelectItem key={applicant.type} value={applicant.type}>
                                        {applicant.label}
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
                        name="pt"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FileUploader
                                title=" ارفق الهوية الشخصية"
                                setValue={form.setValue}
                                inputId="pt"
                                onChange={async (files) => {
                                  try {
                                    if (!files?.[0]) return
                                    field.onChange(files[0])
                                  } catch (error) {
                                    JSON.stringify(error)
                                  }
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-1 ">
                      <FormField
                        control={form.control}
                        name="atch"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FileUploader
                                title="ارفق الوصفة الطبية"
                                setValue={form.setValue}
                                inputId="atch"
                                onChange={async (files) => {
                                  try {
                                    if (!files?.[0]) return
                                    field.onChange(files[0])
                                  } catch (error) {
                                    JSON.stringify(error)
                                  }
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4 ">
                  <Button type="submit" variant={'keep'} className="w-[120px]">
                    حفظ
                  </Button>
                  <Button
                    variant="outline"
                    className="w-[120px]"
                    onClick={() => navigate('/accredited')}
                  >
                    الغاء
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}
