import * as React from 'react'
import { useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthHeader } from 'react-auth-kit'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { AlertCircle, LoaderIcon } from 'lucide-react'
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
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert'
import { useToast } from '../../ui/use-toast'
import { cn } from '../../../lib/utils'
import { axiosInstance, getApi, postApi, putApi } from '../../../lib/http'
import { AccreditedRes, Pharmacy } from '@renderer/types'
import Pdf from '@renderer/components/icons/pdf'
import { FormInput } from '@renderer/components/ui/forms-input'

const formSchema = z.object({
  totalAmount: z.number(),
  amountPaid: z.number(),
  approvedAmount: z.number()
})

export interface DismissInfo {
  id: number
  globalId: string
  month: string
  year: string
  dateToDay: Date
  state: string
  totalAmount: number
  amountPaid: number
  approvedAmount: number
  openDismissal: boolean
  deleted: boolean
  accreditedGlobalId: string
  version: number
  lastModified: Date
}

export interface AccreditedByID {
  id: number
  globalId: string
  squareGlobalId: string
  treatmentSite: string
  doctor: string
  state: string
  numberOfRfid: number
  formNumber: number
  deleted: boolean
  applicantGlobalId: string
  pharmacyGlobalId: string
  version: number
  lastModified: Date
}

type AccreditedFormValue = z.infer<typeof formSchema>

