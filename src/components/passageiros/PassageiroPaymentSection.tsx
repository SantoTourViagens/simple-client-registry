
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PassageiroFormValues } from "./types";
import { Switch } from "@/components/ui/switch";
import DateValuePairField from "./payment/DateValuePairField";
import { UseFormReturn } from "react-hook-form";

interface PassageiroPaymentSectionProps {
  form: UseFormReturn<PassageiroFormValues>;
  handlePagamentoAVistaChange: (value: boolean) => void;
}

const PassageiroPaymentSection = ({
  form,
  handlePagamentoAVistaChange,
}: PassageiroPaymentSectionProps) => {
  const pagamentoAVista = form.watch("pagamentoavista");

  return (
    <Card className="form-section-card">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              />

              <div className="space-y-2">
                <FormLabel className="font-inter font-medium">Valor Falta Receber R$</FormLabel>
                <div className="h-10 flex items-center px-3 rounded-md border bg-gray-100 font-bold total-field">
                  {(form.watch("valorfaltareceber") || 0).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
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
              />

              <DateValuePairField
                form={form}
                dateFieldName="dataparcela3"
                valueFieldName="valorparcela3"
                dateLabel="Data Parcela 3"
                valueLabel="Valor Parcela 3 R$"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <DateValuePairField
                form={form}
                dateFieldName="dataparcela4"
                valueFieldName="valorparcela4"
                dateLabel="Data Parcela 4"
                valueLabel="Valor Parcela 4 R$"
              />

              <DateValuePairField
                form={form}
                dateFieldName="dataparcela5"
                valueFieldName="valorparcela5"
                dateLabel="Data Parcela 5"
                valueLabel="Valor Parcela 5 R$"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <DateValuePairField
                form={form}
                dateFieldName="dataparcela6"
                valueFieldName="valorparcela6"
                dateLabel="Data Parcela 6"
                valueLabel="Valor Parcela 6 R$"
              />

              <DateValuePairField
                form={form}
                dateFieldName="dataparcela7"
                valueFieldName="valorparcela7"
                dateLabel="Data Parcela 7"
                valueLabel="Valor Parcela 7 R$"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <DateValuePairField
                form={form}
                dateFieldName="dataparcela8"
                valueFieldName="valorparcela8"
                dateLabel="Data Parcela 8"
                valueLabel="Valor Parcela 8 R$"
              />

              <DateValuePairField
                form={form}
                dateFieldName="dataparcela9"
                valueFieldName="valorparcela9"
                dateLabel="Data Parcela 9"
                valueLabel="Valor Parcela 9 R$"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <DateValuePairField
                form={form}
                dateFieldName="dataparcela10"
                valueFieldName="valorparcela10"
                dateLabel="Data Parcela 10"
                valueLabel="Valor Parcela 10 R$"
              />

              <DateValuePairField
                form={form}
                dateFieldName="dataparcela11"
                valueFieldName="valorparcela11"
                dateLabel="Data Parcela 11"
                valueLabel="Valor Parcela 11 R$"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <DateValuePairField
                form={form}
                dateFieldName="dataparcela12"
                valueFieldName="valorparcela12"
                dateLabel="Data Parcela 12"
                valueLabel="Valor Parcela 12 R$"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PassageiroPaymentSection;
