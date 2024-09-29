import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import AsyncSelect from 'react-select/async'
interface Dismissals {
  Accredited: Accredited
}
interface Accredited {
  doctor: string
}

const DismissalSearch = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  // const queryClient = useQueryClient()
  const pathname = location.pathname
  const selectedVal = searchParams.get('query')
  const { data: dismissal } = useQuery({
    queryKey: ['dismissal'],
    queryFn: () =>
      getApi<Dismissals[]>('/dismissal', {
        params: {
          'include[Accredited]': true
        }
      })
  })
  const loadOptions = async (value: string) => {
    if (!value) return []
    const data = await getApi<Dismissals[]>('/dismissal', {
      params: {
        'include[Accredited]': true,
        'Accredited[doctor][contains]': value
      }
    })
    return data.data || []
  }
  const customComponents = {
    DropdownIndicator: () => null,
    IndicatorSeparator: () => null
  }
  const onChange = (val: Dismissals | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (val?.Accredited.doctor) {
      params.set('query', val.Accredited.doctor)
    } else {
      params.delete('query')
    }
    params.set('page', '1')
    // queryClient.invalidateQueries({ queryKey: ['products'] })
    navigate(`${pathname}?${params.toString()}`, { replace: true })
  }
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      border: 'none',
      boxShadow: 'none',
      backgroundColor: '#fff'
    }),
    input: (provided: any) => ({
      ...provided,
      margin: 0
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999
    }),
    placeholder: (provided: any) => ({
      ...provided,
      fontWeight: 'bold',
      color: '#4B4846'
    }),
    singleValue: (provided: any) => ({
      ...provided
    })
  }
  return (
    <section className="flex w-[390px] items-center justify-center rounded-lg border border-[#7D7875] ">
      <Search className="mr-2 text-gray-500" />
      <AsyncSelect<Dismissals>
        placeholder="ابحث عن.."
        loadingMessage={() => 'جارٍ البحث ...'}
        noOptionsMessage={() => 'لا توجد نتائج'}
        cacheOptions
        instanceId="products-search"
        value={selectedVal?.length ? { Accredited: { doctor: selectedVal } } : undefined}
        defaultOptions={dismissal?.data}
        loadOptions={loadOptions}
        onChange={onChange}
        getOptionLabel={({ Accredited }) => Accredited.doctor}
        getOptionValue={({ Accredited }) => Accredited.doctor}
        components={customComponents}
        isClearable
        menuIsOpen={isMenuOpen}
        onInputChange={(value) => {
          setIsMenuOpen(value.length > 0)
        }}
        styles={customStyles}
        className="flex-grow"
      />
    </section>
  )
}
export default DismissalSearch
