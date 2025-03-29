
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { NumericInput } from "@/components/ui/numeric-input";
import { UseFormReturn } from "react-hook-form";
import { PassageiroFormValues } from "../types";
import DateValuePairField from "./DateValuePairField";
import { usePaymentCalculations } from "@/hooks/passageiros/usePaymentCalculations";

interface InstallmentPaymentSectionProps {
  form: UseFormReturn<PassageiroFormValues>;
}

const InstallmentPaymentSection = ({ form }: InstallmentPaymentSectionProps) => {
  const { recalculateValorFaltaReceber } = usePaymentCalculations();

  const updateRemainingValue = (changedFieldName: string, changedValue: number) => {
    const valorViagem = form.getValues("valorviagem") || 0;
    const valorSinal = form.getValues("valorsinal") || 0;
    const valorParcela2 = form.getValues("valorparcela2") || 0;
    const valorParcela3 = form.getValues("valorparcela3") || 0;
    const valorParcela4 = form.getValues("valorparcela4") || 0;
    const valorParcela5 = form.getValues("valorparcela5") || 0;
    const valorParcela6 = form.getValues("valorparcela6") || 0;
    const valorParcela7 = form.getValues("valorparcela7") || 0;
    const valorParcela8 = form.getValues("valorparcela8") || 0;
    const valorParcela9 = form.getValues("valorparcela9") || 0;
    const valorParcela10 = form.getValues("valorparcela10") || 0;
    const valorParcela11 = form.getValues("valorparcela11") || 0;
    const valorParcela12 = form.getValues("valorparcela12") || 0;
    
    const valorfaltareceber = recalculateValorFaltaReceber(
      valorViagem, valorSinal, valorParcela2, valorParcela3, valorParcela4,
      valorParcela5, valorParcela6, valorParcela7, valorParcela8, valorParcela9,
      valorParcela10, valorParcela11, valorParcela12
    );
    
    form.setValue("valorfaltareceber", valorfaltareceber > 0 ? valorfaltareceber : 0);
  };

  return (
    <div className="space-y-6">
      <DateValuePairField
        form={form}
        dateFieldName="datasinal"
        valueFieldName="valorsinal"
        dateLabel="Data do Sinal"
        valueLabel="Valor do Sinal"
        onValueChange={(value) => updateRemainingValue("valorsinal", value)}
      />
      
      <DateValuePairField
        form={form}
        dateFieldName="dataparcela2"
        valueFieldName="valorparcela2"
        dateLabel="Data da Parcela 2"
        valueLabel="Valor da Parcela 2"
        onValueChange={(value) => updateRemainingValue("valorparcela2", value)}
      />
      
      <DateValuePairField
        form={form}
        dateFieldName="dataparcela3"
        valueFieldName="valorparcela3"
        dateLabel="Data da Parcela 3"
        valueLabel="Valor da Parcela 3"
        onValueChange={(value) => updateRemainingValue("valorparcela3", value)}
      />
      
      <DateValuePairField
        form={form}
        dateFieldName="dataparcela4"
        valueFieldName="valorparcela4"
        dateLabel="Data da Parcela 4"
        valueLabel="Valor da Parcela 4"
        onValueChange={(value) => updateRemainingValue("valorparcela4", value)}
      />
      
      <DateValuePairField
        form={form}
        dateFieldName="dataparcela5"
        valueFieldName="valorparcela5"
        dateLabel="Data da Parcela 5"
        valueLabel="Valor da Parcela 5"
        onValueChange={(value) => updateRemainingValue("valorparcela5", value)}
      />
      
      <DateValuePairField
        form={form}
        dateFieldName="dataparcela6"
        valueFieldName="valorparcela6"
        dateLabel="Data da Parcela 6"
        valueLabel="Valor da Parcela 6"
        onValueChange={(value) => updateRemainingValue("valorparcela6", value)}
      />
      
      <DateValuePairField
        form={form}
        dateFieldName="dataparcela7"
        valueFieldName="valorparcela7"
        dateLabel="Data da Parcela 7"
        valueLabel="Valor da Parcela 7"
        onValueChange={(value) => updateRemainingValue("valorparcela7", value)}
      />
      
      <DateValuePairField
        form={form}
        dateFieldName="dataparcela8"
        valueFieldName="valorparcela8"
        dateLabel="Data da Parcela 8"
        valueLabel="Valor da Parcela 8"
        onValueChange={(value) => updateRemainingValue("valorparcela8", value)}
      />
      
      <DateValuePairField
        form={form}
        dateFieldName="dataparcela9"
        valueFieldName="valorparcela9"
        dateLabel="Data da Parcela 9"
        valueLabel="Valor da Parcela 9"
        onValueChange={(value) => updateRemainingValue("valorparcela9", value)}
      />
      
      <DateValuePairField
        form={form}
        dateFieldName="dataparcela10"
        valueFieldName="valorparcela10"
        dateLabel="Data da Parcela 10"
        valueLabel="Valor da Parcela 10"
        onValueChange={(value) => updateRemainingValue("valorparcela10", value)}
      />
      
      <DateValuePairField
        form={form}
        dateFieldName="dataparcela11"
        valueFieldName="valorparcela11"
        dateLabel="Data da Parcela 11"
        valueLabel="Valor da Parcela 11"
        onValueChange={(value) => updateRemainingValue("valorparcela11", value)}
      />
      
      <DateValuePairField
        form={form}
        dateFieldName="dataparcela12"
        valueFieldName="valorparcela12"
        dateLabel="Data da Parcela 12"
        valueLabel="Valor da Parcela 12"
        onValueChange={(value) => updateRemainingValue("valorparcela12", value)}
      />

      <FormField
        control={form.control}
        name="valorfaltareceber"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-inter font-medium">Valor Falta Receber</FormLabel>
            <FormControl>
              <NumericInput
                value={field.value}
                onChange={(value) => field.onChange(value)}
                className="font-roboto bg-gray-100"
                disabled
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default InstallmentPaymentSection;
