
import * as React from "react"
import { cn } from "@/lib/utils"
import { formatCurrency, parseCurrency } from "@/utils/masks"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isCurrency?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isCurrency, onKeyDown, onChange, ...props }, ref) => {
    // State to track the raw numeric value for currency inputs
    const [rawValue, setRawValue] = React.useState<number | undefined>(
      isCurrency && props.value !== undefined && props.value !== null ? 
        typeof props.value === 'number' ? 
          props.value : 
          parseCurrency(String(props.value)) 
        : undefined
    );
    
    // Internal text state to maintain the display during typing
    const [inputText, setInputText] = React.useState<string>(
      isCurrency && rawValue !== undefined ? 
        formatCurrency(rawValue).replace('R$', '').trim() : 
        props.value?.toString() || ''
    );

    // Handle currency input without losing focus
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isCurrency) {
        // Store the current selection position
        const selectionStart = e.target.selectionStart;
        
        // Update internal text state
        const newInputText = e.target.value;
        setInputText(newInputText);
        
        // For currency inputs, handle the masking and parsing
        try {
          // Remove all non-numeric characters except for commas and periods
          const sanitizedValue = newInputText.replace(/[^\d,.]/g, '');
          
          // Standardize decimal separator to period for parsing
          let processedValue = sanitizedValue.replace(/,/g, '.');
          
          // Handle multiple decimal points (keep only the first one)
          const parts = processedValue.split('.');
          if (parts.length > 1) {
            processedValue = parts[0] + '.' + parts.slice(1).join('');
          }
          
          // Parse the numeric value for the form
          const numericValue = processedValue ? parseFloat(processedValue) : 0;
          setRawValue(numericValue);
          
          // Create a new synthetic event with the numeric value
          if (onChange) {
            const newEvent = {
              ...e,
              target: {
                ...e.target,
                value: numericValue.toString()
              }
            } as React.ChangeEvent<HTMLInputElement>;
            
            onChange(newEvent);
          }
          
          // Restore cursor position accounting for any added/removed characters
          setTimeout(() => {
            if (e.target) {
              const newPosition = selectionStart !== null ? selectionStart : newInputText.length;
              e.target.setSelectionRange(newPosition, newPosition);
            }
          }, 0);
        } catch (error) {
          // Handle parsing errors
          console.error("Error parsing currency value:", error);
          setRawValue(0);
          if (onChange) {
            const newEvent = {
              ...e,
              target: {
                ...e.target,
                value: "0"
              }
            } as React.ChangeEvent<HTMLInputElement>;
            
            onChange(newEvent);
          }
        }
      } else if (onChange) {
        // For non-currency inputs, just pass through
        onChange(e);
      }
    };

    // Format on blur
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (isCurrency && rawValue !== undefined) {
        // Format the display value on blur
        setInputText(formatCurrency(rawValue).replace('R$', '').trim());
      }
      
      if (props.onBlur) {
        props.onBlur(e);
      }
    };

    // Handle Enter key to move to next field
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Find the next focusable element
        const focusableElements = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])';
        const form = e.currentTarget.form;
        if (form) {
          const formElements = Array.from(form.querySelectorAll(focusableElements)) as HTMLElement[];
          const currentIndex = formElements.indexOf(e.currentTarget);
          if (currentIndex > -1 && currentIndex < formElements.length - 1) {
            const nextElement = formElements[currentIndex + 1];
            nextElement.focus();
          }
        }
      }
      
      // Call the original onKeyDown handler if provided
      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    // Update the raw value when props.value changes externally
    React.useEffect(() => {
      if (isCurrency && props.value !== undefined && props.value !== null) {
        const newValue = typeof props.value === 'number' ? 
          props.value : 
          parseCurrency(String(props.value));
          
        if (newValue !== rawValue) {
          setRawValue(newValue);
          setInputText(formatCurrency(newValue).replace('R$', '').trim());
        }
      } else if (!isCurrency && props.value !== undefined && props.value !== null) {
        setInputText(props.value.toString());
      } else if (props.value === null || props.value === undefined) {
        // Handle null or undefined values
        setInputText('');
        if (isCurrency) {
          setRawValue(0);
        }
      }
    }, [isCurrency, props.value, rawValue]);

    // Safely determine the value to display
    const displayValue = isCurrency ? inputText : (props.value === null || props.value === undefined ? '' : props.value);

    return (
      <input
        {...props}
        ref={ref}
        type={isCurrency ? "text" : type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:text-input-foreground border-black",
          className
        )}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        value={displayValue}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