export default function EditDismissal() {
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const authToken = useAuthHeader()

  const [modalOpen, setModalOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [numberOfRfid, setNumberOfRfid] = useState('')
  const [number, setNumber] = useState<AccreditedRes>()
  const [checkNum, setCheckNum] = useState('')
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [approvedAmounts, setApprovedAmounts] = useState<number>(0)
  const [totalAmounts, setTotalAmounts] = useState<number>(0)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [pharmacy, setPharmacy] = useState<Pharmacy[]>([])

  const { data: DismissInfos, isLoading } = useQuery({
    queryKey: ['DismissInfo'],
    queryFn: () =>
      getApi<DismissInfo[]>('/dismissal', {
        params: {
          globalId: id
        }
      })
  })

  const { data: AccreditedByID, isPending } = useQuery({
    queryKey: ['AccreditedByID'],
    queryFn: () =>
      getApi<AccreditedByID[]>('/accredited', {
        params: {
          globalId: DismissInfos?.data?.[0]?.accreditedGlobalId
        }
      }),
    enabled: !!DismissInfos?.data?.[0]?.accreditedGlobalId
  })

  const form = useForm<AccreditedFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalAmount: 0,
      approvedAmount: 0,
      amountPaid: 0
    }
  })

  React.useEffect(() => {
    if (DismissInfos?.data?.[0]) {
      const current = DismissInfos.data[0]
      form.setValue('totalAmount', current.totalAmount)
      form.setValue('amountPaid', current.amountPaid)
      form.setValue('approvedAmount', current.approvedAmount)
    }
  }, [DismissInfos, form])

  React.useEffect(() => {
    if (number && number.info.length > 0) {
      const applicant = number.info[0].applicant
      if (applicant?.category?.SupportRatio !== undefined) {
        setApprovedAmounts(applicant.category.SupportRatio)
      } else {
        setApprovedAmounts(0)
        toast({
          title: 'بيانات غير كاملة',
          description: 'لا توجد معلومات كافية حول الدعم لهذا الرقم.',
          variant: 'destructive'
        })
      }
    } else {
      setApprovedAmounts(0)
    }
    const supportRatio =
      DismissInfos?.data?.[0]?.approvedAmount ||
      number?.info?.[0]?.applicant?.category?.SupportRatio ||
      0
    if (supportRatio !== approvedAmounts) {
      setApprovedAmounts(supportRatio)
    }
    let computedPrice = 0
    if (totalAmounts > 50000) {
      const excessAmount = totalAmounts - 50000
      const approvedPercentage = (50000 * supportRatio) / 100
      const reducedAmount = 50000 - approvedPercentage
      computedPrice = reducedAmount + excessAmount
    } else {
      computedPrice = totalAmounts - (totalAmounts * supportRatio) / 100
    }
    setTotalPrice(computedPrice)
    form.setValue('amountPaid', computedPrice)
    form.setValue('totalAmount', totalAmounts)
  }, [totalAmounts, DismissInfos, number, form, approvedAmounts, toast])

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [numberOfRfid])

  React.useEffect(() => {
    if (number && number.info.length > 0) {
      form.setValue('amountPaid', totalPrice)
      form.setValue('approvedAmount', number.info[0].applicant?.category?.SupportRatio || 0)
    }
  }, [number, totalPrice, form])

  React.useEffect(() => {
    const fetchPharmacyDirectorate = async () => {
      try {
        const response = await axiosInstance.get('/pharmacy', {
          headers: {
            Authorization: `${authToken()}`
          }
        })
        setPharmacy(response.data)
      } catch (error) {
        toast({
          title: 'حدث خطأ',
          description: 'فشل في جلب بيانات الصيدليات. يرجى المحاولة لاحقاً.',
          variant: 'destructive'
        })
      }
    }
    fetchPharmacyDirectorate()
  }, [authToken, toast])

  const { mutate: checkMutation } = useMutation({
    mutationFn: () =>
      postApi(
        '/dismissal/check',
        { numberOfRfid: +numberOfRfid },
        { headers: { Authorization: `${authToken()}` } }
      ),
    onSuccess: async (data: any) => {
      if (data.data === null) {
        if (numberOfRfid === '') {
          toast({
            title: 'يرجى ادخال رقم البطاقة',
            variant: 'destructive'
          })
          return
        }
        try {
          const response = await axiosInstance.get(
            `/accredited?page=1&pageSize=4&include[prescription]=true&numberOfRfid=${
              AccreditedByID?.data?.[0]?.numberOfRfid
            }&include[applicant][include]=category&include[attachment]=true`,
            {
              headers: {
                Authorization: `${authToken()}`
              }
            }
          )
          if (response.data && response.data.info && response.data.info.length > 0) {
            setNumber(response.data)
            setShowAlert(false)
          } else {
            setNumber(undefined)
            toast({
              title: 'رقم البطاقة غير صالح',
              description: 'لم يتم العثور على البيانات المتعلقة برقم البطاقة المدخل.',
              variant: 'destructive'
            })
          }
        } catch (error) {
          toast({
            title: 'حدث خطأ',
            description: 'فشل في جلب بيانات RFID. يرجى المحاولة لاحقاً.',
            variant: 'destructive'
          })
        }
        queryClient.invalidateQueries({ queryKey: ['accredited'] })
      } else {
        setCheckNum(data.data.message)
      }
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

  const handleCheck = () => {
    checkMutation()
  }

  const handleClose = () => {
    setCheckNum('')
    setNumberOfRfid('')
  }

  const { mutate } = useMutation({
    mutationFn: (datas: AccreditedFormValue) =>
      putApi(
        `/dismissal/${id}`,
        {
          totalAmount: +datas.totalAmount,
          approvedAmount: +datas.approvedAmount,
          amountPaid: +datas.amountPaid
        },
        {
          headers: {
            Authorization: `${authToken()}`
          }
        }
      ),
    onSuccess: (data: any) => {
      const successMessage = data?.data?.message || 'تم التعديل بنجاح'
      toast({
        title: 'تمت العملية',
        description: successMessage,
        variant: 'success'
      })
 
      queryClient.invalidateQueries({ queryKey: ['dismissal'] })
     
      queryClient.invalidateQueries({ queryKey: ['DismissInfo'] })
      queryClient.invalidateQueries({ queryKey: ['ApplicantByDirectorateViewModel'] })
      queryClient.invalidateQueries({ queryKey: ['ApplicantByDirectorateViewModelCard'] })

      navigate('/dismissal')
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

  const openModal = () => {
    if (number?.info?.[0]?.prescription[0]?.attachedUrl) {
      setModalOpen(true)
    }
  }

  const closeModal = () => {
    setModalOpen(false)
  }

 
  const attachedUrlPrec = number?.info?.[0]?.prescription?.[0]?.attachedUrl ?? 'لايوجد'
  const isPDF = attachedUrlPrec.toLowerCase().endsWith('.pdf')

  const onSubmit = async (data: AccreditedFormValue) => {
    mutate(data)
  }

  if (isLoading || isPending) {
    return (
      <div className="flex justify-center items-center w-full">
        <LoaderIcon className="mt-12 flex animate-spin items-center justify-end duration-1000" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">بيانات الصرف</h1>
      </div>
      <div className="flex justify-between">
        <div>
          <Button variant="outline" className="w-[120px]" onClick={() => navigate('/dismissal')}>
            رجوع
          </Button>
        </div>
        <div className="flex gap-2" />
      </div>
      <div className="flex flex-col justify-center px-6 gap-16 bg-white rounded-[8px] pb-20">
        <div className="border-[#DADADA80]/50 border-b-2">
          <div className="w-fit border-[#196CB0] border-b-2 pb-4 pt-2">
            <h1 className="text-xl font-bold text-[#196CB0]">بيانات الصرف</h1>
          </div>
        </div>
        {showAlert && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>الصرف في هذه الصيدلية غير متاح حالياً</AlertDescription>
          </Alert>
        )}
        {checkNum && (
          <div className="fixed inset-0 bg-transparent z-50 flex items-center justify-center p-4">
            <Alert className="max-w-md relative top-20 z-50 w-full shadow-lg p-4 flex flex-col sm:flex-row sm:items-start">
              <div className="flex-shrink-0">
                <AlertCircle className="h-10 w-10 rounded-full p-2 bg-[#FEF0C7] text-orange-500" />
              </div>
              <div className="sm:ml-4 mt-2 sm:mt-0 flex-1">
                <AlertTitle className="text-lg font-semibold text-gray-900">تنبيه</AlertTitle>
                <AlertDescription className="mt-2 text-sm text-gray-600">
                  {checkNum}
                </AlertDescription>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" className="text-sm w-full sm:w-32" onClick={handleClose}>
                    إغلاق
                  </Button>
                </div>
              </div>
            </Alert>
          </div>
        )}
        <Form {...form}>
          <form
            id="formId"
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn('w-full space-y-4', {
              'pointer-events-none opacity-50': form.formState.isSubmitting
            })}
          >
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1 flex gap-2">
                  <div className="grid grid-cols-5 gap-2">
                    <div className="col-span-3">
                      <label className="text-[#A2A1A8]">البطاقة</label>
                      <input
                        ref={inputRef}
                        type="text"
                        value={AccreditedByID?.data?.[0]?.numberOfRfid || ''}
                        readOnly
                        placeholder="ادخل رقم البطاقة"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="col-span-1 translate-y-6">
                      <Button
                        className="w-[104px] h-[42px] bg-[#196CB0] hover:bg-[#2b4d68]"
                        onClick={handleCheck}
                        type="button"
                        disabled
                      >
                        مسح البطاقة
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="text-[#A2A1A8]">الصيدلية</label>
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الصيدلية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>الصيدلية</SelectLabel>
                        {pharmacy.map((p) => (
                          <SelectItem key={p.globalId} value={p.globalId}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1">
                  <label className="text-[#A2A1A8]">الاجمالي</label>
                  <FormField
                    control={form.control}
                    name="totalAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FormInput
                            label="ادخل الاجمالي"
                            type="text"
                            onChange={(e) => {
                              const value = Number(e.target.value)
                              setTotalAmounts(value)
                              field.onChange(e)
                            }}
                            disabled={form.formState.isSubmitting}
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
                  <label className="text-[#A2A1A8]">المبلغ المطلوب</label>
                  <FormField
                    control={form.control}
                    name="amountPaid"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <FormInput
                            type="text"
                            value={totalPrice.toLocaleString()}
                            disabled
                            className="text-right bg-primary/5"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[#A2A1A8]">نسبة الدعم</label>
                  <FormField
                    control={form.control}
                    name="approvedAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FormInput
                            label="ادخل نسبة الدعم"
                            type="number"
                            disabled
                            value={field.value}
                            onChange={(e) => {
                              const parsedValue = Number(e.target.value) || 0
                              setApprovedAmounts(parsedValue)
                              field.onChange(parsedValue)
                            }}
                            className="text-right bg-primary/5"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[#A2A1A8]">المعتمد</label>
                  <FormInput
                    label="المعتمد"
                    className="h-10 p-0 rounded-xl text-sm"
                    placeholder="المعتمد"
                    value={number?.info?.[0]?.applicant?.name || ''}
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="text-[#A2A1A8]">رقم هاتف المعتمد</label>
                  <FormInput
                    label="رقم هاتف المعتمد"
                    className="h-10 p-0 rounded-xl text-sm"
                    placeholder="المعتمد"
                    value={number?.info?.[0]?.applicant?.phoneNumber || ''}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-start gap-4 h-40">
              <h1 className="mb-5 text-[#8B8D97]">عرض ملف الوصفة الطبية</h1>
              <a onClick={openModal} className="cursor-pointer">
                <Pdf />
              </a>
              {modalOpen && (
                <div
                  className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
                  onClick={closeModal}
                >
                  <div
                    className="relative w-[100%] h-[100%] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isPDF ? (
                      <>
                        <iframe
                          src={attachedUrlPrec}
                          className="w-full h-full"
                          frameBorder="0"
                        ></iframe>
                        <button
                          onClick={closeModal}
                          className="absolute top-4 right-4 p-2 rounded-full bg-white text-black hover:bg-gray-200"
                        >
                          &times;
                        </button>
                      </>
                    ) : (
                      <>
                        <img
                          src={attachedUrlPrec}
                          className="w-[80%] h-[80%] mx-auto object-fill"
                          alt=""
                        />
                        <button
                          onClick={closeModal}
                          className="absolute top-4 right-4 p-2 rounded-full bg-white text-black hover:bg-gray-200"
                        >
                          &times;
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            
            </div>
            <div className="flex justify-end gap-4">
              <Button type="submit" className="w-[120px] bg-[#196CB0] hover:bg-[#2b4d68]">
                حفظ
              </Button>
              <Button
                variant="outline"
                className="w-[120px]"
                onClick={() => navigate('/dismissal')}
              >
                إلغاء
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
