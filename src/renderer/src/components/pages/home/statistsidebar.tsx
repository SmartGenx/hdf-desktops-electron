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
      position: 'right' as const, // Positioning the legend to the right
      display: false
    }
  },
  scales: {
    x: {
      display: false
    },
    y: {
      display: false
    }
  }
}

interface StatistSidebarProps {
  isExpended?: boolean
}

const Statistsidebar: React.FC<StatistSidebarProps> = ({ isExpended }) => {
  const authToken = useAuthHeader()
  const {
    isPending,
    error,
    data: staticsPer
  } = useQuery({
    queryKey: ['staticsPer'],
    queryFn: () =>
      getApi<StaticsPer>('/applicant/ApplicantMonthlyGenderCount', {
        headers: {
          Authorization: authToken()
        }
      })
  })
  console.log('staticsPer', staticsPer?.data)
  return (
    <>
      {isExpended === true ? (
        <div className="flex w-[450px] ">
          <Card className="bg-blue-900 text-white w-full p-6 rounded-lg shadow-lg  h-[755px]">
            <CardHeader>
              <CardTitle className="text-lg font-bold mb-4 text-center">
                عدد المستفيدين حسب المربعات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl text-center font-semibold mb-4">
                {staticsPer?.data.applicantMonthlyGenderCountsWithSquareCount.accreditCount}
              </div>
              <div className="flex justify-center mb-4">
                <Bar data={barData} options={options} width={400} height={300} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">أعلى المربعات</span>
                  <span className="font-medium">المستفيدين</span>
                </div>

                {staticsPer?.data.applicantMonthlyGenderCountsWithSquareCount.result.map((item) => (
                  <div key={item.name} className="flex justify-between mb-1">
                    <span>{item.name}</span>
                    <span className="font-semibold">{item.count.toLocaleString()}</span>
                  </div>
                ))}
                {/* Repeat similar blocks for more data */}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex w-full">
          <Card className="bg-blue-900 text-white p-6 rounded-lg shadow-lg w-[350px] h-[755px]">
            <CardHeader>
              <CardTitle className="text-lg font-bold mb-4">عدد المستفيدين حسب المربعات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-semibold mb-4">
                {staticsPer?.data.applicantMonthlyGenderCountsWithSquareCount.accreditCount}
              </div>
              <div className="">
                <Bar data={barData} options={options} width={400} height={300} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">أعلى المربعات</span>
                  <span className="font-medium">المستفيدين</span>
                </div>
                {staticsPer?.data.applicantMonthlyGenderCountsWithSquareCount.result.map((item) => (
                  <div key={item.name} className="flex justify-between mb-1">
                    <span>{item.name}</span>
                    <span className="font-semibold">{item.count.toLocaleString()}</span>
                  </div>
                ))}
                {/* Repeat similar blocks for more data */}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

export default Statistsidebar
