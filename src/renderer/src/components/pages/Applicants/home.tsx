import Boutton from '@renderer/components/Boutton'
import FilterDrawer from './filter'
import StateTable from './applicantTabel'
import { useAuthHeader } from 'react-auth-kit'
import { Applicants } from '@renderer/types'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance, getApi } from '@renderer/lib/http'
import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ApplicantsSearch from './applicants-search'
import LackOfAir from '../../../assets/images/lack-of-air.png'
import StatistCardWithImage from '@renderer/components/statistCardWithImage'
import { LoaderIcon } from 'lucide-react'

export type statistCardInfo = {
  count: number
}

const Home = () => {
  const [searchParams] = useSearchParams()
  const categoryGlobalId = searchParams.get('categoryGlobalId')
  const directorateGlobalId = searchParams.get('directorateGlobalId')
  const gender = searchParams.get('gender')
  const fromDate = searchParams.get('submissionDate[gte]')
  const toDate = searchParams.get('submissionDate[lte]')

  const query = searchParams.get('query')
  const page = searchParams.get('page')
  const [statist, setStatist] = useState<statistCardInfo | undefined>()
  const authToken = useAuthHeader()
  const {
    isPending,
    error,
    data: applicants
  } = useQuery({
    queryKey: [
      'applicant',
      page,
      query,
      directorateGlobalId,
      fromDate,
      toDate,
      categoryGlobalId,
      gender
    ],
    queryFn: () =>
      getApi<Applicants>('/applicant', {
        params: {
          'include[directorate]': true,
          'include[category]': true,
          'include[diseasesApplicants]': true,
          'name[contains]': query,
          'submissionDate[gte]': fromDate,
          'submissionDate[lte]': toDate,
          directorateGlobalId: directorateGlobalId,
          categoryGlobalId: categoryGlobalId,
          gender: gender,
          page: page || 1,
          pageSize: 10
        },
        headers: {
          Authorization: authToken()
        }
      })
  })

  useEffect(() => {
    const fetchStatist = async () => {
      try {
        const response = await axiosInstance.get('/applicant/count', {
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

  if (isPending) {
    return (
      <div className="flex justify-center items-center w-full ">
        <LoaderIcon className="mt-12 flex animate-spin items-center justify-end duration-1000" />
      </div>
    )
  }
  if (error) return 'An error has occurred: ' + error.message
  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        <div className=" col-span-1 ">
          <StatistCardWithImage title={'المتقدمين'} value={statist?.count} image={LackOfAir} />
        </div>
      </div>
      <div className="flex  gap-5 mt-[85px] items-center justify-between  ">
        <div className="w-fit">
          <h1 className="text-2xl font-medium">جدول المتقدمين</h1>
        </div>
        <div className="flex gap-7">
          <ApplicantsSearch />
          <FilterDrawer />

          <Link to={'/FormApplicant'}>
            <Boutton
              icon="exportscvs"
              title={'اضافة متقدم '}
              className="bg-[#92A709] hover:bg-[#5b6806] focus:ring-[#92A709]"
            />
          </Link>
        </div>
      </div>
      <div className="mt-5"></div>
      <StateTable
        info={applicants.data.info || []}
        page={applicants.data.page || '1'}
        pageSize={applicants.data.pageSize || '5'}
        total={applicants.data.total || 10}
      />
    </div>
  )
}

export default Home
