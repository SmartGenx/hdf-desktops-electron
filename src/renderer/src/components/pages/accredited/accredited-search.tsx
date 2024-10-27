import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import AsyncSelect from 'react-select/async'
interface Accrediteds {
  applicant: Applicant
}
interface Applicant {
  name: string
}

const AccreditedSearch = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  // const queryClient = useQueryClient()
  const pathname = location.pathname
  const selectedVal = searchParams.get('query')
  const { data: accredited } = useQuery({
    queryKey: ['accreditedSearch'],
    queryFn: () =>
      getApi<Accrediteds[]>('/accredited', {
        params: {
          'include[applicant]': true
        }
      })
  })
  const loadOptions = async (value: string) => {
    if (!value) return []
    const data = await getApi<Accrediteds[]>('/accredited', {
      params: {
        'include[applicant]': true,
        'applicant[name][contains]': value
      }
    })
    return data.data || []
  }
  const customComponents = {
    DropdownIndicator: () => null,
    IndicatorSeparator: () => null
  }
  const onChange = (val: Accrediteds | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (val?.applicant.name) {
      params.set('query', val.applicant.name)
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
      <AsyncSelect<Accrediteds>
        placeholder="ابحث عن.."
        loadingMessage={() => 'جارٍ البحث ...'}
        noOptionsMessage={() => 'لا توجد نتائج'}
        cacheOptions
        instanceId="products-search"
        value={selectedVal?.length ? { applicant: { name: selectedVal } } : undefined}
        defaultOptions={accredited?.data}
        loadOptions={loadOptions}
        onChange={onChange}
        getOptionLabel={({ applicant }) => applicant.name}
        getOptionValue={({ applicant }) => applicant.name}
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
export default AccreditedSearch
