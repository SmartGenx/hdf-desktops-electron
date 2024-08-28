import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
// import OrgProfile from "../org-profile";
// import MainInfo from "./(sub-tabs)/main-info";
// import Structure from "./(sub-tabs)/structure";
// import AttachmentTab from "./(sub-tabs)/attachment";
import { InfoIcon } from 'lucide-react'
import Home from '../Applicants/home'

const subTabs = [
  {
    value: 'main-info',
    title: 'المعلومات الرئيسية',
    content: <Home />,
    icon: <InfoIcon color="#434749" />
  },
  {
    value: 'g65y6787',
    title: 'trg التنظيمي',
    content: <Home />,
    icon: <InfoIcon color="#434749" />
  },
  {
    value: 'u77u76iu7i7',
    title: 'الهيكل y',
    content: <Home />,
    icon: <InfoIcon color="#434749" />
  },
  {
    value: '7j7j7j7',
    title: 'الهيكلee',
    content: <Home />,
    icon: <InfoIcon color="#434749" />
  }
  // {
  //   value: "attachment",
  //   title: "المرفقات",
  //   content: <AttachmentTab />,
  //   icon: <PermMediaIcon />,
  // },
]
const Initialization = () => {
  const [activeTab, setActiveTab] = useState<string>(subTabs[0].value)
  return (
    <>
      <div className="ms-8 mt-4 flex flex-col gap-5">{/* <OrgProfile /> */}</div>
      <Tabs
        defaultValue={activeTab}
        onValueChange={(value) => setActiveTab(value)}
        className="mt-6 dark:bg-[#09090B] bg-white rounded-2xl"
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
          <TabsContent key={tab.value} value={tab.value} className="p-4 pt-8">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}
export default Initialization
