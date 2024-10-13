import Header from '../login/header'
import LoginForm from '../../forms/loginForm'
import background from '../../../assets/images/ellipse.svg'
import maps from '../../../assets/images/maps.svg' // Adjust the path as necessary
import leaf from '../../../assets/images/leaf.svg' // Adjust the path as necessary
import people from '../../../assets/images/people.svg' // Adjust the path as necessary
import { Globe, Pen, Phone } from 'lucide-react'
import {} from '../../icons/icons'
import Sms from '@renderer/components/icons/sms'

const Login = () => {
  return (
    <>
      <Header />

      <div className="flex justify-between relative h-[calc(100vh-126px)]">
        <div
          className="relative w-[50%] flex flex-col items-center justify-end bg-left bg-cover"
          style={{ backgroundImage: `url("${background}")` }}
        >
          <img src={maps} alt="Maps" className="absolute left-16 top-20 opacity-20" />
          <div className="flex flex-col items-center justify-center w-80 md:w-96 text-justify text-white gap-5">
            <img src={leaf} alt="Leaf" />
            <p className="px-4 md:px-8 text-wrap w-full">
              يعمل المشروع على توفير الأدوية الضرورية للمحتاجين من أصحاب الأمـراض المزمنة لتلبية
              احتياجاتهم الطبية والتخفيف من أعبائهم.ويهدف المشروع الى تقديم الدعم والرعاية للمرضى
              وتحسين جودة حياتهم خلال فترة المرض، وتلبية احتياجــــات المرضـــى، وتقديم الدعـــم
              اللازم لهـم ولعائلاتهم في مراحل مختلفة من المرض.
            </p>
          </div>
          <img src={people} alt="People" className="object-contain w-96 mb-2" />
        </div>
        <div className="w-[50%] flex items-center flex-col justify-center ">
          <LoginForm />
          <div className=" absolute bottom-4 flex gap-3">
            <div className="flex gap-3">
              <h1 className="text-[14px] text-[#196BAE] font-normal">7733146365</h1>
              <Phone color="#196BAE" />
            </div>
            <div className="flex gap-3">
              <h1 className="text-[14px] text-[#196BAE] font-normal">INFO@HDFYE.ORG</h1>
              <Globe color="#196BAE" />
            </div>
            <div className="flex gap-3">
              <h1 className="text-[14px] text-[#196BAE] font-normal">INFO@HDFYE.ORG</h1>
              <Sms className="text-[#196BAE]" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
