import { Link, useParams } from 'react-router-dom'
import { LoaderIcon, Printer } from 'lucide-react'
import { Checkbox } from '../../ui/checkbox'
import logo from '../../../assets/images/newlogo.svg'
import titleLog from '../../../assets/images/titleLog.svg'
import { Button } from '@renderer/components/ui/button'
import ReactToPrint from 'react-to-print'
import { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getApi } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'
type DiseaseApplicant = {
  globalId: string
  name: string
  cheacked: boolean
}

type Governorate = {
  id: number
  globalId: string
  name: string
  deleted: boolean
  version: number
  lastModified: string
  createdAt: string
}

type Directorate = {
  id: number
  globalId: string
  governorateGlobalId: string
  name: string
  deleted: boolean
  version: number
  lastModified: string
  createdAt: string
  Governorate: Governorate
}

type Category = {
  id: number
  globalId: string
  name: string
  SupportRatio: number
  deleted: boolean
  description: string
  version: number
  lastModified: string
  createdAt: string
}

type Applicant = {
  id: number
  globalId: string
  name: string
  age: number
  dateOfBirth: string
  placeOfBirth: string
  currentResidence: string
  gender: string
  directorateGlobalId: string
  phoneNumber: string
  submissionDate: string
  deleted: boolean
  accredited: boolean
  categoryGlobalId: string
  state: string
  version: number
  lastModified: string
  createdAt: string
  directorate: Directorate
  category: Category
  diseasesApplicants: DiseaseApplicant[]
  directorateName: string
  governorateName: string
  categoryName: string
}

type SquareItem = {
  globalId: string
  name: string
  cheacked?: boolean // You had "cheacked":... but it was incomplete
}
type Pharmacy = {
  id: number
  globalId: string
  name: string
  location: string
  startDispenseDate: number
  endispenseDate: number
  deleted: boolean
  governorateGlobalId: string
  version: number
  lastModified: string
  createdAt: string
  Governorate: Governorate
}
type PrescriptionAttachment = {
  id: number
  globalId: string
  prescriptionDate: string
  renewalDate: string
  attachedUrl: string
  deleted: boolean
  accreditedGlobalId: string
  version: number
  lastModified: string
  createdAt: string
}

