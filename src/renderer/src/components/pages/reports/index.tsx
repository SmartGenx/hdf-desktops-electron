import { useState } from 'react'
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
  return (
    <div className="flex flex-col gap-6 ">
      <div className="flex  flex-col justify-center px-6 gap-16 bg-white rounded-[8px] pb-20">
        <div className="border-[#DADADA80]/50 border-b-2 ">
          <div className="w-fit border-[#196CB0] border-b-2 pb-4 pt-2">
            <h1 className="text-xl font-bold  text-[#196CB0]   "> التقاريـــر الصرف</h1>
          </div>
        </div>
        <section className="rounded-xl bg-background">
          <Tabs
            defaultValue={activeTab}
            onValueChange={(value) => setActiveTab(value)}
            className="mt-6 dark:bg-[#09090b]"
          >
            <TabsList className="p-0 flex justify-start">
              {subTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="gap-x-2 ">
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {subTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="p-4 pt-8">
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </div>
    </div>
  )
}
