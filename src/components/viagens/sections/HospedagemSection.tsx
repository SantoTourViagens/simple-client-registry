
import { useFormContext } from "react-hook-form";
import { ViagemFormValues } from "@/components/viagens/types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Portal } from "@radix-ui/react-portal";
import { formatCurrency } from "@/utils/masks";

// Adicionar a função maskPhone
const maskPhone = (value: string | undefined): string => {
  if (!value) return '';
  
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara de telefone
  if (numbers.length <= 10) {
    // Formato (XX) XXXX-XXXX para telefones com 10 ou menos dígitos
    return numbers.replace(/(\d{2})(\d{0,4})(\d{0,4})/, (_, p1, p2, p3) => {
      let result = '';
      if (p1) result += `(${p1}`;
      if (p2) result += `) ${p2}`;
      if (p3) result += `-${p3}`;
      return result;
    });
  } else {
    // Formato (XX) XXXXX-XXXX para telefones com 11 dígitos (celular)
    return numbers.replace(/(\d{2})(\d{0,5})(\d{0,4})/, (_, p1, p2, p3) => {
      let result = '';
      if (p1) result += `(${p1}`;
      if (p2) result += `) ${p2}`;
      if (p3) result += `-${p3}`;
      return result;
    });
  }
};

interface HospedagemSectionProps {
  calculatedValues?: {
    qtdediarias?: number;
    totaldiarias?: number;
    totaldespesashospedagem?: number;
  };
}

export const HospedagemSection = ({ calculatedValues }: HospedagemSectionProps) => {
  const defaultValues = {
    qtdediarias: 0,
    totaldiarias: 0,
    totaldespesashospedagem: 0
  };

  const values = { ...defaultValues, ...calculatedValues };
  const { control } = useFormContext<ViagemFormValues>();

  return (
    <Card className="form-section-card">
      <CardHeader>
        <CardTitle className="text-lg">Hospedagem</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="nomehospedagem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Hospedagem</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    maxLength={50}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="contatohospedagem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Contato</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    maxLength={50}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="telefonehospedagem"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-inter font-medium">Telefone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(00) 00000-0000"
                    value={maskPhone(field.value)}
                    onChange={(e) => field.onChange(e.target.value)}
                    maxLength={15}
                    className="font-roboto"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          <FormField
            control={control}
            name="tipohospedagem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo Hospedagem</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || undefined}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="total-field">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <Portal>
                    <SelectContent>
                      <SelectItem value="Pousada">Pousada</SelectItem>
                      <SelectItem value="Hostel">Hostel</SelectItem>
                      <SelectItem value="Hotel">Hotel</SelectItem>
                      <SelectItem value="Chácara">Chácara</SelectItem>
                      <SelectItem value="Casa">Casa</SelectItem>
                    </SelectContent>
                  </Portal>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="regimehospedagem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Regime Hospedagem</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || undefined}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="total-field">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <Portal>
                    <SelectContent>
                      <SelectItem value="Pernoite">Pernoite</SelectItem>
                      <SelectItem value="Café da Manhã">Café da Manhã</SelectItem>
                      <SelectItem value="Meia Pensão">Meia Pensão (só almoço)</SelectItem>
                      <SelectItem value="Pensão Completa">Pensão Completa (almoço e janta)</SelectItem>
                    </SelectContent>
                  </Portal>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
            <FormLabel>Qtde Diárias</FormLabel>
            <div className="h-10 flex items-center px-3 rounded-md border bg-gray-50 total-field">
              {values.qtdediarias}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="valordiariaunitario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Diária (Unit.) R$</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    step="0.01"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
            <FormLabel>Total Diárias R$</FormLabel>
            <div className="h-10 flex items-center px-3 rounded-md border bg-gray-50 total-field">
              {formatCurrency(values.totaldiarias || 0)}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="outrosservicosdescricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição Outros Serviços</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    maxLength={100}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="outrosservicosvalor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Outros Serviços R$</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    step="0.01"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
            <FormLabel>Total Hospedagem R$</FormLabel>
            <div className="h-10 flex items-center px-3 rounded-md border bg-gray-50 total-field">
              {formatCurrency(values.totaldespesashospedagem || 0)}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={control}
            name="hospedagemobservacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observação Hospedagem</FormLabel>
                <FormControl>
                  <Input 
                    value={field.value ?? ''} 
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    maxLength={100}
                    className="total-field"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
