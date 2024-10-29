import React from 'react'
import logo from '../../../../assets/images/newlogo.svg'
import { ApplicantByDirectorateViewModelInfo } from '@renderer/types'
import { cn } from '@renderer/lib'

type Props = {
  data: ApplicantByDirectorateViewModelInfo[]
}

const ComponentToPrint = React.forwardRef<HTMLDivElement, Props>(function ComponentToPrint(
  { data },
  ref
) {
  const totalAmountSum = data?.reduce((acc, current) => acc + (current.totalAmount || 0), 0)
  const totalApprovedAmount = data?.reduce((acc, current) => acc + (current.approvedAmount || 0), 0)
  const date = new Date().toISOString().split('T')[0]

  return (
    <div ref={ref} className="w-[95%] mx-auto h-full">
      <div className="w-full h-[150px] mb-7 flex items-end">
        <p className="basis-[40%] font-extrabold">{String(date)}</p>
        <div className="basis-[40%]">
          <img src={logo} className="w-[40%] h-[40%] object-cover" />
        </div>
        <p className="basis-[20%] font-extrabold">عنوان التقرير : تقرير المخصصات العلاجية</p>
      </div>
      <table dir="rtl" className="w-full h-full rounded-t-lg">
        <thead>
          <tr className="h-10 text-black border-2 border-gray-300 py-5 bg-[#E5F0FF]">
            <th>رقم</th>
            <th>الأسم</th>
            <th>الجنس</th>
            <th>تصنيف المرض</th>
            <th>المنطقة</th>
            <th>الجوال</th>
            <th>الحاله</th>
            <th>تكليف العلاج</th>
            <th>نسبة الخصم</th>
            <th>مساهمة المريض</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.phoneNumber} className="h-10 text-black border-2 border-gray-300 py-5">
              <td className="px-2">{index + 1}</td>
              <td className="px-2">{item.name}</td>
              <td className="px-2">{item.gender === 'M' ? 'ذكر' : 'انثى'}</td>
              <td className="px-2">{item.disease}</td>
              <td className="px-2">{item.directorate}</td>
              <td className="px-2">{item.phoneNumber}</td>
              <td
                className={cn(
                  item.state === 'موقف'
                    ? 'inline-block bg-[#FFDAA0]/[.35] rounded-3xl px-2 py-1 text-sm font-semibold text-[#CEA461] mt-2'
                    : item.state === 'مستمر'
                      ? 'inline-block bg-[#C5FFBC]/[.35] rounded-3xl px-2 py-1 text-sm font-semibold text-[#69DB57] mt-2'
                      : item.state === 'منتهي'
                        ? 'inline-block bg-[#ffe0e0] rounded-3xl px-2 py-1 text-sm font-semibold text-[#ff0000] mt-2'
                        : ''
                )}
              >
                {item.state}
              </td>
              <td className="px-2">{item.totalAmount}</td>
              <td className="px-2">{item.supportRatio}</td>
              <td className="px-2">{item.approvedAmount}</td>
            </tr>
          ))}
          {/* Spacer row to add visual separation */}
          <tr>
            <td colSpan={9} className="h-4"></td>
          </tr>
        </tbody>
        <tfoot>
          <tr className="bg-[#E5F0FF] text-gray-500 h-16">
            <td colSpan={9} className="p-4 text-right">
              <div className="flex justify-between w-full">
                <div>
                  <h1 className="text-xl font-medium">الاجمالي</h1>
                </div>
                <div className="flex gap-10">
                  <div>
                    <p>اجمالي تكلفة العلاج</p>
                    <p>{totalAmountSum} ريال</p>
                  </div>
                  <div>
                    <p>مساهمة المريض</p>
                    <p>{totalApprovedAmount} ريال</p>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
})

export default ComponentToPrint
