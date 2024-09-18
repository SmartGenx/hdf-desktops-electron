import StatistCard from '@renderer/components/statistCard'
import SearchInput from '../../searchInput'
import Boutton from '@renderer/components/Boutton'
import FilterDrawer from './filter'
import { useAuthHeader } from 'react-auth-kit'
import { Dismissales } from '@renderer/types'
import { useQuery } from '@tanstack/react-query'
import { getApi } from '@renderer/lib/http'
import { Link } from 'react-router-dom'
import DismissalTable from './dismissalTable'

const Dismissal = () => {
  const authToken = useAuthHeader()
  const {
    isPending,
    error,
    data: accredited
  } = useQuery({
    queryKey: ['dismissal'],
    queryFn: () =>
      getApi<Dismissales>('/dismissal', {
        params: {
          'include[Accredited][include]': 'pharmacy-applicant',
          page: 1 || 11,
          pageSize: 5 || 10
        },
        headers: {
          Authorization: authToken()
        }
      })
  })

  if (isPending) return 'Loading...'
  if (error) return 'An error has occurred: ' + error.message
  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        <div className=" col-span-1 ">
          <StatistCard title={'المرضى'} value={45} subtitle={'مستفيد'} icon={'hospital'} />
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
      <div className="flex  gap-5 mt-[85px] items-center justify-between  ">
        <div className="w-fit">
          <h1 className="text-2xl font-medium">جدول متابعة الصرف</h1>
        </div>
        <div className="flex gap-7">
          <SearchInput />
          <FilterDrawer />

          <Link to={'/formDismissal'}>
            <Boutton
              icon="addaccredited"
              title={'صرف دواء'}
              className="bg-[#92A709] hover:bg-[#5b6806] focus:ring-[#92A709]"
            />
          </Link>
        </div>
      </div>
      <div className="mt-5"></div>
      <DismissalTable
        info={accredited.data.info || []}
        page={accredited.data.page || '1'}
        pageSize={accredited.data.pageSize || '5'}
        total={accredited.data.total || 10}
      />
    </div>
  )
}

export default Dismissal
