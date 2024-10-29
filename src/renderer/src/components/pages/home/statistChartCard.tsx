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
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { getApi } from '@renderer/lib/http'

export interface StaticsPer {
  applicantMonthlyGenderCountsWithSquareCount: ApplicantMonthlyGenderCountsWithSquareCount
}

export interface ApplicantMonthlyGenderCountsWithSquareCount {
  monthlyCounts: MonthlyCount[]
  result: Result[]
  accreditCount: number
}

export interface MonthlyCount {
  month: number
  males: number
  females: number
}

export interface Result {
  name: string
  count: number
}

interface StaticDataItem {
  month: string
  male: number
  female: number
}

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
  const authToken = useAuthHeader()
  const { data: staticsPer, isPending } = useQuery({
    queryKey: ['staticsPer'],
    queryFn: () =>
      getApi<StaticsPer>('/applicant/ApplicantMonthlyGenderCount', {
        headers: {
          Authorization: authToken()
        }
      })
  })
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
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]

    const getMonthName = (monthNumber: number): string => {
      return monthNames[monthNumber - 1] || 'Unknown'
    }

    const staticData: StaticDataItem[] =
      staticsPer?.data.applicantMonthlyGenderCountsWithSquareCount.monthlyCounts.map((count) => ({
        month: getMonthName(count.month),
        male: count.males,
        female: count.females
      })) || []

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
  if (isPending) {
    return (
      <div className="flex justify-center items-center w-full ">
        {/* <LoaderIcon className="mt-12 flex animate-spin items-center justify-end duration-1000" /> */}
      </div>
    )
  }
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
