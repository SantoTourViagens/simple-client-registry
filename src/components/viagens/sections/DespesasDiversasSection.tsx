
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { CalculatedValues, ViagemFormValues } from "../types";

interface DespesasDiversasSectionProps {
  calculatedValues: CalculatedValues;
}

export const DespesasDiversasSection = ({ calculatedValues }: DespesasDiversasSectionProps) => {
  const { control } = useFormContext<ViagemFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Outras Despesas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            control={control}
            name="despesasdiversas"
            render={({ field }) => (
              <FormItem className="md:col-span-1">
                <FormLabel>Valor Total Outras Despesas R$</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={field.value || 0}
                    onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="observacaodespesasdiversas"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel>Observação Outras Despesas</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={100} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
