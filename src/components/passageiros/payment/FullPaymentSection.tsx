
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { PassageiroFormValues } from "../types";

interface FullPaymentSectionProps {
  form: UseFormReturn<PassageiroFormValues>;
}

const FullPaymentSection = ({ form }: FullPaymentSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="datapagamentoavista"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-inter font-medium">Data do Pagamento</FormLabel>
            <FormControl>
              <Input
                type="date"
                {...field}
                className="font-roboto"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="formapagamentoavista"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-inter font-medium">Forma de Pagamento</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a forma de pagamento" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                <SelectItem value="Crédito">Crédito</SelectItem>
                <SelectItem value="Débito">Débito</SelectItem>
                <SelectItem value="PIX">PIX</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FullPaymentSection;
