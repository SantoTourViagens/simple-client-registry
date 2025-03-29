import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

// Better type definition for DateInput
export type DateInput = Date | string | null | undefined;

// Create a new interface that doesn't extend HTMLInputElement props
interface DatePickerInputProps {
  value: DateInput;
  onChange: (date: DateInput) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePickerInput({
  className,
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  disabled = false,
  ...props
}: DatePickerInputProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    value instanceof Date ? value : value && typeof value === 'string' ? new Date(value) : undefined
  );
  const [open, setOpen] = React.useState(false);

  // Helper function to safely handle string inputs
  const safelyHandleStringInput = (str: string | undefined): string => {
    if (!str) return "";
    return str;
  };

  const formatDateString = (input: string): string => {
    // Only apply formatting if the input has content
    if (!input) return "";
    
    // Make sure we're working with a string
    const inputStr = safelyHandleStringInput(input);
    
    // Remove non-numeric characters
    let digits = inputStr.replace(/\D/g, '');
    
    // Format as DD/MM/YYYY
    if (digits.length > 0) {
      // Add day slash
      if (digits.length > 2) {
        digits = digits.slice(0, 2) + '/' + digits.slice(2);
      }
      
      // Add month slash
      if (digits.length > 5) {
        digits = digits.slice(0, 5) + '/' + digits.slice(5);
      }
      
      // Limit to 10 characters (DD/MM/YYYY)
      if (digits.length > 10) {
        digits = digits.slice(0, 10);
      }
    }
    
    return digits;
  };

  // Handle input change (manual typing)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDateString(e.target.value);
    e.target.value = formatted;
    
    // Only try to parse a date if we have a complete formatted string
    if (formatted.length === 10) {
      const [day, month, year] = formatted.split('/').map(Number);
      
      // Check if it's a valid date
      if (day > 0 && day <= 31 && month > 0 && month <= 12 && year > 0) {
        const newDate = new Date(year, month - 1, day);
        setDate(newDate);
        onChange(newDate);
      }
    } else {
      // Keep the string value if incomplete
      onChange(formatted);
    }
  };

  // Handle calendar selection
  const handleCalendarSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    setOpen(false);
    onChange(newDate || null);
  };

  // Format the display value
  const displayValue = React.useMemo(() => {
    if (!value) return "";
    
    if (value instanceof Date) {
      return format(value, "dd/MM/yyyy");
    }
    
    if (typeof value === 'string') {
      // Check if it's an ISO string
      if (value.includes('T') || value.includes('-')) {
        try {
          return format(new Date(value), "dd/MM/yyyy");
        } catch (e) {
          return value;
        }
      }
      return value;
    }
    
    return "";
  }, [value]);

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleInputChange}
        className={cn("pr-10", className)}
        disabled={disabled}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setOpen(true)}
            type="button"
            disabled={disabled}
          >
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleCalendarSelect}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
