import React from 'react'
import { Checkbox } from './ui/checkbox' // Adjust the import to your Checkbox component
type prop={
  label:string
}
const CheckboxWithLabel = ({ label, ...props }: prop) => {
  return (
    <label className="flex items-center space-x-2 rtl:space-x-reverse">
      <Checkbox {...props} />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  )
}

export default CheckboxWithLabel
