
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NumericInput } from "@/components/ui/numeric-input";
import { UseFormReturn } from "react-hook-form";
import { PassageiroFormValues } from "../types";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                value={field.value as string || ""}
                className="font-roboto"
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
                value={Number(field.value) || 0}
                onChange={(value) => {
                  field.onChange(value);
                  if (onValueChange) {
                    onValueChange(Number(value) || 0);
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
