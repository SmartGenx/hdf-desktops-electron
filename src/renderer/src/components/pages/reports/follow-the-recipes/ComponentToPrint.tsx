import React from 'react'
import logo from '../../../../assets/images/newlogo.svg'
import { AllAccreditedsForPdfInfo } from '@renderer/types'
type Props = {
  data: AllAccreditedsForPdfInfo[]
}
const ComponentToPrint = React.forwardRef<HTMLDivElement, Props>(function ComponentToPrint(
  { data },
  ref
) {
  const date = new Date().toISOString().split('T')[0]
  return (
    <div ref={ref} className="w-[95%] mx-auto h-full">
      <div className="w-full h-[150px]  mb-7 flex items-end">
        <p className="basis-[40%] font-extrabold">{String(date)}</p>
        <div className="basis-[40%]">
          <img src={logo} className=" w-[40%] h-[40%] object-cover " />
        </div>
        <p className="basis-[20%] font-extrabold">عنوان التقرير : تقرير متابعة الوصفات</p>
      </div>
      <table dir="rtl" className="w-full h-full rounded-t-lg">
        <tr className="  h-10 text-black border-2 border-gray-300 py-5 bg-[#E5F0FF]">
          <th>رقم</th>
          <th>الرقم الاستمارة</th>
          <th>الأسم</th>
          <th>تصنيف المرض</th>
          <th>المنطقة</th>
          <th>الجوال</th>
          <th>تاريخ التشخيص</th>
          <th>تاريخ التجديد</th>
          <th>الايام</th>
          <th>الاشهر</th>
          <th>الحاله</th>
        </tr>
        {data.map((item, index) => (
          // eslint-disable-next-line react/jsx-key
          <tr className=" -translate-x-3 h-10 text-black border-2 border-gray-300 py-5">
            <td className="px-2">{index + 1}</td>
            <td>{item.formNumber}</td>
            <td>{item.name}</td>
            <td>{item.disease}</td>
            <td>{item.directorate}</td>
            <td>{item.phoneNumber}</td>
            <td>
              {(() => {
                const d = new Date(item.orescriptionDate)
                return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0]
              })()}
            </td>
            <td>
              {(() => {
                const d = new Date(item.renewalDate)
                return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0]
              })()}
            </td>

            <td>{item.days}</td>
            <td>{item.Months}</td>
            <td
              className={
                item.state === 'موقف'
                  ? 'translate-x-4 inline-block bg-[#FFDAA0]/[.35] rounded-3xl px-2 py-1 text-sm font-semibold text-[#CEA461] mt-2'
                  : item.state === 'مستمر'
                    ? 'translate-x-4 inline-block bg-[#C5FFBC]/[.35] rounded-3xl px-2 py-1 text-sm font-semibold text-[#69DB57] mt-2'
                    : item.state === 'منتهي'
                      ? 'translate-x-4 inline-block bg-[#ffe0e0] rounded-3xl px-2 py-1 text-sm font-semibold text-[#ff0000] mt-2'
                      : ''
              }
            >
              {item.state}
            </td>
          </tr>
        ))}
      </table>
    </div>
  )
})
export default ComponentToPrint
