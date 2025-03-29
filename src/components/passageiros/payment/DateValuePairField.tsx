
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PassageiroFormValues } from "../types";
import { NumericInput } from "@/components/ui/numeric-input";
import { formatCurrency, unmask } from "@/utils/masks";

interface DateValuePairFieldProps {
  form: UseFormReturn<PassageiroFormValues>;
  dateFieldName: string;
  valueFieldName: string;
  dateLabel: string;
  valueLabel: string;
  onValueChange: (value: number) => void;
}

const DateValuePairField = ({
  form,
  dateFieldName,
  valueFieldName,
  dateLabel,
  valueLabel,
  onValueChange,
}: DateValuePairFieldProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name={dateFieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dateLabel}</FormLabel>
            <FormControl>
              <Input
                type="date"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={valueFieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{valueLabel}</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                min="0"
                step="0.01"
                value={field.value || 0}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  field.onChange(value);
                  onValueChange(value);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default DateValuePairField;
