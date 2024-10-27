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

import { Alert, AlertDescription, AlertTitle } from '../../ui/alert'
import { useToast } from '../../ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { cn } from '../../../lib/utils'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance, postApi } from '../../../lib/http'
import { useAuthHeader } from 'react-auth-kit'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AccreditedRes, Pharmacy } from '@renderer/types'
import Pdf from '@renderer/components/icons/pdf'
import { AlertCircle } from 'lucide-react'
import { FormInput } from '@renderer/components/ui/forms-input'

const formSchema = z.object({
  totalAmount: z.string(),
  amountPaid: z.string(),
  approvedAmount: z.string(),
  accreditedGlobalId: z.string(),
  pharmacyGlobalId: z.string(),
  state: z.string()
})

type AccreditedFormValue = z.infer<typeof formSchema>

export default function FormDismissal() {
  // const signIn = useSignIn()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalPtOpen, setModalPtOpen] = useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  // const { setValue } = useForm()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const form = useForm<AccreditedFormValue>({
    resolver: zodResolver(formSchema)
  })
  const [states, _setStates] = useState([
    { value: 'active', label: 'نشط' },
    { value: 'not active', label: 'غير نشط' }
  ])
  const [numberOfRfid, setNumberOfRfid] = useState('')
  const [number, setNumber] = useState<AccreditedRes>()

  const generateRfid = async () => {
    if (numberOfRfid === '') {
      toast({
        title: 'يرجى ادخل رقم البطاقة',
        variant: 'destructive'
      })
      return // Early return to prevent further execution
    }

    try {
      const response = await axiosInstance.get(
        `/accredited?page=1&pageSize=4&include[prescription]=true&numberOfRfid=${numberOfRfid}&include[applicant][include]=category&include[attachment]=true`,
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
  }

  const [approvedAmounts, setApprovedAmounts] = useState<number>(0)
  const [totalAmounts, setTotalAmounts] = useState<number>(0)
  const [totalPrice, setTotalPrice] = useState<number>(0)

  console.log('totalPrice', totalPrice)
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

    let computedPrice = 0

    if (totalAmounts > 50000) {
      const excessAmount = totalAmounts - 50000
      const approvedPercentage = (50000 * approvedAmounts) / 100
      const reducedAmount = 50000 - approvedPercentage
      computedPrice = reducedAmount + excessAmount
      console.log('totalAmounts', totalAmounts)
      console.log('approvedAmounts', approvedAmounts)
    } else {
      computedPrice = totalAmounts - (totalAmounts * approvedAmounts) / 100
    }
    console.log('computedPrice', computedPrice)
    setTotalPrice(computedPrice)
  }, [totalAmounts, approvedAmounts, number])

  //

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])
  //
  const [pharmacy, setPharmacy] = useState<Pharmacy[]>([])
  const [_selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null)
  const [showAlert, setShowAlert] = useState<boolean>(false)
  //
  const handlePharmacySelection = (globalId: string) => {
    const selected = pharmacy.find((p) => p.globalId === globalId)
    if (selected) {
      const today = new Date()
      const currentDate = today.getDate()

      if (selected.startDispenseDate < currentDate && selected.endispenseDate > currentDate) {
        setShowAlert(false)
      } else {
        setShowAlert(true)
      }

      setSelectedPharmacy(selected)
    }
  }
  //
  const authToken = useAuthHeader()

  // const { data: applicant } = useQuery({
  //   queryKey: ['applicant'],
  //   queryFn: () =>
  //     getApi<ApplicantsInfo[]>('/applicant', {
  //       headers: {
  //         Authorization: authToken()
  //       }
  //     })
  // })

  const [delayedSubmitting, _setDelayedSubmitting] = useState(form.formState.isSubmitting)

  console.log('numbernumbernumber', number?.info[0].applicant?.category.SupportRatio)
  // const name =
  //   applicant?.data?.find((applicant) => applicant?.globalId === number?.info[0]?.applicantGlobalId)
  //     ?.name || null

  React.useEffect(() => {
    if (number && number.info.length > 0) {
      const applicant = number.info[0].applicant
      form.setValue('amountPaid', String(totalPrice))
      form.setValue('accreditedGlobalId', number.info[0].globalId || 'No URL available')
      form.setValue('pharmacyGlobalId', number.info[0].pharmacyGlobalId || 'No URL available')
      form.setValue('approvedAmount', String(applicant?.category?.SupportRatio || 0))
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
  }, [number, totalPrice, form])

  // const imagePath = `${number?.info?.[0]?.prescription[0].attachedUrl}`
  // const encodedPath = encodeURI(imagePath)
  // const src = `file:///${encodedPath}`

  const { mutate } = useMutation({
    // mutationKey: ['AccreditedInfo'],
    mutationFn: (datas: AccreditedFormValue) =>
      postApi(
        '/dismissal',
        {
          totalAmount: +datas.totalAmount,
          approvedAmount: +datas.approvedAmount,
          amountPaid: +datas.amountPaid,
          accreditedGlobalId: datas.accreditedGlobalId,
          pharmacyGlobalId: datas.pharmacyGlobalId,
          state: datas.state
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
  const isPDFAtta = attachedUrlPrec?.toLowerCase().endsWith('.pdf')
  const openPtModal = () => {
    if (number?.info?.[0]?.attachment[0]?.attachmentFile) {
      setModalPtOpen(true)
    }
  }

  const closePtModal = () => {
    setModalPtOpen(false)
  }
  const onSubmit = async (data: AccreditedFormValue) => {
    mutate(data)
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

          {/* <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{showAlert ? 'Error' : 'Notice'}</AlertTitle>
            <AlertDescription>
              {showAlert
                ? 'The pharmacy is not currently dispensing. Please select a different pharmacy.'
                : 'The pharmacy is currently dispensing. You can proceed.'}
            </AlertDescription>
          </Alert> */}
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
                            value={numberOfRfid}
                            onChange={(e) => setNumberOfRfid(e.target.value)}
                            placeholder="Enter RFID number"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div className="col-span-1 translate-y-6">
                          <Button
                            className="w-[104px] h-[42px] bg-[#196CB0] hover:bg-[#2b4d68]"
                            onClick={generateRfid}
                            type="button"
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
                      <FormField
                        control={form.control}
                        name="pharmacyGlobalId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value)
                                  handlePharmacySelection(value) // Check the pharmacy dates
                                }}
                                value={
                                  field.value
                                    ? String(field.value)
                                    : String(number?.info?.[0]?.pharmacyGlobalId)
                                }
                                defaultValue={field.value}
                              >
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
                            </FormControl>
                          </FormItem>
                        )}
                      />
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
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FormInput
                                type="text"
                                {...field}
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
                                type="number" // Use 'number' for better handling
                                disabled={true}
                                value={approvedAmounts !== null ? approvedAmounts : ''}
                                onChange={(e) => {
                                  const inputValue = e.target.value
                                  const parsedValue = Number(inputValue)

                                  const newAmount =
                                    inputValue !== '' && !isNaN(parsedValue)
                                      ? parsedValue
                                      : (number?.info[0].applicant?.category.SupportRatio ?? 0)

                                  setApprovedAmounts(newAmount)
                                  field.onChange(newAmount) // Pass the numeric value
                                }}
                                className="text-right bg-primary/5"
                                placeholder={
                                  approvedAmounts === null ? 'Loading...' : 'Enter support ratio'
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
                        الحاله
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
                </div>
                {/*  */}
                <div className="flex justify-start gap-4  h-40 ">
                  <h1 className="mb-5 text-[#8B8D97]">عرض البيانات الشخصية</h1>
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

                  <h1 className="mb-5 text-[#8B8D97]">عرض ملف الوصفة الطبية</h1>

                  <a onClick={openPtModal} className="cursor-pointer">
                    <Pdf />
                  </a>
                  {modalPtOpen && (
                    <div
                      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
                      onClick={closePtModal}
                    >
                      <div
                        className="relative w-auto max-w-[90vw] max-h-[90vh] bg-white flex justify-center items-center p-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={closePtModal}
                          className="absolute top-4 right-4 p-2 rounded-full bg-white text-black hover:bg-gray-200"
                        >
                          &times;
                        </button>
                        {isPDFAtta ? (
                          // If it's a PDF, render an iframe
                          <iframe
                            src={attachedUrlAttachment!}
                            className="w-full h-full"
                            frameBorder="0"
                          ></iframe>
                        ) : (
                          // If it's an image, render an img
                          <img
                            src={attachedUrlAttachment!}
                            className="w-[80%] h-[80%] mx-auto object-fill"
                            alt=""
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4 ">
                  <Button type="submit" className="w-[120px] bg-[#196CB0] hover:bg-[#2b4d68]">
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
