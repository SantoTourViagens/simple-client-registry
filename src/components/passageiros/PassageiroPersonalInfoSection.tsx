// src\components\passageiros\PassageiroPersonalInfoSection.tsx
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { maskCPF, maskPhone } from "@/utils/masks";
import { PassageiroFormValues } from "./types";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Update the interface to expect the correct type
interface PassageiroPersonalInfoSectionProps {
  form: UseFormReturn<PassageiroFormValues>;
  listaViagens: { value: string; label: string }[];
  vehicleType: string;
  availableSeats: { value: string; label: string }[]; // Updated type
  handleViagemChange: (viagemId: string) => void;
  handleCPFChange: (cpf: string) => void;
}

const PassageiroPersonalInfoSection = ({
  form,
  listaViagens,
  vehicleType,
  availableSeats,
  handleViagemChange,
  handleCPFChange,
}: PassageiroPersonalInfoSectionProps) => {
  const { toast } = useToast();
  const [isCheckingCPF, setIsCheckingCPF] = useState(false);
  
  // Remove console.log or keep it for debugging
  console.log("Vehicle Type:", vehicleType); // Add this to debug
  console.log("Available seats:", availableSeats);
  
  // Function to check if CPF exists in the clientes table
  const checkCPFExists = async (cpf: string) => {
    if (!cpf || cpf.replace(/\D/g, '').length < 11) return;
    
    setIsCheckingCPF(true);
    
    try {
      // Clean the CPF before querying
      const cleanCPF = cpf.replace(/\D/g, '');
      
      // Query the clientes table
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('cpf', cleanCPF);
      
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        // CPF not found in the database
        toast({
          title: "CPF não encontrado",
          description: "Este CPF não está cadastrado na base de clientes.",
          variant: "destructive",
        });
        return null;
      }
      
      return data[0]; // Return the first match
    } catch (error) {
      console.error("Erro ao verificar CPF:", error);
      toast({
        title: "Erro ao verificar CPF",
        description: "Ocorreu um erro ao verificar o CPF no banco de dados.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsCheckingCPF(false);
    }
  };
  
  // Function to auto-fill form fields with client data
  const autoFillClientData = (clientData: any) => {
    if (!clientData) return;
    
    // Update form fields with client data
    form.setValue('nomepassageiro', clientData.nome || '');
    form.setValue('telefonepassageiro', clientData.telefone || '');
    form.setValue('bairropassageiro', clientData.bairro || '');
    form.setValue('cidadepassageiro', clientData.cidade || '');
    form.setValue('passageiroindicadopor', clientData.indicadopor || clientData.nomeindicadopor || '');
    form.setValue('localembarquepassageiro', clientData.localembarque || '');
    form.setValue('enderecoembarquepassageiro', clientData.enderecoembarque || '');
    
    toast({
      title: "Dados do cliente carregados",
      description: "Os campos foram preenchidos automaticamente.",
    });
  };
  
  // Handle CPF change with debounce
  const handleCPFChangeWithCheck = async (cpf: string) => {
    handleCPFChange(cpf);
    
    // Clean the CPF
    const cleanCPF = cpf.replace(/\D/g, '');
    
    // Only check if we have a complete CPF
    if (cleanCPF.length === 11) {
      const clientData = await checkCPFExists(cleanCPF);
      if (clientData) {
        autoFillClientData(clientData);
      }
    }
  };
  
  return (
    <Card className="form-section-card">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FormField
            control={form.control}
            name="idviagem"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="font-inter font-medium">Nome da Viagem</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleViagemChange(value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="font-roboto total-field">
                      <SelectValue placeholder="Selecione uma viagem" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {listaViagens.map((viagem) => (
                      <SelectItem key={viagem.value} value={viagem.value}>
                        {viagem.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="poltrona"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-inter font-medium">
                  Poltrona {vehicleType ? `(${vehicleType})` : ''}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!field.value && availableSeats.length === 0}
                >
                  <FormControl>
                    <SelectTrigger className="font-roboto total-field bg-white">
                      <SelectValue placeholder="Escolha uma poltrona" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="max-h-[300px] overflow-y-auto bg-white">
                    {availableSeats.map((seat) => (
                      <SelectItem key={seat.value} value={seat.value}>
                        {seat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valorviagem"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-inter font-medium">Valor da Viagem R$</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    {...field}
                    className="font-roboto"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <FormField
            control={form.control}
            name="cpfpassageiro"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-inter font-medium">CPF</FormLabel>
                <FormControl>
                  <Input
                    placeholder="000.000.000-00"
                    value={maskCPF(field.value)}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      handleCPFChangeWithCheck(e.target.value);
                    }}
                    className={`font-roboto ${isCheckingCPF ? 'opacity-70' : ''}`}
                    disabled={isCheckingCPF}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nomepassageiro"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-inter font-medium">Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome completo"
                    {...field}
                    className="font-roboto"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <FormField
            control={form.control}
            name="telefonepassageiro"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-inter font-medium">Telefone (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(00) 00000-0000"
                    value={maskPhone(field.value || '')}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="font-roboto"
                    required={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bairropassageiro"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-inter font-medium">Bairro</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Bairro"
                    {...field}
                    className="font-roboto"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <FormField
            control={form.control}
            name="cidadepassageiro"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-inter font-medium">Cidade</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Cidade"
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
            name="passageiroindicadopor"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-inter font-medium">Indicado por</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome de quem indicou"
                    {...field}
                    className="font-roboto"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <FormField
            control={form.control}
            name="localembarquepassageiro"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-inter font-medium">Local de Embarque (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Terminal, Ponto, Rodoviária"
                    {...field}
                    className="font-roboto"
                    required={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="enderecoembarquepassageiro"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-inter font-medium">Endereço do Embarque (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Endereço completo"
                    {...field}
                    className="font-roboto"
                    required={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

      </CardContent>
    </Card>
  );
};

export default PassageiroPersonalInfoSection;