type Prescription = {
  id: number
  globalId: string
  squareGlobalId: string
  treatmentSite: string
  doctor: string
  state: string
  numberOfRfid: number
  formNumber: string
  deleted: boolean
  applicantGlobalId: string
  pharmacyGlobalId: string
  version: number
  createdAt: string
  lastModified: string
  applicant: Applicant
  pharmacy: Pharmacy
  square: SquareItem[]
  prescription: PrescriptionAttachment[]
}
const ContinuingTreatmentRequestFormPreview = () => {
  const { id } = useParams()
  const authToken = useAuthHeader()
  console.dir(id)

  const componentRef = useRef<HTMLDivElement>(null)
  const {
    isPending,
    error,
    isError,
    data: prescription
  } = useQuery({
    queryKey: ['accredited', id],
    queryFn: () =>
      getApi<Prescription>(`/accredited/print/${id}`, {
        headers: {
          Authorization: authToken()
        }
      })
  })
  if (isPending) {
    return (
      <div className="flex justify-center items-center w-full ">
        <LoaderIcon className="mt-12 flex animate-spin items-center justify-end duration-1000" />
      </div>
    )
  }
  if (isError) return 'An error has occurred: ' + error.message

  return (
    <div>
      <div className="flex gap-2">
        <Link to={'/accredited'}>
          <Button
            className="text-black bg-white text-lg font-bold hover:bg-gray-200 border"
            size={'lg'}
          >
            رجوع
          </Button>
        </Link>
        <ReactToPrint
          trigger={() => (
            <Button
              className="text-white bg-[#196CB0] text-lg font-bold hover:bg-[#346186] border"
              size={'lg'}
            >
              طباعة
              <Printer />
            </Button>
          )}
          content={() => componentRef.current}
        />
      </div>

      <div className="min-h-screen p-4 md:p-8">
        <div ref={componentRef} className="mx-auto max-w-4xl bg-white !text-sm" dir="rtl">
          {/* Header with logo and title */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <img
                src={logo}
                alt="Health Development Foundation Logo"
                width={64}
                height={64}
                className="h-full w-full object-contain"
              />
              <img
                src={titleLog}
                alt="Health Development Foundation Logo"
                width={64}
                height={64}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col items-end">
              <div className="text-right text-sm text-gray-500 rtl">
                <p>
                  الرقم:
                  &#x200F;(&#x200F;&#x200F;&#x200F;&#x200F;&#x200F;&#x200F;&#x200F;&#x200F;&#x200F;&#x200F;)
                </p>
                <p>التاريخ: &#x200F;&#x200F;/&#x200F;&#x200F;/&#x200F;&#x200F;</p>
                <p>المرافق: &#x200F;&#x200F;/&#x200F;&#x200F;/&#x200F;&#x200F;</p>
              </div>
            </div>
          </div>

          {/* Form Title */}
          <div className="border-b pb-2 text-center">
            <h2 className="text-xl font-bold underline">استمارة تقديم طلب علاج مستمر</h2>
          </div>

          {/* Personal Information Section */}
          <div className="border-b p-4">
            <h3 className="mb-4 text-right font-bold">البيانات الشخصية:</h3>
            <div className="grid grid-cols-3 gap-1">
              <div className="flex items-center col-span-2">
                <span className="text-right ">الاسم:</span>
                <div className="mr-2 min-w-80 border-b border-dashed border-gray-400">
                  {prescription.data.applicant.name}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-right">العمر:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400">
                  {prescription.data.applicant.age}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-right">الجنس:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400">
                  {prescription.data.applicant.gender == 'M' ? 'ذكر' : 'انثى'}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-right">محل وتاريخ الميلاد:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400">
                  {new Date(prescription.data.applicant.dateOfBirth).toLocaleDateString('en-GB')}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-right"> مكان الميلاد:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400">
                  {prescription.data.applicant.placeOfBirth}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-right">الحالة الاجتماعية:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400">
                  {/* {prescription.data.applicant.} */}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-right">المهنة:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400"></div>
              </div>
              <div className="flex items-center">
                <span className="text-right">السكن الحالي:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400">
                  {prescription.data.applicant.currentResidence}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-right">المديرية:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400">
                  {prescription.data.applicant.directorate.name}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-right">المحافظة:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400">
                  {prescription.data.applicant.directorate.Governorate.name}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-right">الجوال:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400">
                  {prescription.data.applicant.phoneNumber}
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="text-right">اسم الزوج أو الزوجة أو الأم:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400"></div>
                <span className="mr-2">الفئة ({prescription.data.applicant.categoryName})</span>
              </div>
            </div>
          </div>

          {/* Medical Information Section */}
          <div className="border-b p-4">
            <h3 className="mb-4 text-right font-bold">البيانات التفصيلية للمرض:</h3>
            <div className="grid grid-cols-5 gap-1">
              {prescription.data.applicant.diseasesApplicants.map((disease, index) => (
                <div key={index} className="flex items-center">
                  <Checkbox
                    checked={disease.cheacked}
                    aria-readonly
                    id={disease.name}
                    className="h-5 w-5 rounded-sm"
                  />
                  <span className="mr-2 text-right">{disease.name}</span>
                </div>
              ))}
              {/* <div className="flex items-center ">
                <Checkbox id="pressure" className="h-5 w-5 rounded-sm" />
                <span className="mr-2 text-right">الضغط</span>
              </div> */}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-1">
              <div className="flex items-center">
                <span className="text-right">نوع المرض:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400">مزمن</div>
              </div>
              <div className="flex items-center">
                <span className="text-right">موقع العلاج:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400">
                  {prescription.data.treatmentSite}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-right">الطبيب المعالج:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400">
                  {prescription.data.doctor}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-right">تاريخ الوصفة الطبية:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400">
                  <span className="mr-2">
                    {prescription.data.prescription[0].prescriptionDate
                      ? new Date(
                          prescription.data.prescription[0].prescriptionDate
                        ).toLocaleDateString('en-GB')
                      : ''}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-right">تاريخ التجديد:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400">
                  <span className="mr-2">
                    {prescription.data.prescription[0].renewalDate
                      ? new Date(prescription.data.prescription[0].renewalDate).toLocaleDateString(
                          'en-GB'
                        )
                      : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Companion Information */}
          <div className="border-b p-4">
            <h3 className="mb-4 text-right font-bold">معلومات المرافق:</h3>
            <div className="grid grid-cols-3 gap-1">
              <div className="flex items-center">
                <span className="text-right">اسم المرافق:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400"></div>
              </div>
              <div className="flex items-center">
                <span className="text-right">صلة القرابة:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400"></div>
              </div>
              <div className="flex items-center">
                <span className="text-right">رقم التلفون:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400"></div>
              </div>
              <div className="col-span-1 flex items-center md:col-span-3">
                <span className="text-right">رقم الواتس:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400"></div>
              </div>
            </div>
          </div>

          {/* Required Attachments */}
          <div className="border-b p-4">
            <h3 className="mb-4 text-right font-bold">المرفقات المطلوبة:</h3>
            <div className="grid grid-cols-2 gap-1">
              <div className="flex items-center">
                <Checkbox aria-readonly id="prescription" className="h-5 w-5 rounded-sm" />
                <span className="mr-2 text-right">روشتة العلاج</span>
              </div>
              <div className="flex items-center">
                <Checkbox aria-readonly id="id" className="h-5 w-5 rounded-sm" />
                <span className="mr-2 text-right">
                  اثبات الشخصية للمريض (بطاقة / جواز / شهادة الميلاد)
                </span>
              </div>
            </div>
          </div>

          {/* Commitment Section */}
          <div className="border-b p-4">
            <div className="text-right">
              <p className="mb-4">التزم انا المريض / المفوض:</p>
              <div className="mb-4 w-full border-b border-dashed border-gray-400">
                {prescription.data.applicant.name}
              </div>
              <p className="mb-2">
                باستلام العلاج في الوقت المحدد وهو (1-10) من كل شهر ميلادي من صيدلية{' '}
                <span className="font-bold px-1">{prescription.data.pharmacy.name}</span>
                وتجديدالروشتة بعد كل تفصيل مراجعة دورية <br /> في مدة أقصاها سنة من تاريخ تقديم
                الطلب.
              </p>
              <div className="flex justify-start">
                <p>التوقيع:</p>
                <div className="ml-4 w-32 border-b border-dashed border-gray-400"></div>
              </div>
            </div>
          </div>

          {/* Administrative Section */}
          <div className="p-4">
            <div className="mb-4 border border-dashed border-gray-400 p-2">
              <h3 className="mb-4 text-right font-bold">خاص بالإدارة:</h3>
              <div className="grid grid-cols-5 gap-1">
                {prescription.data.square.map((item) => (
                  <div className="flex items-center" key={item.globalId}>
                    <Checkbox
                      id={item.globalId}
                      checked={item.cheacked}
                      className="h-5 w-5 rounded-sm"
                    />
                    <span className="mr-2 text-right">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <p className="mb-2 text-center">منسق مشروع مساعدة المرضى</p>
                <div className="w-full border-b border-dashed border-gray-400"></div>
              </div>
              <div className="flex flex-col items-center">
                <p className="mb-2 text-center">مدير البرامج والمشاريع</p>
                <div className="w-full border-b border-dashed border-gray-400"></div>
              </div>
              <div className="flex flex-col items-center">
                <p className="mb-2 text-center">المدير التنفيذي</p>
                <div className="w-full border-b border-dashed border-gray-400"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContinuingTreatmentRequestFormPreview
