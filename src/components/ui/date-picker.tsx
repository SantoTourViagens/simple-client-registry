
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ptBR } from "date-fns/locale"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
  locale?: typeof ptBR
  formatString?: string
  defaultMonth?: Date  // Added defaultMonth prop
  placeholder?: string
  fromDate?: Date
}

export function DatePicker({ 
  date, 
  setDate, 
  className,
  locale = ptBR,
  formatString = "dd/MM/yyyy",
  defaultMonth,  // Accept defaultMonth prop
  placeholder,
  fromDate
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, formatString, { locale }) : format(new Date(), formatString, { locale })}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          locale={locale}
          defaultMonth={defaultMonth} // Pass defaultMonth to Calendar
          fromDate={fromDate}
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  )
}
