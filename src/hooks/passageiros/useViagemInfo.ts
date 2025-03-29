
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type SeatOption = {
  label: string;
  value: string;
};

export type VehicleType = "Van" | "Ônibus" | "Semi Leito" | "Microônibus" | "Carro";

interface ViagemOption {
  value: string;
  label: string;
}

// Definir a interface ViagemInfo uma única vez no topo
interface ViagemInfo {
  id: string;
  destino: string;
  datapartida: string;
  tipoveiculo: string;
  qtdeassentos: number;
  precosugerido: number; 
  [key: string]: any;
}

// Interface for the return of the useViagemInfo hook
export interface ViagemInfoResult {
  viagemInfo: ViagemInfo | null;
  loading: boolean;
  assentosDisponiveis: SeatOption[];
  assentosOcupados: string[];
  listaViagens: ViagemOption[];
  vehicleType: string;
  totalSeats: number;
  availableSeats: SeatOption[];
  fetchViagens: () => Promise<void>;
  fetchViagemDetails: (id: string) => Promise<any>;
  fetchTakenSeats: (id: string) => Promise<string[]>;
  setVehicleType: React.Dispatch<React.SetStateAction<string>>;
}

export const useViagemInfo = (viagemId?: string): ViagemInfoResult => {
  const [viagemInfo, setViagemInfo] = useState<ViagemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [assentosDisponiveis, setAssentosDisponiveis] = useState<SeatOption[]>([]);
  const [assentosOcupados, setAssentosOcupados] = useState<string[]>([]);
  const [listaViagens, setListaViagens] = useState<ViagemOption[]>([]);
  const [vehicleType, setVehicleType] = useState<string>("");
  const [totalSeats, setTotalSeats] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchViagens();
  }, []);

  useEffect(() => {
    const fetchViagemInfo = async () => {
      if (!viagemId) return;

      try {
        setLoading(true);
        
        // Fetch viagem info
        const { data: viagemData, error: viagemError } = await supabase
          .from('viagens')
          .select('*')
          .eq('id', viagemId)
          .maybeSingle();

        if (viagemError) throw viagemError;
        if (!viagemData) {
          toast({
            title: 'Erro',
            description: 'Viagem não encontrada',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }

        setViagemInfo(viagemData);
        setVehicleType(viagemData.tipoveiculo || "");
        setTotalSeats(viagemData.qtdeassentos || 0);

        await fetchTakenSeats(viagemId);
      } catch (error: any) {
        console.error('Error fetching viagem info:', error);
        toast({
          title: 'Erro',
          description: error.message || 'Erro ao carregar informações da viagem',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchViagemInfo();
  }, [viagemId]);

  const fetchViagens = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('viagens')
        .select('id, destino, datapartida')
        .order('datapartida', { ascending: false });
  
      if (error) throw error;
      
      const formattedViagens = data.map(viagem => ({
        value: viagem.id,
        label: `${viagem.destino} - ${formatLocalDate(viagem.datapartida)}`
      }));
      
      setListaViagens(formattedViagens);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao carregar lista de viagens',
        variant: 'destructive',
      });
    }
  };
  
  const formatLocalDate = (dateString: string): string => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const fetchViagemDetails = async (id: string): Promise<any> => {
    try {
      console.log('ID da viagem recebido:', id);

      const { data, error } = await supabase
        .from('viagens')
        .select('id, destino, datapartida, tipoveiculo, qtdeassentos, precosugerido')
        .eq('id', id)
        .maybeSingle();

      console.log('Dados retornados:', data);

      if (error) {
        console.error('Erro na consulta:', error);
        throw error;
      }
      
      if (!data) {
        toast({
          title: 'Erro',
          description: 'Viagem não encontrada ou foi removida',
          variant: 'destructive',
        });
        return null;
      }
      
      // Garantir que o ID e valor estão sendo armazenados corretamente
      setViagemInfo({
        ...data,
        id: data.id,
        precosugerido: data.precosugerido
      });
      setVehicleType(data.tipoveiculo || "");
      setTotalSeats(data.qtdeassentos || 0);
      
      await fetchTakenSeats(id);
      
      return data;
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao carregar detalhes da viagem',
        variant: 'destructive',
      });
      return null;
    }
  };

  const fetchTakenSeats = async (viagemId: string): Promise<string[]> => {
    try {
      console.log('ID da viagem para busca:', viagemId); // Debug log

      // Na tabela passageiros, usamos idviagem
      const { data: passageirosData, error: passageirosError } = await supabase
        .from('passageiros')
        .select('poltrona, nomepassageiro, idviagem')
        .eq('idviagem', viagemId) // Correto: usando idviagem para tabela passageiros
        .not('poltrona', 'eq', 'no-seat');

      if (passageirosError) throw passageirosError;

      // Na tabela viagens, usamos id
      const { data: viagemData, error: viagemError } = await supabase
        .from('viagens')
        .select('tipoveiculo, qtdeassentos')
        .eq('id', viagemId) // Correto: usando id para tabela viagens
        .single();

      if (viagemError) throw viagemError;

      // Get list of occupied seats
      const ocupados = passageirosData
        .filter(p => p.poltrona)
        .map(p => p.poltrona);
      
      setAssentosOcupados(ocupados);

      const totalAssentos = viagemData.qtdeassentos;
      const assentos: SeatOption[] = [];

      // Generate only available seats
      for (let i = 1; i <= totalAssentos; i++) {
        const seatNumber = i.toString();
        if (!ocupados.includes(seatNumber)) {
          assentos.push({ 
            label: `Poltrona ${seatNumber}`,
            value: seatNumber
          });
        }
      }

      // Add "no seat" option at the end
      assentos.push({ label: "Sem poltrona", value: "no-seat" });

      setAssentosDisponiveis(assentos);
      return ocupados;
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao verificar poltronas ocupadas',
        variant: 'destructive',
      });
      return [];
    }
  };

  return {
    viagemInfo,
    loading,
    assentosDisponiveis,
    assentosOcupados,
    listaViagens,
    vehicleType,
    totalSeats,
    availableSeats: assentosDisponiveis,
    fetchViagens,
    fetchViagemDetails,
    fetchTakenSeats,
    setVehicleType
  };
};
