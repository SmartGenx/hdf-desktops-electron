import { useEffect, useRef, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'

import MedicalAllocationsIndex from './Medical allocations'
import FollowTheRecipes from './follow-the-recipes'
import WaitingList from './waiting-list'

const subTabs = [
  {
    value: 'Medical-allocations',
    title: 'المخصصات العلاجية',
    content: <MedicalAllocationsIndex />
  },
  {
    value: 'Follow-the-recipes',
    title: 'متابعة الوصفات',
    content: <FollowTheRecipes />
  },
  {
    value: 'waiting-list',
    title: 'قائمة الأنتظار',
    content: <WaitingList />
  }
]

export default function ReportIndex() {
  const [activeTab, setActiveTab] = useState<string>(subTabs[0].value)
  const firstTabRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Focus the first tab when the component mounts
    firstTabRef.current?.focus()
  }, [])
  return (
    <div className="flex flex-col gap-6  ">
      <div className="flex  flex-col justify-center px-6 gap-5  rounded-[8px] pb-20 ">
        <div className="border-[#DADADA80]/50 border-b-2 ">
          <div className="w-fit border-[#196CB0] border-b-2  pt-2">
            <h1 className="text-xl font-bold  text-[#196CB0]   "> تقاريـــر الصرف</h1>
          </div>
        </div>
        <section className="rounded-xl bg-background  ">
          <Tabs
            defaultValue={activeTab}
            onValueChange={(value) => setActiveTab(value)}
            className=" dark:bg-[#09090b]"
          >
            <TabsList className="p-0 flex justify-start">
              {subTabs.map((tab, index) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="gap-x-2 "
                  ref={index === 0 ? firstTabRef : null}
                >
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {subTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="p-4 ">
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </div>
    </div>
  )
}
