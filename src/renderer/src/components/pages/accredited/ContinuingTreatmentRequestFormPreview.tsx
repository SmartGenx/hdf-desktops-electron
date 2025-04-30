import { Link } from 'react-router-dom'
import { Printer } from 'lucide-react'
import { Checkbox } from '../../ui/checkbox'
import logo from '../../../assets/images/newlogo.svg'
import titleLog from '../../../assets/images/titleLog.svg'
import { Button } from '@renderer/components/ui/button'
import ReactToPrint from 'react-to-print'
import { useRef } from 'react'

const ContinuingTreatmentRequestFormPreview = () => {
    const componentRef = useRef<HTMLDivElement>(null)
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
              <div className="flex items-center">
                <span className="text-right">الاسم:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400"></div>
              </div>
              <div className="flex items-center">
                <span className="text-right">العمر:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400"></div>
              </div>
              <div className="flex items-center">
                <span className="text-right">الجنس:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400"></div>
              </div>
              <div className="flex items-center">
                <span className="text-right">محل وتاريخ الميلاد:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400"></div>
              </div>
              <div className="flex items-center">
                <span className="text-right">الحالة الاجتماعية:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400"></div>
              </div>
              <div className="flex items-center">
                <span className="text-right">المهنة:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400"></div>
              </div>
              <div className="flex items-center">
                <span className="text-right">السكن الحالي:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400"></div>
              </div>
              <div className="flex items-center">
                <span className="text-right">المديرية:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400"></div>
              </div>
              <div className="flex items-center">
                <span className="text-right">المحافظة:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400"></div>
              </div>
              <div className="flex items-center">
                <span className="text-right">الجوال:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400"></div>
              </div>
              <div className="col-span-1 flex items-center md:col-span-2">
                <span className="text-right">اسم الزوج أو الزوجة أو الأم:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400"></div>
                <span className="mr-2">الفئة ( )</span>
              </div>
            </div>
          </div>

          {/* Medical Information Section */}
          <div className="border-b p-4">
            <h3 className="mb-4 text-right font-bold">البيانات التفصيلية للمرض:</h3>
            <div className="grid grid-cols-5 gap-1">
              <div className="flex items-center ">
                <Checkbox id="pressure" className="h-5 w-5 rounded-sm" />
                <span className="mr-2 text-right">الضغط</span>
              </div>
              <div className="flex items-center ">
                <Checkbox id="diabetes" className="h-5 w-5 rounded-sm" />
                <span className="mr-2 text-right">السكري</span>
              </div>
              <div className="flex items-center ">
                <Checkbox id="heart" className="h-5 w-5 rounded-sm" />
                <span className="mr-2 text-right">القلب والشرايين</span>
              </div>
              <div className="flex items-center">
                <Checkbox id="mental" className="h-5 w-5 rounded-sm" />
                <span className="mr-2 text-right">الأمراض النفسية</span>
              </div>
              <div className="flex items-center ">
                <Checkbox id="digestive" className="h-5 w-5 rounded-sm" />
                <span className="mr-2 text-right">أمراض الجهاز الهضمي</span>
              </div>
              <div className="flex items-center ">
                <Checkbox id="kidney" className="h-5 w-5 rounded-sm" />
                <span className="mr-2 text-right">أمراض الكلى والمسالك والكبد</span>
              </div>
              <div className="flex items-center">
                <Checkbox id="neuro" className="h-5 w-5 rounded-sm" />
                <span className="mr-2 text-right">أمراض المخ والأعصاب والعظام</span>
              </div>
              <div className="flex items-center">
                <Checkbox id="hormones" className="h-5 w-5 rounded-sm" />
                <span className="mr-2 text-right">أمراض الغدد والهرمونات (الذكورة والأنوثة)</span>
              </div>
              <div className="flex items-center">
                <Checkbox id="cancer" className="h-5 w-5 rounded-sm" />
                <span className="mr-2 text-right">السرطان</span>
              </div>
              <div className="flex items-center">
                <Checkbox id="eyes" className="h-5 w-5 rounded-sm" />
                <span className="mr-2 text-right">العيون</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-1">
              <div className="flex items-center">
                <span className="text-right">نوع المرض:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400"></div>
              </div>
              <div className="flex items-center">
                <span className="text-right">موقع العلاج:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400"></div>
              </div>
              <div className="flex items-center">
                <span className="text-right">الطبيب المعالج:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400"></div>
              </div>
              <div className="flex items-center">
                <span className="text-right">تاريخ الوصفة الطبية:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400">
                  <span className="mr-2">20 / / </span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-right">تاريخ التجديد:</span>
                <div className="mr-2 w-32 border-b border-dashed border-gray-400">
                  <span className="mr-2">20 / / </span>
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
                <Checkbox id="prescription" className="h-5 w-5 rounded-sm" />
                <span className="mr-2 text-right">روشتة العلاج</span>
              </div>
              <div className="flex items-center">
                <Checkbox id="id" className="h-5 w-5 rounded-sm" />
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
              <div className="mb-4 w-full border-b border-dashed border-gray-400">يسيسي</div>
              <p className="mb-2">
                باستلام العلاج في الوقت المحدد وهو (1-10) من كل شهر ميلادي من صيدلية <span className='font-bold'>TEST</span>
                وتجديدالروشتة بعد كل تفصيل مراجعة دورية  <br/> في مدة أقصاها سنة من تاريخ تقديم الطلب.
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
                <div className="flex items-center">
                  <Checkbox id="box1" className="h-5 w-5 rounded-sm" />
                  <span className="mr-2 text-right">مربع فوضية</span>
                </div>
                <div className="flex items-center">
                  <Checkbox id="box2" className="h-5 w-5 rounded-sm" />
                  <span className="mr-2 text-right">مربع فتح</span>
                </div>
                <div className="flex items-center">
                  <Checkbox id="box3" className="h-5 w-5 rounded-sm" />
                  <span className="mr-2 text-right">مربع الخدمة</span>
                </div>
                <div className="flex items-center">
                  <Checkbox id="box4" className="h-5 w-5 rounded-sm" />
                  <span className="mr-2 text-right">مربع هائل</span>
                </div>
                <div className="flex items-centerd">
                  <Checkbox id="box5" className="h-5 w-5 rounded-sm" />
                  <span className="mr-2 text-right">مربع الشكلا وعدن</span>
                </div>
                <div className="flex items-center">
                  <Checkbox id="box6" className="h-5 w-5 rounded-sm" />
                  <span className="mr-2 text-right">مربع الخدود</span>
                </div>
                <div className="flex items-center">
                  <Checkbox id="box7" className="h-5 w-5 rounded-sm" />
                  <span className="mr-2 text-right">مربع ميلوت</span>
                </div>
                <div className="flex items-center">
                  <Checkbox id="box8" className="h-5 w-5 rounded-sm" />
                  <span className="mr-2 text-right">مربع عصيص</span>
                </div>
                <div className="flex items-center">
                  <Checkbox id="box9" className="h-5 w-5 rounded-sm" />
                  <span className="mr-2 text-right">مربع العين</span>
                </div>
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
