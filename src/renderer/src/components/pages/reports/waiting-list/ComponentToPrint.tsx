import React from 'react'
import logo from '../../../../assets/images/newlogo.svg'
import { applicantsReportCategory } from '@renderer/types'
type Props = {
  data: applicantsReportCategory[]
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
        <p className="basis-[20%] font-extrabold">عنوان التقرير : تقرير المخصصات العلاجية</p>
      </div>
      <table dir="rtl" className="w-full h-full rounded-t-lg">
        <tr className="  h-10 text-black border-2 border-gray-300 py-5 bg-[#E5F0FF]">
          <th className="translate-x-6">الأسم</th>
          <th className="translate-x-6">تصنيف المرض</th>
          <th className="translate-x-6">المنطقة</th>
          <th className="translate-x-6">الجوال</th>
          <th className="translate-x-6">تاريخ التقديم</th>
          <th className="translate-x-1">فئة</th>
        </tr>
        {data.map((item) => (
          // eslint-disable-next-line react/jsx-key
          <tr className=" -translate-x-3 h-10 text-black border-2 border-gray-300 py-5">
            <td>{item.name}</td>
            <td>{item.disease}</td>
            <td>{item.directorate}</td>
            <td>{item.phoneNumber}</td>
            <td>{String(item.submissionDate)}</td>
            <td>{item.category}</td>
          </tr>
        ))}
      </table>
    </div>
  )
})
export default ComponentToPrint
