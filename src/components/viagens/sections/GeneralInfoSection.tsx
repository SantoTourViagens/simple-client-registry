
import { useFormContext, useWatch } from "react-hook-form";
import { ViagemFormValues } from "@/components/viagens/types";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export const GeneralInfoSection = () => {
  const { control } = useFormContext<ViagemFormValues>();
  
  // Watch the datapartida field to sync with dataretorno calendar
  const dataPartida = useWatch({
    control,
    name: "datapartida",
  });
  
  // Criar data para amanhã (hoje + 1 dia) para usar como data mínima
  const tomorrow = addDays(new Date(), 1);
  
  return (
    <Card className="form-section-card">
      <CardHeader>
        <CardTitle className="text-lg">Informações Gerais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="destino"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destino</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="cidadesvisitar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidades a Visitar</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={100} />
                </FormControl>
                <FormDescription>
                  Separe as cidades com vírgula.
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="datapartida"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Partida</FormLabel>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  className="total-field"
                  locale={ptBR}
                  formatString="dd/MM/yyyy"
                  fromDate={tomorrow} // Define a data mínima como amanhã
                />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="dataretorno"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Retorno</FormLabel>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  className="total-field"
                  locale={ptBR}
                  formatString="dd/MM/yyyy"
                  defaultMonth={dataPartida} // Pass the departure date as defaultMonth
                  fromDate={dataPartida || tomorrow} // A data mínima é a data de partida ou amanhã
                />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
