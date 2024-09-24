import StatistCard from '@renderer/components/statistCard'
import StatistChartCard from './statistChartCard'
import StatistchartTowCard from './statistchartTowCard'
import Statistsidebar from './statistsidebar'
import { axiosInstance } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'
import { useEffect, useState } from 'react'

export type statistCardInfo = {
  diseaseCount: number
  GovernorateCount: number
  directoratecount: number
  squareCount: number
}

const Home = () => {
  const authToken = useAuthHeader()
  const [statist, setStatist] = useState<statistCardInfo | undefined>()

  useEffect(() => {
    const fetchStatist = async () => {
      try {
        const response = await axiosInstance.get('/statistics/Initialization', {
          headers: {
            Authorization: `${authToken()}`
          }
        })
        setStatist(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchStatist()
  }, [])

  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        <div className=" col-span-1 ">
          <StatistCard
            title={'المرض'}
            value={statist?.diseaseCount ?? 0}
            subtitle={'مستفيد'}
            icon={'hospital'}
          />
        </div>
        <div className="col-span-1 ">
          <StatistCard
            title={'مديرية'}
            value={statist?.directoratecount ?? 0}
            subtitle={'مستفيد'}
            icon={'house'}
          />
        </div>
        <div className="col-span-1 ">
          <StatistCard
            title={'المربع'}
            value={statist?.squareCount ?? 0}
            subtitle={'مستفيد'}
            icon={'house'}
          />
        </div>
        <div className="col-span-1 ">
          <StatistCard
            title={'محافظة'}
            value={statist?.GovernorateCount ?? 0}
            subtitle={'مستفيد'}
            icon={'house'}
          />
        </div>
      </div>
      <div className="flex gap-8 mt-4 w-full ">
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
