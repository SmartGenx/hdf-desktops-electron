import * as React from 'react'
import { useParams } from 'react-router-dom'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { cn } from '../../../lib/utils'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance, getApi, postApi, putApi } from '../../../lib/http'
import { useAuthHeader } from 'react-auth-kit'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AccreditedRes, Pharmacy } from '@renderer/types'
import Pdf from '@renderer/components/icons/pdf'
import { AlertCircle, LoaderIcon } from 'lucide-react'
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
  const [modalOpen, setModalOpen] = useState(false)
  const [modalPtOpen, setModalPtOpen] = useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: DismissInfos } = useQuery({
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
          globalId: DismissInfos?.data[0].accreditedGlobalId
        }
      })
  })
  console.log('🚀 ~ EditDismissal ~ AccreditedByID:', DismissInfos?.data[0].approvedAmount)

  const [numberOfRfid, setNumberOfRfid] = useState('')
  const [number, setNumber] = useState<AccreditedRes>()

  const [checkNum, setCheckNum] = useState('')
  const { mutate: checkMutation } = useMutation({
    // mutationKey: ['AccreditedInfo'],
    mutationFn: () =>
      postApi(
        '/dismissal/check',
        {
          numberOfRfid: +numberOfRfid
        },
        {
          headers: {
            Authorization: `${authToken()}`
          }
        }
      ),
    onSuccess: async (data: any) => {
      if (data.data === null) {
        if (numberOfRfid === '') {
          toast({
            title: 'يرجى ادخل رقم البطاقة',
            variant: 'destructive'
          })
          return // Early return to prevent further execution
        }

        try {
          const response = await axiosInstance.get(
            `/accredited?page=1&pageSize=4&include[prescription]=true&numberOfRfid=${AccreditedByID?.data[0].numberOfRfid.toString()}&include[applicant][include]=category&include[attachment]=true`,
            {
              headers: {
                Authorization: `${authToken()}`
              }
            }
          )

          // Check if the response has the expected structure
          if (response.data && response.data.info && response.data.info.length > 0) {
            setNumber(response.data)
            setShowAlert(false) // Hide any previous alerts
          } else {
            // Handle cases where data is not as expected
            setNumber(undefined)
            toast({
              title: 'رقم البطاقة غير صالح',
              description: 'لم يتم العثور على البيانات المتعلقة برقم البطاقة المدخل.',
              variant: 'destructive'
            })
          }
        } catch (error) {
          console.error('Error fetching RFID data:', error)
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
  const form = useForm<AccreditedFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalAmount: DismissInfos?.data[0]?.totalAmount || 0,
      approvedAmount:
        DismissInfos?.data[0]?.approvedAmount ||
        number?.info[0]?.applicant?.category?.SupportRatio ||
        0,
      amountPaid: 0
    }
  })
  const handleCheck = () => {
    checkMutation()
  }

  const [approvedAmounts, setApprovedAmounts] = useState<number>(0)
  const [totalAmounts, setTotalAmounts] = useState<number>(0)
  const [totalPrice, setTotalPrice] = useState<number>(0)

  ///

  React.useEffect(() => {
    if (number && number.info.length > 0) {
      const applicant = number.info[0].applicant
      if (applicant && applicant.category && applicant.category.SupportRatio !== undefined) {
        setApprovedAmounts(applicant.category.SupportRatio)
      } else {
        // Handle cases where applicant or SupportRatio is undefined
        setApprovedAmounts(0)
        toast({
          title: 'بيانات غير كاملة',
          description: 'لا توجد معلومات كافية حول الدعم لهذا الرقم.',
          variant: 'destructive'
        })
      }
    } else {
      // Handle cases where info array is empty or number is undefined
      setApprovedAmounts(0)
    }

    const supportRatio =
      DismissInfos?.data[0]?.approvedAmount ??
      number?.info[0]?.applicant?.category?.SupportRatio ??
      0

    // Update state (if needed)
    if (supportRatio !== approvedAmounts) {
      setApprovedAmounts(supportRatio)
    }

    // Calculate totalPrice
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

    // Update the form field "amountPaid" with the computed price
    form.setValue('amountPaid', computedPrice)
    form.setValue('totalAmount', totalAmounts)
    form.setValue('approvedAmount', DismissInfos?.data[0].approvedAmount || 0)
  }, [totalAmounts, DismissInfos?.data[0]?.approvedAmount, number])
  //

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [numberOfRfid])
  //

  const [pharmacy, setPharmacy] = useState<Pharmacy[]>([])
  const [_selectedPharmacy, _setSelectedPharmacy] = useState<Pharmacy | null>(null)
  const [showAlert, setShowAlert] = useState<boolean>(false)
  //
  // const handlePharmacySelection = (globalId: string) => {
  //   const selected = pharmacy.find((p) => p.globalId === globalId)
  //   if (selected) {
  //     const today = new Date()
  //     const currentDate = today.getDate()

  //     if (selected.startDispenseDate < currentDate && selected.endispenseDate > currentDate) {
  //       setShowAlert(false)
  //     } else {
  //       setShowAlert(true)
  //     }

  //     setSelectedPharmacy(selected)
  //   }
  // }
  //
  const authToken = useAuthHeader()

  const [delayedSubmitting, _setDelayedSubmitting] = useState(form.formState.isSubmitting)

  React.useEffect(() => {
    if (number && number.info.length > 0) {
      const applicant = number.info[0].applicant
      form.setValue('amountPaid', totalPrice)
      form.setValue('approvedAmount', applicant?.category?.SupportRatio || 0)
    } else {
      // Reset form values if number is undefined or info is empty
      form.reset()
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
        console.error('Error fetching pharmacy data:', error)
        toast({
          title: 'حدث خطأ',
          description: 'فشل في جلب بيانات الصيدليات. يرجى المحاولة لاحقاً.',
          variant: 'destructive'
        })
      }
    }

    fetchPharmacyDirectorate()
  }, [number, totalPrice])

  const { mutate } = useMutation({
    // mutationKey: ['AccreditedInfo'],
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
      const successMessage = data?.data?.message || 'تمت الاضافة بنجاح'

      toast({
        title: 'تمت العملية',
        description: successMessage,
        variant: 'success'
      })
      if (successMessage === 'لايمكن صرف عليك مراجعة الادارة') {
        toast({
          title: 'تمت العملية',
          description: successMessage,
          variant: 'destructive'
        })
      }
      if (successMessage === 'تم الصرف مسبقا') {
        toast({
          title: 'تمت العملية',
          description: successMessage,
          variant: 'destructive'
        })
      }
      if (successMessage === 'ليس وقت الصرف في هذي الصيدلية') {
        toast({
          title: 'تمت العملية',
          description: successMessage,
          variant: 'destructive'
        })
      }
      queryClient.invalidateQueries({ queryKey: ['dismissal'] })
      queryClient.invalidateQueries({ queryKey: ['accredited'] })
      queryClient.invalidateQueries({ queryKey: ['ApplicantByDirectorateViewModel'] })
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
  const isPDF = attachedUrlPrec?.toLowerCase().endsWith('.pdf')
  //
  const attachedUrlAttachment = number?.info?.[0]?.attachment?.[0]?.attachmentFile ?? 'لايوجد'

  const openPtModal = () => {
    if (number?.info?.[0]?.attachment[0]?.attachmentFile) {
      setModalPtOpen(true)
    }
  }

  const closePtModal = () => {
    setModalPtOpen(false)
  }
  const handleClose = () => {
    setCheckNum('')
    setNumberOfRfid('')
  }
  const onSubmit = async (data: AccreditedFormValue) => {
    mutate(data)
  }
  if (isPending) {
    return (
      <div className="flex justify-center items-center w-full ">
        <LoaderIcon className="mt-12 flex animate-spin items-center justify-end duration-1000" />
      </div>
    )
  }
  return (
    <>
      <div className="flex flex-col gap-6 ">
        <div className="">
          <h1 className="text-2xl font-bold"> بيانات الصرف</h1>
        </div>
        <div className="flex justify-between">
          <div>
            <Button
              variant={'outline'}
              className="w-[120px]"
              onClick={() => navigate('/dismissal')}
            >
              رجوع
            </Button>
          </div>
          <div className="flex gap-2"></div>
        </div>

        <div className="flex  flex-col justify-center px-6 gap-16 bg-white rounded-[8px] pb-20">
          <div className="border-[#DADADA80]/50 border-b-2 ">
            <div className="w-fit border-[#196CB0] border-b-2 pb-4 pt-2">
              <h1 className="text-xl font-bold  text-[#196CB0]   "> بيانات الصرف</h1>
            </div>
          </div>

          {showAlert && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>الصرف في هذه الصيدلية غير متاح حالياً.</AlertDescription>
            </Alert>
          )}
          {checkNum && (
            <div className="fixed  inset-0 bg-transparent z-50 flex items-center justify-center p-4">
              <Alert className="max-w-md relative top-20 z-50  w-full  shadow-lg p-4 flex flex-col sm:flex-row sm:items-start">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-10 w-10 rounded-full p-2 bg-[#FEF0C7] text-orange-500" />
                </div>
                <div className="sm:ml-4 mt-2 sm:mt-0 flex-1">
                  <AlertTitle className="text-lg font-semibold text-gray-900">تنبية</AlertTitle>
                  <AlertDescription className="mt-2 text-sm text-gray-600">
                    {checkNum}
                  </AlertDescription>
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      className="text-sm w-full sm:w-32"
                      onClick={handleClose}
                    >
                      إغلاق
                    </Button>
                  </div>
                </div>
              </Alert>
            </div>
          )}

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
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1 flex gap-2">
                      <div className="grid grid-cols-5 gap-2">
                        <div className="col-span-3">
                          <label htmlFor="" className="text-[#A2A1A8]">
                            البطاقة
                          </label>
                          <input
                            ref={inputRef}
                            type="text"
                            value={AccreditedByID?.data[0]?.numberOfRfid || ''}
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
                            disabled={true}
                          >
                            مسح البطاقة
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <label htmlFor="" className="text-[#A2A1A8]">
                        الصيدلية
                      </label>
                      <Select disabled>
                        <SelectTrigger className="">
                          <SelectValue placeholder="اختر الصيدلية" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>الصيدلية</SelectLabel>
                            {pharmacy.map((pharmacy) => (
                              <SelectItem key={pharmacy.globalId} value={pharmacy.globalId}>
                                {pharmacy.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1">
                      <label htmlFor="" className="text-[#A2A1A8]">
                        الاجمالي
                      </label>
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
                      <label htmlFor="" className="text-[#A2A1A8]">
                        المبلغ المطلوب
                      </label>
                      <FormField
                        control={form.control}
                        name="amountPaid"
                        render={() => (
                          <FormItem>
                            <FormControl>
                              <FormInput
                                type="text"
                                value={totalPrice.toLocaleString()} // Format for readability (e.g., 1,000 instead of 1000)
                                disabled={true}
                                className="text-right bg-primary/5"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1">
                      <label htmlFor="" className="text-[#A2A1A8]">
                        نسبة الدعم
                      </label>
                      <FormField
                        control={form.control}
                        name="approvedAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FormInput
                                label="ادخل نسبة الدعم"
                                type="number"
                                disabled={true}
                                value={
                                  DismissInfos?.data[0]?.approvedAmount ?? approvedAmounts ?? ''
                                }
                                onChange={(e) => {
                                  const inputValue = e.target.value
                                  const parsedValue = Number(inputValue)
                                  const newAmount = !isNaN(parsedValue) ? parsedValue : 0
                                  setApprovedAmounts(newAmount)
                                  field.onChange(newAmount)
                                }}
                                className="text-right bg-primary/5"
                                placeholder={
                                  DismissInfos?.data[0]?.approvedAmount === undefined &&
                                  approvedAmounts === null
                                    ? 'Loading...'
                                    : 'Enter support ratio'
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1">
                      <label htmlFor="" className="text-[#A2A1A8]">
                        المعتمد
                      </label>
                      <FormInput
                        label="ادخل المعتمد"
                        className="h-10 p-0 rounded-xl text-sm"
                        placeholder="المعنمد"
                        value={number?.info[0].applicant?.name || ''}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <label htmlFor="" className="text-[#A2A1A8]">
                        رقم هاتف المعتمد
                      </label>
                      <FormInput
                        label="ادخل رقم هاتف المعتمد"
                        className="h-10 p-0 rounded-xl text-sm"
                        placeholder="المعنمد"
                        value={number?.info[0].applicant?.phoneNumber || ''}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                {/*  */}
                <div className="flex justify-start gap-4  h-40 ">
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
                          // If it's a PDF, render an iframe
                          <>
                            <iframe
                              src={attachedUrlPrec!}
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
                          // If it's an image, render an img
                          <>
                            <img
                              src={attachedUrlPrec!}
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

                  <h1 className="mb-5 text-[#8B8D97]">عرض البيانات الشخصية</h1>

                  <a onClick={openPtModal} className="cursor-pointer">
                    <Pdf />
                  </a>
                  {modalPtOpen && (
                    <div
                      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
                      onClick={closePtModal}
                    >
                      <div
                        className="relative w-[100%] h-[100%] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {isPDF ? (
                          // If it's a PDF, render an iframe
                          <>
                            <iframe
                              src={attachedUrlAttachment!}
                              className="w-full h-full"
                              frameBorder="0"
                            ></iframe>
                            <button
                              onClick={closePtModal}
                              className="absolute top-4 right-4 p-2 rounded-full bg-white text-black hover:bg-gray-200"
                            >
                              &times;
                            </button>
                          </>
                        ) : (
                          // If it's an image, render an img
                          <>
                            <img
                              src={attachedUrlAttachment!}
                              className="w-[80%] h-[80%] mx-auto object-fill"
                              alt=""
                            />
                            <button
                              onClick={closePtModal}
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

                <div className="flex justify-end gap-4 ">
                  <Button type="submit" className="w-[120px] bg-[#196CB0] hover:bg-[#2b4d68]">
                    صرف
                  </Button>
                  <Button
                    variant="outline"
                    className="w-[120px]"
                    onClick={() => navigate('/dismissal')}
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
