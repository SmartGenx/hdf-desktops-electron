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
import { axiosInstance, getApi, postApi } from '../../../lib/http'
import { useAuthHeader } from 'react-auth-kit'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AccreditedInfos, Pharmacy, Square, applicantType } from '@renderer/types'
import FileUploader from '@renderer/components/fileUploader'

const formSchema = z.object({
  squareGlobalId: z.string(),
  treatmentSite: z.string(),
  doctor: z.string(),
  numberOfRfid: z.string(),
  formNumber: z.string(),
  applicantGlobalId: z.string(),
  pharmacyGlobalId: z.string(),
  atch: z.instanceof(File),
  pt: z.instanceof(File),
  prescriptionDate: z.string(),
  type: z.string(),
  state: z.string()
})

type AccreditedFormValue = z.infer<typeof formSchema>

export default function UpdateAccredited() {
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const navigate = useNavigate()
  const authToken = useAuthHeader()
  const queryClient = useQueryClient()
  const [square, setSquare] = useState<Square[]>([])
  const [pharmacy, setPharmacy] = useState<Pharmacy[]>([])
  const [applicantType, setApplicantType] = useState<applicantType[]>([])
  const form = useForm<AccreditedFormValue>({
    resolver: zodResolver(formSchema)
  })
  const [_Rfid, setRfid] = useState('')
  const [statuses, _setstatuse] = useState<{ label: string; name: string }[]>([
    { label: 'مستمر', name: 'مستمر' },
    { label: 'موقف', name: 'موقف' }

    // Add more options as needed
  ])

  React.useEffect(() => {
    const fetchSetSquareData = async () => {
      try {
        const response = await axiosInstance.get('/square', {
          headers: {
            Authorization: `${authToken()}`
          }
        })
        setSquare(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    const fetchPharmacyDirectorate = async () => {
      try {
        const response = await axiosInstance.get('/pharmacy', {
          headers: {
            Authorization: `${authToken()}`
          }
        })
        setPharmacy(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    const fetchApplicantType = async () => {
      try {
        const response = await axiosInstance.get('/applicant', {
          headers: {
            Authorization: `${authToken()}`
          }
        })
        setApplicantType(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchSetSquareData()
    fetchPharmacyDirectorate()
    fetchApplicantType()
  }, [])

  const [type, _settype] = useState([
    { id: 1, label: ' جواز' },
    { id: 2, label: ' بطاقة' }

    // Add more options as needed
  ])
  const { isPending, data: accredited } = useQuery({
    queryKey: ['applicant', id],
    queryFn: () =>
      getApi<AccreditedInfos>(`/accredited`, {
        params: {
          'include[prescription]': true,
          globalId: id
        },
        headers: {
          Authorization: authToken()
        }
      })
  })
  console.log('accredited?.data[0].type', accredited?.data[0])
  React.useEffect(() => {
    if (accredited?.data[0]) {
      form.reset({
        doctor: accredited?.data[0].doctor,
        formNumber: String(accredited?.data[0].formNumber),
        treatmentSite: accredited?.data[0].treatmentSite,
        numberOfRfid: accredited?.data[0].numberOfRfid,
        applicantGlobalId: accredited?.data[0].applicantGlobalId,
        pharmacyGlobalId: accredited?.data[0].pharmacyGlobalId,
        prescriptionDate: new Date(accredited?.data[0].prescription[0].prescriptionDate)
          .toISOString()
          .split('T')[0],
        squareGlobalId: accredited?.data[0].squareGlobalId,
        type: accredited?.data[0].type,
        state: accredited?.data[0].state
      })
    }
  }, [accredited?.data[0]])
  const [delayedSubmitting, _setDelayedSubmitting] = useState(form.formState.isSubmitting)

  const generateRfid = () => {
    const newRfid = Math.floor(100000000 + Math.random() * 900000000).toString()
    setRfid(newRfid)
    form.setValue('numberOfRfid', newRfid)
  }
  const { mutate } = useMutation({
    mutationKey: ['AddAccredited'],
    mutationFn: (datas: AccreditedFormValue) => {
      const formData = new FormData()

      formData.append('squareGlobalId', datas.squareGlobalId)
      formData.append('treatmentSite', datas.treatmentSite)
      formData.append('doctor', datas.doctor)
      formData.append('state', datas.state)
      formData.append('numberOfRfid', datas.numberOfRfid)
      formData.append('formNumber', datas.formNumber)
      formData.append('applicantGlobalId', datas.applicantGlobalId)
      formData.append('pharmacyGlobalId', datas.pharmacyGlobalId)
      formData.append('type', datas.type)
      formData.append('prescriptionDate', new Date(datas.prescriptionDate).toISOString())
      if (datas.atch) {
        formData.append('atch', datas.atch)
      }
      if (datas.pt) {
        formData.append('pt', datas.pt)
      }

      // Return the API call to be executed
      return postApi('/accredited', formData, {
        headers: {
          Authorization: `${authToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      })
    },
    onSuccess: () => {
      toast({
        title: 'تمت العملية',
        description: 'تمت الاضافة بنجاح',
        variant: 'success'
      })
      queryClient.invalidateQueries({ queryKey: ['accredited'] })
      navigate('/accredited')
    },
    onError: (error) => {
      toast({
        title: 'لم تتم العملية',
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  const onSubmit = async (data: AccreditedFormValue) => {
    // console.log(data)
    mutate(data)
  }

  return (
    <div className="flex flex-col gap-6 ">
      <div className="">
        <h1 className="text-2xl font-bold"> بيانات المعتمد</h1>
      </div>
      <div className="flex justify-between">
        <div>
          <Button variant={'outline'} className="w-[120px]" onClick={() => navigate('/accredited')}>
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
                                  type="text"
                                  {...field}
                                  value={field.value} // Ensure the value comes from the field
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
                          // variant="keep"
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
                            <Select
                              onValueChange={field.onChange}
                              value={
                                field.value
                                  ? String(field.value) // Use field value if available
                                  : accredited?.data?.[0]?.state // Fallback to initial state value
                                    ? String(accredited.data[0].state)
                                    : '' // Empty string if state is unavailable
                              }
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="">
                                <SelectValue placeholder="اختر الحالة" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>الحالات</SelectLabel>
                                  {statuses.map((statuse) => (
                                    <SelectItem key={statuse.label} value={String(statuse.label)}>
                                      {statuse.name}
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
                            <Select
                              onValueChange={field.onChange}
                              value={
                                field.value
                                  ? String(field.value)
                                  : String(accredited?.data[0].pharmacyGlobalId)
                              }
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="">
                                <SelectValue placeholder="اختر الصيدلية" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>الحالات</SelectLabel>
                                  {pharmacy.map((pharmacy) => (
                                    <SelectItem key={pharmacy.globalId} value={pharmacy.globalId}>
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
                            <Select
                              onValueChange={field.onChange}
                              value={
                                field.value
                                  ? String(field.value)
                                  : String(accredited?.data[0].squareGlobalId)
                              }
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="">
                                <SelectValue placeholder="اخر المربع" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {square?.map((square) => (
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
                  </div>
                  <div className="col-span-1 ">
                    <FormField
                      control={form.control}
                      name="applicantGlobalId"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={
                                field.value
                                  ? String(field.value)
                                  : String(accredited?.data[0].applicantGlobalId)
                              }
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="">
                                <SelectValue placeholder="اخر المتقدم" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>المتقدمين</SelectLabel>
                                  {applicantType?.map((applicant) => (
                                    <SelectItem key={applicant.globalId} value={applicant.globalId}>
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
                            <Select
                              onValueChange={field.onChange}
                              value={
                                field.value
                                  ? String(field.value) // Use field value if available
                                  : accredited?.data?.[0]?.state // Fallback to initial state value
                                    ? String(accredited.data[0].state)
                                    : '' // Empty string if state is unavailable
                              }
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="">
                                <SelectValue placeholder="اخر نوع الهوية" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>الهويات</SelectLabel>
                                  {type.map((applicant) => (
                                    <SelectItem key={applicant.id} value={String(applicant.id)}>
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
                <Button type="submit" className="w-[120px]">
                  تعديل
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
  )
}
