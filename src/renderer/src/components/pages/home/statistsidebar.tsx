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
import { ChartOptions } from 'chart.js'
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

interface StatistSidebarProps {
  isExpended?: boolean
}

const Statistsidebar: React.FC<StatistSidebarProps> = ({ isExpended }) => {
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

  const labels = [
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
  ]

  const data = staticsPer?.data.applicantMonthlyGenderCountsWithSquareCount.monthlyCounts.map(
    (monthData) => monthData.males + monthData.females
  )

  const barData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        barPercentage: 0.5
      }
    ]
  }

  // Use 'as const' for the position property
  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right', // TypeScript now knows this is a specific literal type
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
  if (isPending) {
    return <div className="flex justify-center items-center w-full "></div>
  }
  return (
    <>
      {isExpended === true ? (
        <div className="flex w-[450px] justify-end">
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

                <div className="max-h-[300px] px-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-gray-500">
                  {staticsPer?.data.applicantMonthlyGenderCountsWithSquareCount.result.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 space-x-4 rtl:space-x-reverse"
                      >
                        <span className="flex-1 text-right pr-2">{item.name}</span>
                        <span className="flex-none w-12 font-semibold text-left">
                          {item.count.toLocaleString()}
                        </span>
                      </div>
                    )
                  )}
                </div>

                {/* Repeat similar blocks for more data */}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex w-full justify-end">
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
                <div className="max-h-[400px] px-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-gray-500">
                  {staticsPer?.data.applicantMonthlyGenderCountsWithSquareCount.result.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 space-x-4 rtl:space-x-reverse"
                      >
                        <span className="flex-1 text-right pr-2">{item.name}</span>
                        <span className="flex-none w-12 font-semibold text-left">
                          {item.count.toLocaleString()}
                        </span>
                      </div>
                    )
                  )}
                </div>
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
