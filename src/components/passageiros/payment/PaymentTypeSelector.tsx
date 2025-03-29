
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { PassageiroFormValues } from "../types";

interface PaymentTypeSelectorProps {
  form: UseFormReturn<PassageiroFormValues>;
  onCheckboxChange: (checked: boolean) => void;
}

const PaymentTypeSelector = ({ form, onCheckboxChange }: PaymentTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <FormField
        control={form.control}
        name="pagamentoavista"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  onCheckboxChange(checked as boolean);
                }}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Pagamento à Vista</FormLabel>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default PaymentTypeSelector;
