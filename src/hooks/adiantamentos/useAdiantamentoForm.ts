
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define schema for adiantamento form
const adiantamentoSchema = z.object({
  idcliente: z.string().min(1, { message: "Selecione um cliente" }),
  idviagem: z.string().min(1, { message: "Selecione uma viagem" }),
  dataadiantamento: z.string().min(1, { message: "Selecione uma data" }),
  valoradiantamento: z.number().min(0.01, { message: "Valor deve ser maior que zero" }),
  observacoes: z.string().optional(),
});

type AdiantamentoFormValues = z.infer<typeof adiantamentoSchema>;

export const useAdiantamentoForm = () => {
  const { toast } = useToast();
  const [listaClientes, setListaClientes] = useState<{ value: string; label: string }[]>([]);
  const [listaViagens, setListaViagens] = useState<{ value: string; label: string }[]>([]);
  const [activeTab, setActiveTab] = useState("dados");
  const [adiantamentoId, setAdiantamentoId] = useState<number | null>(null);
  const [isAdiantamentoLoaded, setIsAdiantamentoLoaded] = useState(false);

  const form = useForm<AdiantamentoFormValues>({
    resolver: zodResolver(adiantamentoSchema),
    defaultValues: {
      idcliente: "",
      idviagem: "",
      dataadiantamento: new Date().toISOString(),
      valoradiantamento: 0,
      observacoes: "",
    },
    mode: "onChange",
  });

  const fetchClientes = async () => {
    const { data, error } = await supabase
      .from('clientes')
      .select('id, nome');
    
    if (error) {
      toast({
        title: "Erro ao buscar clientes",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    if (data) {
      const clientesFormatted = data.map(cliente => ({
        value: cliente.id.toString(),
        label: cliente.nome,
      }));
      setListaClientes(clientesFormatted);
    }
  };

  const fetchViagens = async () => {
    const { data, error } = await supabase
      .from('viagens')
      .select('id, destino, datapartida');
    
    if (error) {
      toast({
        title: "Erro ao buscar viagens",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    if (data) {
      const viagensFormatted = data.map(viagem => ({
        value: viagem.id.toString(),
        label: `${viagem.destino} - ${viagem.datapartida || ''}`,
      }));
      setListaViagens(viagensFormatted);
    }
  };

  const handleClienteChange = (clienteId: string) => {
    // Implement client change logic if needed
  };

  const handleViagemChange = (viagemId: string) => {
    // Implement viagem change logic if needed
  };

  const handleDeleteAdiantamento = async () => {
    if (!adiantamentoId) {
      toast({
        title: "Erro ao excluir adiantamento",
        description: "Nenhum adiantamento selecionado para exclusão.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('adiantamentos')
        .delete()
        .eq('id', adiantamentoId.toString());
      
      if (error) throw error;
      
      toast({
        title: "Adiantamento excluído com sucesso!",
        description: "O adiantamento foi removido do banco de dados.",
      });
      
      form.reset();
      setAdiantamentoId(null);
      setIsAdiantamentoLoaded(false);
    } catch (error: any) {
      toast({
        title: "Erro ao excluir adiantamento",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: AdiantamentoFormValues) => {
    try {
      // Match the database schema from the types file
      const adiantamentoData = {
        // Creating a basic data structure that matches what's in the database
        // based on the Database type definition
        user_id: null, // Or get this from auth context if available
        totaladiantamentos: data.valoradiantamento,
        // Add other fields as needed based on your specific requirements
        // The fields below are placeholders to match the schema
        adiantbrindespara: null,
        adiantbrindesvalor: null,
        adiantestacionamentopara: null,
        adiantestacionamentovalor: null,
        adiantfretepara: null,
        adiantfretevalor: null,
        adianthospedagempara: null,
        adianthospedagemvalor: null,
        adiantpasseiospara: null,
        adiantpasseiosvalor: null,
        adianttaxaspara: null,
        adianttaxasvalor: null,
        adianttrasladospara: null,
        adianttrasladosvalor: null,
        restantebrindeseextras: null,
        restanteestacionamento: null,
        restantefrete: null,
        restantehospedagem: null,
        restantepasseios: null,
        restantetaxas: null,
        restantetotal: null,
        restantetraslados: null,
        totaldespesas: null,
        valorbrindestotal: null,
        valorestacionamentototal: null,
        valorfretetotal: null,
        valorhospedagemtotal: null,
        valorpasseiostotal: null,
        valortaxastotal: null,
        valortrasladostotal: null
      };
      
      let error;
      
      if (adiantamentoId) {
        const { error: updateError } = await supabase
          .from('adiantamentos')
          .update(adiantamentoData)
          .eq('id', adiantamentoId.toString());
        
        error = updateError;
        
        toast({
          title: "Adiantamento atualizado com sucesso!",
          description: "Os dados foram atualizados no banco de dados.",
        });
      } else {
        const { error: insertError } = await supabase
          .from('adiantamentos')
          .insert(adiantamentoData);
        
        error = insertError;
        
        toast({
          title: "Adiantamento registrado com sucesso!",
          description: "Os dados foram salvos no banco de dados.",
        });
      }
      
      if (error) throw error;
      
      form.reset();
      setAdiantamentoId(null);
      setIsAdiantamentoLoaded(false);
    } catch (error: any) {
      toast({
        title: "Erro ao registrar adiantamento",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    form,
    listaClientes,
    listaViagens,
    activeTab,
    adiantamentoId,
    isAdiantamentoLoaded,
    setActiveTab,
    handleClienteChange,
    handleViagemChange,
    handleDeleteAdiantamento,
    onSubmit,
    fetchClientes,
    fetchViagens
  };
};
