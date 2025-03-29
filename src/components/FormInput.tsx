
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency, parseCurrency } from "@/utils/masks";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isCurrency?: boolean;
}

const FormInput = ({ 
  label, 
  className, 
  error, 
  required, 
  type = "text",
  isCurrency = false, 
  ...props 
}: FormInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value);
  const [currencyValue, setCurrencyValue] = useState<string>(
    isCurrency && props.value ? formatCurrency(Number(props.value)) : ""
  );
  
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-numeric characters except comma
    let value = e.target.value.replace(/[^\d,]/g, '');
    
    // Ensure only one comma is present
    const commaCount = (value.match(/,/g) || []).length;
    if (commaCount > 1) {
      const firstCommaIndex = value.indexOf(',');
      value = value.substring(0, firstCommaIndex + 1) + 
              value.substring(firstCommaIndex + 1).replace(/,/g, '');
    }
    
    // Convert comma to dot for parsing
    const numericValue = value.replace(/,/g, '.');
    const parsedValue = numericValue ? parseFloat(numericValue) : 0;
    
    // Update internal state
    setCurrencyValue(value);
    
    // Create synthetic event
    const newEvent = {
      ...e,
      target: {
        ...e.target,
        value: parsedValue.toString()
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    // Call original onChange
    if (props.onChange) {
      props.onChange(newEvent);
    }
    
    setHasValue(!!value);
  };
  
  return (
    <div className="mb-5 last:mb-0">
      <div className="relative">
        <input
          type={isCurrency ? "text" : type}
          className={cn(
            "peer block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-foreground placeholder-transparent focus:border-primary focus:outline-none focus:ring-0",
            hasValue || isFocused ? "border-primary" : "",
            error ? "border-red-500" : "",
            className
          )}
          placeholder={label}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            setHasValue(!!e.target.value);
            
            // Format currency value on blur
            if (isCurrency && e.target.value) {
              const numValue = parseFloat(e.target.value);
              setCurrencyValue(formatCurrency(numValue).replace('R$', '').trim());
            }
          }}
          onChange={isCurrency ? handleCurrencyChange : (e) => {
            setHasValue(!!e.target.value);
            if (props.onChange) props.onChange(e);
          }}
          value={isCurrency ? currencyValue : props.value}
          required={required}
          {...props}
        />
        <label
          className={cn(
            "absolute left-0 top-3 origin-left transform text-gray-500 duration-200 ease-out",
            hasValue || isFocused 
              ? "-translate-y-6 scale-75 text-primary" 
              : "",
            error 
              ? "text-red-500" 
              : "",
            isFocused 
              ? "text-primary" 
              : ""
          )}
        >
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      {error && <p className="mt-1 text-xs text-red-500 animate-fade-in">{error}</p>}
    </div>
  );
};

export default FormInput;
