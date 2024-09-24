import { cn } from '@renderer/lib/utils'

import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  type?: string
  martial?: boolean
  label?: string | React.ReactElement
  InputClassName?: string
  icon?: React.ReactElement
}

const FormInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ InputClassName, className, type, martial = true, label, icon, ...props }, ref) => {
    const isInvalid = props['aria-invalid']

    // Ensure that the placeholder is only assigned a string value
    const placeholder = typeof label === 'string' ? label : undefined

    if (martial)
      return (
        <div className="group relative max-w-full text-right text-on-surface-variant">
          <input
            {...props}
            type={type}
            ref={ref}
            className={cn(
              'peer h-[44px] w-full rounded-[5px] border-[1px] border-[#e2e8f0] px-3 py-3 outline-none ',
              isInvalid ? 'border-red-500' : 'border-[#e2e8f0]',
              InputClassName
            )}
            placeholder={placeholder}
          />
        </div>
      )

    return (
      <input
        type={type}
        className={cn(
          'flex h-14 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
          isInvalid ? 'border-red-500' : 'border-gray-300',
          className
        )}
        ref={ref}
        placeholder={placeholder}
        {...props}
      />
    )
  }
)

FormInput.displayName = 'Input'

export { FormInput }
