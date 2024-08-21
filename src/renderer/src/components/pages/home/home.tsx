import StatistCard from '@renderer/components/statistCard'
import StatistChartCard from './statistChartCard'
import StatistchartTowCard from './statistchartTowCard'
import Statistsidebar from './statistsidebar'
import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { useAuthHeader } from 'react-auth-kit'
import { statisticCardType } from '@renderer/types'

const Home = () => {
  const authToken = useAuthHeader()
  const { isLoading, error, data } = useQuery({
    queryKey: ['statistics'],
    queryFn: () =>
      getApi<statisticCardType>('/statistics/Initialization', {
        headers: {
          Authorization: authToken()
        }
      })
  })
  console.log('dsdsdfs', data?.data.GovernorateCount)
  if (isLoading) return 'Loading...'
  if (error) return 'An error has occurred: ' + error.message
  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        <div className=" col-span-1 ">
          <StatistCard
            title={'المرضى'}
            value={data?.data.GovernorateCount ?? 45}
            subtitle={'مستفيد'}
            icon={'hospital'}
          />
        </div>
        <div className="col-span-1 ">
          <StatistCard title={'المرضى'} value={20} subtitle={'مستفيد'} icon={'house'} />
        </div>
        <div className="col-span-1 ">
          <StatistCard title={'المرضى'} value={30} subtitle={'مستفيد'} icon={'house'} />
        </div>
        <div className="col-span-1 ">
          <StatistCard title={'المرضى'} value={40} subtitle={'مستفيد'} icon={'house'} />
        </div>
      </div>
      <div className="flex  jstify-between   mt-4">
        <div className="flex flex-col gap-2">
          <StatistChartCard />
          <StatistchartTowCard />
        </div>
        <div>
          <Statistsidebar />
        </div>
      </div>
    </div>
  )
}

export default Home
