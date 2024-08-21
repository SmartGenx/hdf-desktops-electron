import StatistCard from '@renderer/components/statistCard'
import React, { useState } from 'react'
import SearchInput from '../../searchInput'
import Boutton from '@renderer/components/Boutton'
import FilterComponent from './filter'
import FilterDrawer from './filter'

const Home = () => {
 
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
          <h1 className="text-2xl font-medium">جدول المتقدمين</h1>
        </div>
        <div className="flex gap-7">
          <SearchInput />
          <FilterDrawer  />
          <Boutton icon="filter" title={'طباعة'} />
          <Boutton
            title={'اضافة متقدم '}
            className="bg-[#92A709] hover:bg-[#5b6806] focus:ring-[#92A709]"
          />
        </div>
      </div>
      <div className="mt-5">

      </div>
    </div>
  )
}

export default Home
