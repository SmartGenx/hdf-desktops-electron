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
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert'
import { useToast } from '../../ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { cn } from '../../../lib/utils'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance, getApi, postApi } from '../../../lib/http'
import { useAuthHeader } from 'react-auth-kit'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Accredited, Pharmacy, Square } from '@renderer/types'
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
  const { toast } = useToast()
  const { setValue } = useForm()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const form = useForm<AccreditedFormValue>({
    resolver: zodResolver(formSchema)
  })
  const [approvedAmounts, setApprovedAmounts] = useState<number>(0)
  const [totalAmounts, setTotalAmounts] = useState<number>(0)
  const [totalPrice, setTotalPrice] = useState<number>(0)

  React.useEffect(() => {
    let computedPrice = 0

    if (totalAmounts > 50000) {
      const excessAmount = totalAmounts - 50000
      const approvedPercentage = (50000 * approvedAmounts) / 100
      const reducedAmount = 50000 - approvedPercentage
      computedPrice = reducedAmount + excessAmount
    } else {
      computedPrice = totalAmounts - (totalAmounts * approvedAmounts) / 100
    }

    setTotalPrice(computedPrice)
  }, [totalAmounts, approvedAmounts])

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

  const { data: applicant } = useQuery({
    queryKey: ['applicant'],
    queryFn: () =>
      getApi<Square[]>('/applicant', {
        headers: {
          Authorization: authToken()
        }
      })
  })

  const [delayedSubmitting, _setDelayedSubmitting] = useState(form.formState.isSubmitting)

  const [numberOfRfid, setNumberOfRfid] = useState('')
  const [number, setNumber] = useState<Accredited>()

  const generateRfid = async () => {
    try {
      const response = await axiosInstance.get(
        `/accredited?page=1&pageSize=4&include[prescription]=true&numberOfRfid=${numberOfRfid}`,
        {
          headers: {
            Authorization: `${authToken()}`
          }
        }
      )

      // Handle the response as necessary
      console.log('Data fetched:', response.data)
      setNumber(response.data)
    } catch (error) {
      console.error('Error fetching RFID data:', error)
    }
  }
  const name =
    applicant?.data?.[0]?.globalId === number?.info?.[0]?.applicantGlobalId
      ? applicant?.data?.[0]?.name
      : null

  console.log('name', name)
  React.useEffect(() => {
    form.setValue('amountPaid', String(totalPrice))
    form.setValue('accreditedGlobalId', number?.info?.[0]?.globalId ?? 'No URL available')
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

    fetchPharmacyDirectorate()
  }, [number?.info?.[0]?.globalId, totalPrice, setValue])

  console.log('sdasdasd', number?.info?.[0]?.pharmacyGlobalId ?? 'No URL available')
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
    onSuccess: () => {
      toast({
        title: 'تمت العملية',
        description: 'تمت الاضافة بنجاح',
        variant: 'success'
      })
      queryClient.invalidateQueries({ queryKey: ['dismissal'] })
      navigate('/dismissal')
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
              <AlertDescription>
                الصيدلية لا تستغني حاليًا. يرجى اختيار صيدلية مختلفة.
              </AlertDescription>
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
                    <div className="col-span-1 flex gap-2">
                      <div className="grid grid-cols-5 gap-2">
                        <div className="col-span-3">
                          <label htmlFor="" className="text-[#A2A1A8]">
                            البطاقة
                          </label>
                          <input
                            type="text"
                            value={numberOfRfid}
                            onChange={(e) => setNumberOfRfid(e.target.value)}
                            placeholder="Enter RFID number"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div className="col-span-1 translate-y-6">
                          <Button
                            className="w-[104px] h-[42px] bg-[#196CB0]"
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
                                type="text"
                                onChange={(e) => {
                                  const value = Number(e.target.value)
                                  setApprovedAmounts(value)
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
                    <div className="col-span-1">
                      <label htmlFor="" className="text-[#A2A1A8]">
                        المعتمد
                      </label>
                      <FormInput
                        label="ادخل المعتمد"
                        className="h-10 p-0 rounded-xl text-sm"
                        placeholder="المعنمد"
                        value={name || ''}
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
                              <FormInput
                                label="ادخل الحاله"
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
                </div>
                {/*  */}
                <div className="flex justify-start gap-4  h-40 ">
                  <a
                    href={number?.info?.[0]?.prescription?.[0]?.attachedUrl ?? 'No URL available'}
                    target="_blank"
                    className="ml-14"
                    rel="noopener noreferrer"
                  >
                    <h1 className="mb-5 text-[#8B8D97]">عرض البيانات الشخصية</h1>
                    <Pdf />
                  </a>
                  <a
                    href={number?.info?.[0]?.prescription?.[0]?.attachedUrl ?? 'No URL available'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h1 className="mb-5 text-[#8B8D97]">عرض ملف الوصفة الطبية</h1>
                    <Pdf />
                  </a>
                </div>
                {/*  */}
                <div className="flex justify-end gap-4 ">
                  <Button type="submit" className="w-[120px]">
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
