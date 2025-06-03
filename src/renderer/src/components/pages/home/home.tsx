import StatistChartCard from './statistChartCard'
import StatistchartTowCard from './statistchartTowCard'
import Statistsidebar from './statistsidebar'
import { getApi } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'
import { useEffect, useRef, useState } from 'react'
import StatistCardWithImage from '@renderer/components/statistCardWithImage'
import LackOfAir from '../../../assets/images/lack-of-air.png'
import LocationPin from '../../../assets/images/location-pin.png'
import map from '../../../assets/images/map.png'
import yemen from '../../../assets/images/yemen.png'
import { useQuery } from '@tanstack/react-query'
import { LoaderIcon } from 'lucide-react'
export type statistCardInfo = {
  diseaseCount: number
  governorateCount: number
  directorateCount: number
  squareCount: number
}

const Home = () => {
  const authToken = useAuthHeader()

  const divRef = useRef<HTMLDivElement>(null)


  // State to track if div width is greater than 1218px
  const [expanded, setExpanded] = useState<boolean>(true)

  // State to store div width
  const [divWidth, setDivWidth] = useState<number>(0)

  // Function to update divWidth using ResizeObserver
  const updateDivWidth = () => {
    if (divRef.current) {
      setDivWidth(divRef.current.clientWidth)
    }
  }

  useEffect(() => {
    const currentDiv = divRef.current
    if (!currentDiv) return

    // Initialize divWidth
    updateDivWidth()

    // Create a ResizeObserver to watch for div size changes
    const resizeObserver = new ResizeObserver(() => {
      updateDivWidth()
    })

    resizeObserver.observe(currentDiv)

    // Cleanup on unmount
    return () => {
      resizeObserver.disconnect()
    }
  }, []) // Run once on mount

  useEffect(() => {
    if (divWidth === 0) return // Avoid running the condition before divWidth is set

    if (divWidth <= 1218) {
      setExpanded(false)
    } else {
      setExpanded(true)
    }
  }, [divWidth]) // Depend only on divWidth

  const { data: statist, isPending } = useQuery({
    queryKey: ['Initialization'],
    queryFn: () =>
      getApi<statistCardInfo>('/statistics/Initialization', {
        headers: {
          Authorization: authToken()
        }
      })
  })
  if (isPending) {
    return (
      <div className="flex justify-center items-center w-full ">
        <LoaderIcon className="mt-12 flex animate-spin items-center justify-end duration-1000" />
      </div>
    )
  }
  return (
    <div ref={divRef}>
      {expanded === true ? (
        <>
          <div className=" grid grid-cols-4 gap-2">
            <div className=" col-span-1 ">
              <StatistCardWithImage
                title={'الامراض'}
                value={statist?.data?.diseaseCount ?? 0}
                image={LackOfAir}
              />
            </div>
            <div className="col-span-1 ">
              <StatistCardWithImage
                title={'مديرية'}
                value={statist?.data?.directorateCount ?? 0}
                image={LocationPin}
              />
            </div>
            <div className="col-span-1 ">
              <StatistCardWithImage
                title={'المربع'}
                value={statist?.data?.squareCount ?? 0}
                image={map}
              />
            </div>
            <div className="col-span-1 ">
              <StatistCardWithImage
                title={'محافظة'}
                value={statist?.data?.governorateCount ?? 0}
                image={yemen}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mt-4 w-full">
            <div className="flex flex-col gap-2 md:w-1/2">
              <StatistChartCard />
              <StatistchartTowCard />
            </div>
            <div className="md:w-1/2 md:flex md:justify-end">
              <Statistsidebar isExpended={true} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className=" grid grid-cols-4 gap-2">
            <div className=" col-span-1 ">
              <StatistCardWithImage
                title={'الامراض'}
                value={statist?.data?.diseaseCount ?? 0}
                image={LackOfAir}
              />
            </div>
            <div className="col-span-1 ">
              <StatistCardWithImage
                title={'المديريات'}
                value={statist?.data?.directorateCount ?? 0}
                image={LocationPin}
              />
            </div>
            <div className="col-span-1 ">
              <StatistCardWithImage
                title={'المربعات'}
                value={statist?.data?.squareCount ?? 0}
                image={map}
              />
            </div>
            <div className="col-span-1 ">
              <StatistCardWithImage
                title={'المحافظات'}
                value={statist?.data?.governorateCount ?? 0}
                image={yemen}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mt-4 w-full">
            <div className="flex flex-col gap-2 md:w-1/2">
              <StatistChartCard />
              <StatistchartTowCard />
            </div>
            <div className="md:w-1/2 md:flex md:justify-end">
              <Statistsidebar />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Home
