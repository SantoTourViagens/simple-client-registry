
import * as React from "react";
import { Input } from "./input";

interface NumericInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> {
  value: number | undefined;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  integer?: boolean;
  decimals?: number;
  readOnly?: boolean;
}

export const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  ({ value, onChange, min, max, integer = false, decimals = 2, readOnly = false, ...props }, ref) => {
    // Internal state to maintain the displayed value during typing
    const [displayValue, setDisplayValue] = React.useState<string>('');
    const inputRef = React.useRef<HTMLInputElement>(null);
    
    // Update the internal state when the external value changes
    React.useEffect(() => {
      if (value !== undefined) {
        setDisplayValue(integer ? String(value) : value.toFixed(decimals));
      } else {
        setDisplayValue('');
      }
    }, [value, integer, decimals]);
    
    // Format the input value to enforce constraints
    const formatValue = (inputValue: string): number => {
      // Remove all non-numeric characters except the first decimal point and minus sign
      let processedValue = inputValue.replace(/[^\d.-]/g, '');
      
      // Remove any extra decimal points (keep only the first one)
      const parts = processedValue.split('.');
      if (parts.length > 1) {
        processedValue = parts[0] + '.' + parts.slice(1).join('');
      }
      
      // Remove any extra minus signs (keep only the first one if at the beginning)
      if (processedValue.startsWith('-')) {
        processedValue = '-' + processedValue.substring(1).replace(/-/g, '');
      } else {
        processedValue = processedValue.replace(/-/g, '');
      }
      
      // Parse to number
      let numericValue = processedValue ? parseFloat(processedValue) : 0;
      
      // Apply integer constraint
      if (integer) {
        numericValue = Math.floor(numericValue);
      }
      
      // Apply min/max constraints
      if (min !== undefined && numericValue < min) {
        numericValue = min;
      }
      if (max !== undefined && numericValue > max) {
        numericValue = max;
      }
      
      return numericValue;
    };

    // Handle change events without losing focus
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (readOnly) return;
      
      const newValue = e.target.value;
      const selectionStart = e.target.selectionStart;
      
      // Keep the display value updated during typing
      setDisplayValue(newValue);
      
      // Only call the onChange handler if the value is a valid number or empty
      if (newValue === '' || newValue === '-' || /^-?\d*\.?\d*$/.test(newValue)) {
        const formattedValue = newValue === '' || newValue === '-' ? 0 : formatValue(newValue);
        onChange(formattedValue);
        
        // Preserve cursor position
        if (inputRef.current && selectionStart !== null) {
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.setSelectionRange(selectionStart, selectionStart);
            }
          }, 0);
        }
      }
    };

    // Handle blur events to format the value properly
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (readOnly) return;
      
      if (e.target.value) {
        const newValue = formatValue(e.target.value);
        onChange(newValue);
        setDisplayValue(integer ? String(newValue) : newValue.toFixed(decimals));
      } else {
        onChange(0);
        setDisplayValue(integer ? "0" : "0".padEnd(decimals + 2, '0'));
      }
      
      if (props.onBlur) {
        props.onBlur(e);
      }
    };

    return (
      <Input
        {...props}
        ref={(node) => {
          // Forward the ref to both our local ref and the provided ref
          inputRef.current = node as HTMLInputElement;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        type="text"
        inputMode={integer ? "numeric" : "decimal"}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        readOnly={readOnly}
        className={`${props.className || ''} ${readOnly ? 'bg-gray-100' : ''} border-black`}
      />
    );
  }
);

NumericInput.displayName = "NumericInput";
