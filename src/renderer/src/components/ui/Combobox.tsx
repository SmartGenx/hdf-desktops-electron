import { Check, ChevronsUpDown } from 'lucide-react'
import React from 'react'
import { cn } from '../../lib/utils'
import { Button } from './button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
// Reusable Combobox Component with Custom Option Keys
interface Option {
  [key: string]: any
}
interface ComboboxProps {
  options: Option[]
  displayKey: string
  valueKey: string
  placeholder?: string
  emptyMessage?: string
  selectedValue?: Option | null
  onSelect?: (option: Option | null) => void
  localize?: object
}
export function Combobox({
  options,
  displayKey, // Key for the label
  valueKey, // Key for the value
  placeholder = 'Select an option...',
  emptyMessage = 'No options found.',
  selectedValue = null,
  onSelect,
  localize
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<Option | null>(selectedValue)
  const handleSelect = (currentValue: string) => {
    const selectedOption = options.find((option) => option[valueKey] === currentValue) || null
    setValue(selectedOption)
    setOpen(false)
    if (onSelect) onSelect(selectedOption)
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? (localize ? localize[value[displayKey]] : value[displayKey]) : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`أبحث...`} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option[valueKey]}
                  value={option[displayKey]}
                  onSelect={() => handleSelect(option[valueKey])}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value?.[valueKey] === option[valueKey] ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {localize ? localize[option[displayKey]] : option[displayKey]}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}