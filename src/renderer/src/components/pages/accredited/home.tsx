import StatistCard from '@renderer/components/statistCard'
import SearchInput from '../../searchInput'
import Boutton from '@renderer/components/Boutton'
import FilterDrawer from './filter'
import { useAuthHeader } from 'react-auth-kit'
import { Accrediteds } from '@renderer/types'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance, getApi } from '@renderer/lib/http'
import { Link } from 'react-router-dom'
import AccreditedTable from './accreditedTable'
import { useEffect, useRef, useState } from 'react'
import { Printer } from 'lucide-react'
import ReactToPrint from 'react-to-print'
import A4Layout from './print-cards'
export type statistCardInfo = {
  count: number
}
const Home = () => {
  const [statist, setStatist] = useState<statistCardInfo | undefined>()
  const authToken = useAuthHeader()
  const {
    isPending,
    error,
    data: accredited
  } = useQuery({
    queryKey: ['accredited'],
    queryFn: () =>
      getApi<Accrediteds>('/accredited', {
        params: {
          'include[applicant]': true,
          'include[square]': true,
          page: 1 || 11,
          pageSize: 5 || 10
        },
        headers: {
          Authorization: authToken()
        }
      })
  })
  useEffect(() => {
    const fetchStatist = async () => {
      try {
        const response = await axiosInstance.get('/accredited/count', {
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
  const componentRef = useRef<HTMLDivElement>(null)
  if (isPending) return 'Loading...'
  if (error) return 'An error has occurred: ' + error.message
  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        <div className=" col-span-1 ">
          <StatistCard
            title={'المعتمدين'}
            value={statist?.count}
            subtitle={'مستفيد'}
            icon={'hospital'}
          />
        </div>
      </div>
      <div className="flex  gap-5 mt-[85px] items-center justify-between  ">
        <div className="w-fit">
          <h1 className="text-2xl font-medium">جدول المعتمدين</h1>
        </div>
        <div className="flex gap-7">
          <SearchInput />
          <FilterDrawer />
          {/* <Boutton icon="filter" title={'طباعة'} /> */}
          <ReactToPrint
            trigger={() => (
              <button className="bg-[#196CB0] flex items-center text-white rounded-lg hover:bg-[#2d5372] px-3 focus:ring-[#2d5372]">
                <Printer className="ml-2" size={20} />
                طباعة
              </button>
            )}
            content={() => componentRef.current}
          />
          <div className="hidden">
            <A4Layout ref={componentRef} />
          </div>
          <Link to={'/FormAccredited'}>
            <Boutton
              icon="addaccredited"
              title={'اضافة معتمد '}
              className="bg-[#92A709] hover:bg-[#5b6806] focus:ring-[#92A709]"
            />
          </Link>
        </div>
      </div>
      <div className="mt-5"></div>
      <AccreditedTable
        info={accredited.data.info || []}
        page={accredited.data.page || '1'}
        pageSize={accredited.data.pageSize || '5'}
        total={accredited.data.total || 10}
      />
    </div>
  )
}

export default Home
