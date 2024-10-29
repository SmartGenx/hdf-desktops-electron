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
import { useEffect, useState } from 'react'
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { getApi } from '@renderer/lib/http'
import { LoaderIcon } from 'lucide-react'

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

// Registering the required components from chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right' as const // Positioning the legend to the right
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      reverse: true // This reverses the x-axis to display months from right to left
    },
    y: {
      beginAtZero: true,
      max: 60 // Setting the max value for the y-axis
    }
  }
}

const StatistchartTowCard = () => {
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
  console.log(
    'staticsPer',
    staticsPer?.data.applicantMonthlyGenderCountsWithSquareCount.monthlyCounts
  )
  const [chartData, setChartData] = useState<{
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor: string
      borderRadius: number
      barPercentage: number
    }[]
  }>({
    labels: [],
    datasets: [
      {
        label: 'الذكور',
        data: [],
        backgroundColor: 'rgba(30, 144, 255, 0.3)',
        borderRadius: 10,
        barPercentage: 0.5
      },
      {
        label: 'الإناث',
        data: [],
        backgroundColor: 'rgba(154, 205, 50, 0.3)',
        borderRadius: 10,
        barPercentage: 0.5
      }
    ]
  })
  useEffect(() => {
    // Static data for demonstration
    // const staticData = [
    //   { month: 'January', male: 20, female: 15 },
    //   { month: 'February', male: 10, female: 20 },
    //   { month: 'March', male: 10, female: 10 },
    //   { month: 'April', male: 30, female: 40 },
    //   { month: 'April', male: 15, female: 30 },
    //   { month: 'April', male: 30, female: 60 },
    //   { month: 'April', male: 10, female: 30 },
    //   { month: 'April', male: 30, female: 20 },
    //   { month: 'April', male: 10, female: 30 },
    //   { month: 'April', male: 50, female: 30 },
    //   { month: 'April', male: 30, female: 15 }
    // ]

    // console.log(staticsPer?.data.applicantMonthlyGenderCountsWithSquareCount.monthlyCounts.map((X)=>X.females))
    // const labels = staticData.map((item) => item.month)
    // const maleData = staticData.map((item) => item.male)
    // const femaleData = staticData.map((item) => item.female)

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
          backgroundColor: '#196CB0',
          borderRadius: 10,
          barPercentage: 0.5
        },
        {
          label: 'الإناث',
          data: femaleData,
          backgroundColor: '#6E6E6E',
          borderRadius: 10,
          barPercentage: 0.5
        }
      ]
    })
  }, [])
  if (isPending) {
    return (
      <div className="flex justify-center items-center w-full ">
        <LoaderIcon className="mt-12 flex animate-spin items-center justify-end duration-1000" />
      </div>
    )
  }

  return (
    <div className="h-[400px] w-[836px]">
      <Card className="shadow-lg border rounded-lg w-full h-full">
        <CardHeader className="flex justify-between ">
          <CardTitle className="text-right">إجمالي عدد المستفيدين</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-full justify-center items-center">
            <Bar data={chartData} height={350} width={836} options={options} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StatistchartTowCard
