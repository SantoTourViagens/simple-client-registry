
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { unmask } from '@/utils/masks';

export const usePassageiroData = () => {
  const [passageiroId, setPassageiroId] = useState<string | null>(null);
  const [isPassageiroLoaded, setIsPassageiroLoaded] = useState(false);
  const { toast } = useToast();

  // Fetch passenger data based on CPF and optionally a viagem ID
  const fetchPassageiroData = async (cpf: string, viagemId?: string, currentViagemName?: string) => {
    try {
      const cleanCpf = unmask(cpf);
      if (!cleanCpf || cleanCpf.length < 11) return null;

      // First, try to find a passenger with this CPF for the specific viagem
      if (viagemId) {
        const { data: existingPassageiro, error: existingError } = await supabase
          .from('passageiros')
          .select('*')
          .eq('cpfpassageiro', cleanCpf)
          .eq('idviagem', viagemId)
          .maybeSingle();

        if (existingError) throw existingError;
        
        if (existingPassageiro) {
          setPassageiroId(existingPassageiro.id);
          setIsPassageiroLoaded(true);
          return existingPassageiro;
        }
      }

      // If no passenger found for this specific trip, check if there's a client with this CPF
      const { data: cliente, error: clienteError } = await supabase
        .from('clientes')
        .select('*')
        .eq('cpf', cleanCpf)
        .maybeSingle();

      if (clienteError) throw clienteError;
      
      if (cliente) {
        return {
          nome: cliente.nome,
          telefone: cliente.telefone,
          bairro: cliente.bairro,
          cidade: cliente.cidade,
          localembarque: cliente.localembarque,
          enderecoembarque: cliente.enderecoembarque,
          indicadopor: cliente.indicadopor,
        };
      }

      return null;
    } catch (error: any) {
      console.error('Error fetching passenger data:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao buscar dados do passageiro',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Fetch data about who recommended the passenger
  const fetchIndicadorData = async (cpfIndicador: string) => {
    try {
      const cleanCpf = unmask(cpfIndicador);
      if (!cleanCpf || cleanCpf.length < 11) return null;

      const { data, error } = await supabase
        .from('clientes')
        .select('nome')
        .eq('cpf', cleanCpf)
        .maybeSingle();

      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error('Error fetching indicador data:', error);
      return null;
    }
  };

  // Delete a passenger
  const deletePassageiro = async (id: string) => {
    try {
      const { error } = await supabase
        .from('passageiros')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      return true;
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao excluir passageiro',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    passageiroId,
    isPassageiroLoaded,
    setPassageiroId,
    setIsPassageiroLoaded,
    fetchPassageiroData,
    fetchIndicadorData,
    deletePassageiro
  };
};
