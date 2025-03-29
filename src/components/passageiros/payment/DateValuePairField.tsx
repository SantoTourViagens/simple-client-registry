
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PassageiroFormValues } from "../types";
import { NumericInput } from "@/components/ui/numeric-input";

interface DateValuePairFieldProps {
  form: UseFormReturn<PassageiroFormValues>;
  dateFieldName: keyof PassageiroFormValues;
  valueFieldName: keyof PassageiroFormValues;
  dateLabel: string;
  valueLabel: string;
  onValueChange?: (value: number) => void;
}

const DateValuePairField = ({
  form,
  dateFieldName,
  valueFieldName,
  dateLabel,
  valueLabel,
  onValueChange
}: DateValuePairFieldProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name={dateFieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-inter font-medium">{dateLabel}</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                {...field} 
                className="font-roboto"
                value={field.value as string || ''} // Cast to string and provide fallback
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={valueFieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-inter font-medium">{valueLabel}</FormLabel>
            <FormControl>
              <NumericInput
                value={typeof field.value === 'number' ? field.value : 0} // Ensure value is a number
                onChange={(value) => {
                  field.onChange(value);
                  if (onValueChange) {
                    onValueChange(value);
                  }
                }}
                className="font-roboto"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DateValuePairField;
