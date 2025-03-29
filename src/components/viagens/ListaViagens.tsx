import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toDisplayDate } from "@/utils/dateUtils";

interface Viagem {
  id: string;
  datapartida: string;  // Atualizado para match com o campo do banco
  destino: string;
}

interface ListaViagensProps {
  mode?: 'edit' | 'delete';
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ListaViagens = ({ mode = 'edit', onEdit, onDelete }: ListaViagensProps) => {
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregarViagens();
  }, []);

  async function carregarViagens() {
    const { data, error } = await supabase
      .from("viagens")
      .select("id, destino, datapartida")
      .order("datapartida", { ascending: false });

    if (error) {
      console.error("Erro ao carregar viagens:", error);
      return;
    }

    setViagens(data || []);
  }

  const handleAction = (id: string) => {
    if (mode === 'edit') {
      navigate(`/form/viagens/editar/${id}`);
    } else if (mode === 'delete' && onDelete) {
      onDelete(id);
    }
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Destino</TableHead>
            <TableHead>Data de Partida</TableHead>
            <TableHead>Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {viagens.map((viagem) => (
            <TableRow key={viagem.id}>
              <TableCell>{viagem.destino}</TableCell>
              <TableCell>{toDisplayDate(viagem.datapartida)}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleAction(viagem.id)}
                  variant={mode === 'edit' ? "secondary" : "destructive"}
                  size="sm"
                >
                  {mode === 'edit' ? 'Editar' : 'Excluir'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};