import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { PassageiroFormValues } from "../types";

interface PaymentTypeSelectorProps {
  form: UseFormReturn<PassageiroFormValues>;
  onCheckboxChange: (checked: boolean) => void;
}

const PaymentTypeSelector = ({ form, onCheckboxChange }: PaymentTypeSelectorProps) => {
  return null;
};

export default PaymentTypeSelector;
