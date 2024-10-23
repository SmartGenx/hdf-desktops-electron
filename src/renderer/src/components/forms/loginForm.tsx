import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Input } from '../../components/inputLogin'
import { useToast } from '../ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { cn } from '../../lib/utils'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../../lib/http'
import { typeRespons } from '../../types/index'
import { useSignIn } from 'react-auth-kit'
import Pen from '../icons/pen'
import Lock from '../icons/lock'
import { Eye, EyeOff } from 'lucide-react'

const formSchema = z.object({
  email: z.string().email({ message: 'ادخل البريد الالكتروني' }),
  password: z.string().min(1, { message: 'ادخل كلمة المرور' })
})
type UserFormValue = z.infer<typeof formSchema>
export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState('')
  const singIn = useSignIn()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const handleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema)
  })
  const [delayedSubmitting, _setDelayedSubmitting] = useState(form.formState.isSubmitting)
  // @ts-ignore
  const onSubmit = async (data: UserFormValue) => {
    setErrorMessage('')
    try {
      const payload = {
        email: data.email,
        password: data.password
      }
      const response = await axiosInstance.post<typeRespons>('/auth/login', payload)

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        const singInResult = singIn({
          token: response.data.token,
          expiresIn: 10080,
          tokenType: 'Beaere',
          authState: response.data
        })
        if (singInResult) {
          toast({
            title: 'مرحبا مجددا',
            description: 'تم تسجيل الدخول بنجاح',
            variant: 'success'
          })
          navigate('/')
        } else {
          setErrorMessage('حصل خطا ما، حاول تسجيل الدخول مجددا')
        }
      }
    } catch (error) {
      console.error('Error occurred:', error)
      setErrorMessage('حصل خطا ما، حاول تسجيل الدخول مجددا')
      return JSON.stringify(error)
    }
  }

  return (
    <>
      <div className="flex  justify-center px-4">
        <div className="w-full max-w-md">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={cn('w-full space-y-4', {
                'pointer-events-none opacity-50': delayedSubmitting
              })}
            >
              <div className=" flex flex-col gap-4   ">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="">
                        <Input
                          label="اسم المستخدم"
                          placeholder="ادخل البريد الالكتروني"
                          type="email"
                          {...field}
                          disabled={delayedSubmitting}
                          className="pl-10 text-right h-[44px] w-[333px] bg-primary/5"
                          icon={<Pen size={20} />}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative !w-[333px] text-right">
                          <Input
                            martial
                            label="كلمة المرور"
                            placeholder="كلمة المرور"
                            type={showPassword ? 'text' : 'password'}
                            {...field}
                            disabled={delayedSubmitting}
                            className="bg-primary/5"
                            InputClassName="!h-12 "
                            icon={<Lock size={20} />}
                          />
                          <button
                            type="button"
                            onClick={() => handleShowPassword()}
                            className="absolute left-3 top-1/2 -translate-y-1/2 transform cursor-pointer p-2 text-lg"
                          >
                            {showPassword ? (
                              <EyeOff size={23} color="#434749" />
                            ) : (
                              <Eye size={23} color="#434749" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                className="!mt-4 !h-12 w-full bg-[#196BAE] text-sm hover:bg-[#D4D5D5] hover:text-[#8D8D8D]"
                type="submit"
                // isLoading={delayedSubmitting}
                disabled={delayedSubmitting}
              >
                تسجيل الدخول
              </Button>
              {errorMessage && (
                <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>
              )}
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
