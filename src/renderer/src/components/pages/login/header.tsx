import Youtube from '../../../assets/images/YouTube.svg'
import logo from '../../../assets/images/newlogo.svg'
import title from '../../../assets/images/titleLog.svg'
import inst from '../../../assets/images/inst.svg'
import facebook from '../../../assets/images/facebook.svg'
import x from '../../../assets/images/x.svg'

const Header = () => {
  return (
    <div className="h-[126px] flex px-[193px] justify-between border-b-2 border-cyan-500 items-center">
      <div className="flex gap-5">
        <div>
          <img src={logo} alt="" />
        </div>
        <div className="mt-5">
          <img src={title} alt="" />
        </div>
      </div>
      <div className="flex flex-col gap-[7px]">
        <h1 className="text-3xl text-[#196CB0] font-semibold">الصحة حيــــاة</h1>
        <div className="flex items-center gap-3 mr-3 ">
          <div>
            <img src={Youtube} alt="" className="" />
          </div>
          <div className="w-[2px] h-[10px] bg-[#6B6B6B]"></div>
          <div>
            <img src={inst} alt="" className="" />
          </div>
          <div className="w-[2px] h-[10px] bg-[#6B6B6B]"></div>
          <div>
            <img src={facebook} alt="" className="" />
          </div>
          <div className="w-[2px] h-[10px] bg-[#6B6B6B]"></div>
          <div>
            <img src={x} alt="" className="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
