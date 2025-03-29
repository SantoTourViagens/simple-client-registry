
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PassageiroFormValues } from "./types";
import { Switch } from "@/components/ui/switch";
import DateValuePairField from "./payment/DateValuePairField";
import { UseFormReturn } from "react-hook-form";
import { formatCurrency } from "@/utils/masks";
import { useEffect } from "react";
import { usePaymentCalculations } from "@/hooks/passageiros/usePaymentCalculations";

interface PassageiroPaymentSectionProps {
  form: UseFormReturn<PassageiroFormValues>;
  handlePagamentoAVistaChange: (value: boolean) => void;
}

const PassageiroPaymentSection = ({
  form,
  handlePagamentoAVistaChange,
}: PassageiroPaymentSectionProps) => {
  const pagamentoAVista = form.watch("pagamentoavista");
  const valorViagem = form.watch("valorviagem");
  const valorSinal = form.watch("valorsinal") || 0;
  const valorParcela2 = form.watch("valorparcela2") || 0;
  const valorParcela3 = form.watch("valorparcela3") || 0;
  const valorParcela4 = form.watch("valorparcela4") || 0;
  const valorParcela5 = form.watch("valorparcela5") || 0;
  const valorParcela6 = form.watch("valorparcela6") || 0;
  const valorParcela7 = form.watch("valorparcela7") || 0;
  const valorParcela8 = form.watch("valorparcela8") || 0;
  const valorParcela9 = form.watch("valorparcela9") || 0;
  const valorParcela10 = form.watch("valorparcela10") || 0;
  const valorParcela11 = form.watch("valorparcela11") || 0;
  const valorParcela12 = form.watch("valorparcela12") || 0;
  
  const { recalculateValorFaltaReceber } = usePaymentCalculations();
  
  // Update valorfaltareceber whenever any payment value changes
  useEffect(() => {
    if (pagamentoAVista) {
      form.setValue("valorfaltareceber", 0);
    } else {
      const valorFaltaReceber = recalculateValorFaltaReceber(
        valorViagem, valorSinal, valorParcela2, valorParcela3, valorParcela4,
        valorParcela5, valorParcela6, valorParcela7, valorParcela8, valorParcela9,
        valorParcela10, valorParcela11, valorParcela12
      );
      form.setValue("valorfaltareceber", valorFaltaReceber > 0 ? valorFaltaReceber : 0);
    }
  }, [
    pagamentoAVista, valorViagem, valorSinal, valorParcela2, valorParcela3, valorParcela4,
    valorParcela5, valorParcela6, valorParcela7, valorParcela8, valorParcela9,
    valorParcela10, valorParcela11, valorParcela12, form
  ]);

  // Function to handle changes in any payment field
  const handlePaymentValueChange = (fieldName: string, value: number) => {
    form.setValue(fieldName as any, value);
    
    if (!pagamentoAVista) {
      const valorFaltaReceber = recalculateValorFaltaReceber(
        valorViagem, valorSinal, valorParcela2, valorParcela3, valorParcela4,
        valorParcela5, valorParcela6, valorParcela7, valorParcela8, valorParcela9,
        valorParcela10, valorParcela11, valorParcela12
      );
      form.setValue("valorfaltareceber", valorFaltaReceber > 0 ? valorFaltaReceber : 0);
    }
  };

  return (
    <Card className="form-section-card">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Valor da Viagem */}
          <FormField
            control={form.control}
            name="valorviagem"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-inter font-medium">Valor da Viagem</FormLabel>
                <div className="h-10 flex items-center px-3 rounded-md border bg-gray-50 font-bold total-field">
                  {formatCurrency(field.value || 0)}
                </div>
              </FormItem>
            )}
          />

          {/* Pagamento à Vista */}
          <FormField
            control={form.control}
            name="pagamentoavista"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Pagamento à Vista</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(value) => {
                      field.onChange(value);
                      handlePagamentoAVistaChange(value);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {pagamentoAVista ? (
            <>
              <FormField
                control={form.control}
                name="datapagamentoavista"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-inter font-medium">Data Pagamento</FormLabel>
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
                        <SelectTrigger className="font-roboto">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                        <SelectItem value="Pix">Pix</SelectItem>
                        <SelectItem value="Débito">Débito</SelectItem>
                        <SelectItem value="Crédito">Crédito</SelectItem>
                        <SelectItem value="Transferência">Transferência</SelectItem>
                        <SelectItem value="Cheque">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <>
              <DateValuePairField
                form={form}
                dateFieldName="datasinal"
                valueFieldName="valorsinal"
                dateLabel="Data do Sinal"
                valueLabel="Valor do Sinal R$"
                onValueChange={(value) => handlePaymentValueChange("valorsinal", value)}
              />

              <div className="space-y-2">
                <FormLabel className="font-inter font-medium">Valor Falta Receber R$</FormLabel>
                <div className="h-10 flex items-center px-3 rounded-md border bg-gray-100 font-bold total-field">
                  {formatCurrency(form.watch("valorfaltareceber") || 0)}
                </div>
              </div>
            </>
          )}
        </div>

        {!pagamentoAVista && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <DateValuePairField
                form={form}
                dateFieldName="dataparcela2"
                valueFieldName="valorparcela2"
                dateLabel="Data Parcela 2"
                valueLabel="Valor Parcela 2 R$"
                onValueChange={(value) => handlePaymentValueChange("valorparcela2", value)}
              />

              <DateValuePairField
                form={form}
                dateFieldName="dataparcela3"
                valueFieldName="valorparcela3"
                dateLabel="Data Parcela 3"
                valueLabel="Valor Parcela 3 R$"
                onValueChange={(value) => handlePaymentValueChange("valorparcela3", value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <DateValuePairField
                form={form}
                dateFieldName="dataparcela4"
                valueFieldName="valorparcela4"
                dateLabel="Data Parcela 4"
                valueLabel="Valor Parcela 4 R$"
                onValueChange={(value) => handlePaymentValueChange("valorparcela4", value)}
              />

              <DateValuePairField
                form={form}
                dateFieldName="dataparcela5"
                valueFieldName="valorparcela5"
                dateLabel="Data Parcela 5"
                valueLabel="Valor Parcela 5 R$"
                onValueChange={(value) => handlePaymentValueChange("valorparcela5", value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <DateValuePairField
                form={form}
                dateFieldName="dataparcela6"
                valueFieldName="valorparcela6"
                dateLabel="Data Parcela 6"
                valueLabel="Valor Parcela 6 R$"
                onValueChange={(value) => handlePaymentValueChange("valorparcela6", value)}
              />

              <DateValuePairField
                form={form}
                dateFieldName="dataparcela7"
                valueFieldName="valorparcela7"
                dateLabel="Data Parcela 7"
                valueLabel="Valor Parcela 7 R$"
                onValueChange={(value) => handlePaymentValueChange("valorparcela7", value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <DateValuePairField
                form={form}
                dateFieldName="dataparcela8"
                valueFieldName="valorparcela8"
                dateLabel="Data Parcela 8"
                valueLabel="Valor Parcela 8 R$"
                onValueChange={(value) => handlePaymentValueChange("valorparcela8", value)}
              />

              <DateValuePairField
                form={form}
                dateFieldName="dataparcela9"
                valueFieldName="valorparcela9"
                dateLabel="Data Parcela 9"
                valueLabel="Valor Parcela 9 R$"
                onValueChange={(value) => handlePaymentValueChange("valorparcela9", value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <DateValuePairField
                form={form}
                dateFieldName="dataparcela10"
                valueFieldName="valorparcela10"
                dateLabel="Data Parcela 10"
                valueLabel="Valor Parcela 10 R$"
                onValueChange={(value) => handlePaymentValueChange("valorparcela10", value)}
              />

              <DateValuePairField
                form={form}
                dateFieldName="dataparcela11"
                valueFieldName="valorparcela11"
                dateLabel="Data Parcela 11"
                valueLabel="Valor Parcela 11 R$"
                onValueChange={(value) => handlePaymentValueChange("valorparcela11", value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <DateValuePairField
                form={form}
                dateFieldName="dataparcela12"
                valueFieldName="valorparcela12"
                dateLabel="Data Parcela 12"
                valueLabel="Valor Parcela 12 R$"
                onValueChange={(value) => handlePaymentValueChange("valorparcela12", value)}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PassageiroPaymentSection;
