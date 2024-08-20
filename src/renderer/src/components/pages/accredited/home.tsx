import StatistCard from '@renderer/components/statistCard'
import StatistChartCard from './statistChartCard'

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
      <div className="flex flex-col bg-red-500 gap-1">


          <StatistChartCard />
          <StatistChartCard />

      </div>
    </div>
  )
}

export default Home
