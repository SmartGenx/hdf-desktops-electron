import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: true,
      mode: 'index' as const,
      intersect: false
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      max: 50000
    }
  }
}

const StatistChartCard = () => {
  const [chartData, setChartData] = useState<{
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
      fill: boolean
      tension: number
    }[]
  }>({
    labels: [],
    datasets: [
      {
        label: 'الذكور',
        data: [],
        borderColor: '#1E90FF',
        backgroundColor: 'rgba(30, 144, 255, 0.3)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'الإناث',
        data: [],
        borderColor: '#9ACD32',
        backgroundColor: 'rgba(154, 205, 50, 0.3)',
        fill: true,
        tension: 0.4
      }
    ]
  })

  useEffect(() => {
    // Static data for demonstration
    const staticData = [
      { month: 'January', male: 20000, female: 15000 },
      { month: 'February', male: 21000, female: 16000 },
      { month: 'March', male: 22000, female: 17000 },
      { month: 'April', male: 23000, female: 18000 },
      { month: 'May', male: 24000, female: 19000 },
      { month: 'June', male: 25000, female: 20000 },
      { month: 'July', male: 26000, female: 21000 },
      { month: 'August', male: 27000, female: 22000 },
      { month: 'September', male: 28000, female: 23000 },
      { month: 'October', male: 29000, female: 24000 },
      { month: 'November', male: 30000, female: 25000 },
      { month: 'December', male: 31000, female: 26000 }
    ]

    const labels = staticData.map((item) => item.month)
    const maleData = staticData.map((item) => item.male)
    const femaleData = staticData.map((item) => item.female)

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'الذكور',
          data: maleData,
          borderColor: '#1E90FF',
          backgroundColor: 'rgba(30, 144, 255, 0.3)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'الإناث',
          data: femaleData,
          borderColor: '#9ACD32',
          backgroundColor: 'rgba(154, 205, 50, 0.3)',
          fill: true,
          tension: 0.4
        }
      ]
    })
  }, [])

  return (
    <div className="h-[350px] w-[836px]">
      <Card className="shadow-lg border rounded-lg w-full h-full">
        <CardHeader className="flex justify-between ">
          <CardTitle className="text-right">إجمالي عدد المستفيدين</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex">
            <div className="flex flex-col justify-start ">
              <div className="flex flex-col">
                <span className="block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                <span className="text-sm text-gray-600">الذكور</span>
              </div>
              <div className="flex flex-col ">
                <span className="block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-sm text-gray-600">الإناث</span>
              </div>
            </div>
            <div className="w-full h-full">
              <Line data={chartData} height={292} width={836} options={options} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StatistChartCard
