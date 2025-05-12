import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs2'
import { InfoIcon, MoveRight } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import Category from './tabs/category'
import Governorate from './tabs/governorate'
import Directorate from './tabs/directorate'
import Square from './tabs/square'
import Pharmacy from './tabs/pharmacy'
import Disease from './tabs/disease'
import { useNavigate } from 'react-router-dom'

const subTabs = [
  {
    value: 'category',
    title: ' الفئات',
    content: <Category />,
    icon: <InfoIcon color="#434749" />
  },
  {
    value: 'governorate',
    title: ' المحافظات',
    content: <Governorate />,
    icon: <InfoIcon color="#434749" />
  },
  {
    value: 'directorate',
    title: ' المديريات',
    content: <Directorate />,
    icon: <InfoIcon color="#434749" />
  },
  {
    value: 'square',
    title: ' المربعات',
    content: <Square />,
    icon: <InfoIcon color="#434749" />
  },
  {
    value: 'pharmacy',
    title: ' الصيدليات',
    content: <Pharmacy />,
    icon: ''
  },
  {
    value: 'disease',
    title: ' الامراض',
    content: <Disease />,
    icon: ''
  }
]
const Initialization = () => {
  const [activeTab, setActiveTab] = useState<string>(subTabs[0].value)
  const navigate = useNavigate()
  return (
    <>
      <div className=" mt-4 flex flex-col gap-5 ">
        <h1 className=" text-[24px] font-medium">تهيئة النظام</h1>
        <div className="flex justify-between items-center">
          <Button
            variant={'Hdf-outline'}
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <MoveRight size={20} className=" " />
            رجـوع
          </Button>
        </div>
      </div>
      <Tabs
        defaultValue={activeTab}
        onValueChange={(value) => setActiveTab(value)}
        className=" dark:bg-[#09090B] mt-4 bg-white rounded-2xl py-5 px-4"
      >
        <div className=" ">
          <TabsList className=" w-full flex ">
            {subTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-x-2">
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {subTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="p-4 mt-0 pt-7">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}
export default Initialization
