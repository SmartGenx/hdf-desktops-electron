import StatistCard from '@renderer/components/statistCard'
import StatistChartCard from './statistChartCard'
import StatistchartTowCard from './statistchartTowCard'
import Statistsidebar from './statistsidebar'

const Home = () => {
  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        <div className=" col-span-1 ">
          <StatistCard title={'المرضى'} value={'20'} subtitle={'مستفيد'} icon={'hospital'} />
        </div>
        <div className="col-span-1 ">
          <StatistCard title={'المرضى'} value={'20'} subtitle={'مستفيد'} icon={'house'} />
        </div>
        <div className="col-span-1 ">
          <StatistCard title={'المرضى'} value={'20'} subtitle={'مستفيد'} icon={'house'} />
        </div>
        <div className="col-span-1 ">
          <StatistCard title={'المرضى'} value={'20'} subtitle={'مستفيد'} icon={'house'} />
        </div>
      </div>
      <div className="flex  jstify-between   mt-4">
        <div className="flex flex-col gap-2">
          <StatistChartCard />
          <StatistchartTowCard />
        </div>
        <div>
          <Statistsidebar />
        </div>
      </div>
    </div>
  )
}

export default Home
