import React from 'react'
import logo from '../../../../assets/images/newlogo.svg'
import { ApplicantByDirectorateViewModel } from '@renderer/types'
type Props = {
  data: ApplicantByDirectorateViewModel[]
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
        {data.map((item) => (
          // eslint-disable-next-line react/jsx-key
          <tr className=" -translate-x-3 h-10 text-black border-2 border-gray-300 py-5">
            <td>{item.name}</td>
            <td>{item.gender}</td>
            <td>{item.disease}</td>
            <td>{item.directorate}</td>
            <td>{item.phoneNumber}</td>
            <td>{item.state}</td>
            <td>{item.totalAmount}</td>
            <td>{item.supportRatio}</td>
            <td>{item.approvedAmount}</td>
          </tr>
        ))}
      </table>
    </div>
  )
})
export default ComponentToPrint
