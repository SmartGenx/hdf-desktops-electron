import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'

// Registering the required components from chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const barData = {
  labels: [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر'
  ],
  datasets: [
    {

      data: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160],
      backgroundColor: '#ffffff',
      borderRadius: 10,
      barPercentage: 0.5
    }
  ]
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right' as const // Positioning the legend to the right
    },

  },
  scales: {
    x: {
      display:false
    },
    y: {
      display: false
    },
  },
}

const Statistsidebar = () => {
  return (
    <div className="flex w-full">
      <Card className="bg-blue-900 text-white p-6 rounded-lg shadow-lg w-[350px] h-[755px]">
        <CardHeader>
          <CardTitle className="text-lg font-bold mb-4">عدد المستفيدين حسب المربعات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-semibold mb-4">480,872</div>
          <div className="">
            <Bar data={barData} options={options} width={400} height={300} />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">أعلى المربعات</span>
              <span className="font-medium">المستفيدين</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>متوب</span>
              <span className="font-semibold">230,975</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>غصمي</span>
              <span className="font-semibold">130,664</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>هيبن</span>
              <span className="font-semibold">120,353</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>الخديد</span>
              <span className="font-semibold">110,536</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>فمخ</span>
              <span className="font-semibold">100,984</span>
            </div>
            {/* Repeat similar blocks for more data */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Statistsidebar
