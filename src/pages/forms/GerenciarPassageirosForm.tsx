
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2 } from "lucide-react";
import { unmask } from "@/utils/masks";

// Atualizar a interface Viagem com os nomes corretos dos campos
interface Viagem {
  id: string;  // Alterado de number para string
  destino: string;
  datapartida: string;  // Alterado de datainicio
  dataretorno: string;  // Alterado de datafim
}

interface Passageiro {
  id: string;  // Alterado de number para string
  nomepassageiro: string;  // Alterado de nome
  cpfpassageiro: string;   // Alterado de cpf
  telefonepassageiro: string; // Alterado de telefone
  poltrona: string | null;  // Alterado de numeropoltrona e mudado para string
  idviagem: string;  // Alterado de number para string
}

const GerenciarPassageirosForm = () => {
  const { toast } = useToast();
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [passageiros, setPassageiros] = useState<Passageiro[]>([]);
  const [loading, setLoading] = useState(false);
  
  const form = useForm({
    defaultValues: {
      viagemId: "",
    },
  });

  // Carregar lista de viagens ao montar o componente
  useEffect(() => {
    fetchViagens();
  }, []);

  const fetchViagens = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("viagens")
        .select("id, destino, datapartida, dataretorno")  // Alterado os nomes dos campos
        .order("datapartida", { ascending: false });      // Alterado de datainicio para datapartida
    
      if (error) {
        console.error("Erro detalhado:", error);
        throw error;
      }
  
      console.log("Viagens carregadas:", data);
      setViagens(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Erro completo ao carregar viagens:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar viagens",
        description: error.message || "Não foi possível carregar a lista de viagens. Tente novamente mais tarde.",
      });
      setLoading(false);
    }
  };

  // Carregar passageiros quando uma viagem for selecionada
  const handleViagemChange = async (value: string) => {
    form.setValue("viagemId", value);
    
    if (!value) {
      setPassageiros([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("passageiros")
        .select("id, nomepassageiro, cpfpassageiro, telefonepassageiro, poltrona, idviagem")
        .eq("idviagem", value);

      if (error) {
        throw error;
      }

      setPassageiros(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar passageiros:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar passageiros",
        description: "Não foi possível carregar a lista de passageiros. Tente novamente mais tarde.",
      });
      setLoading(false);
    }
  };

  // Atualizar número de poltrona do passageiro
  const handleUpdatePoltrona = async (passageiroId: string, poltronaAtual: string | null) => {
    const novoNumero = prompt("Digite o novo número da poltrona:", poltronaAtual || "");
    
    if (novoNumero === null) {
      return; // Usuário cancelou a operação
    }

    // A poltrona é um campo do tipo string, então não é necessário converter para número
    const poltrona = novoNumero === "" ? null : novoNumero;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("passageiros")
        .update({ poltrona: poltrona })
        .eq("id", passageiroId);

      if (error) {
        throw error;
      }

      // Atualizar o estado local após atualização bem-sucedida
      setPassageiros(passageiros.map(p => 
        p.id === passageiroId ? { ...p, poltrona: poltrona } : p
      ));

      toast({
        title: "Poltrona atualizada",
        description: "O número da poltrona foi atualizado com sucesso.",
      });
      
      setLoading(false);
    } catch (error) {
      console.error("Erro ao atualizar poltrona:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar poltrona",
        description: "Não foi possível atualizar o número da poltrona. Tente novamente mais tarde.",
      });
      setLoading(false);
    }
  };

  // Excluir passageiro da viagem
  const handleDeletePassageiro = async (passageiroId: string) => {
    if (!confirm("Tem certeza que deseja remover este passageiro da viagem?")) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from("passageiros")
        .delete()
        .eq("id", passageiroId);

      if (error) {
        throw error;
      }

      // Atualizar o estado local após exclusão bem-sucedida
      setPassageiros(passageiros.filter(p => p.id !== passageiroId));

      toast({
        title: "Passageiro removido",
        description: "O passageiro foi removido da viagem com sucesso.",
      });
      
      setLoading(false);
    } catch (error) {
      console.error("Erro ao excluir passageiro:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir passageiro",
        description: "Não foi possível remover o passageiro da viagem. Tente novamente mais tarde.",
      });
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full">
          <CardHeader className="bg-navy text-white">
            <CardTitle className="text-xl font-inter">Gerenciar Passageiros por Viagem</CardTitle>
            <CardDescription className="text-gray-200 font-roboto">
              Selecione uma viagem para gerenciar seus passageiros
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form className="space-y-6">
                <FormField
                  control={form.control}
                  name="viagemId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selecione uma viagem</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={handleViagemChange}
                          value={field.value}
                          disabled={loading}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione uma viagem" />
                          </SelectTrigger>
                          <SelectContent>
                            {viagens.map((viagem) => (
                              // Atualizar também onde os campos são usados na renderização
                              <SelectItem key={viagem.id} value={viagem.id.toString()}>
                                {viagem.destino} ({new Date(viagem.datapartida).toLocaleDateString()} - {new Date(viagem.dataretorno).toLocaleDateString()})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("viagemId") && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Lista de Passageiros</h3>
                    
                    {passageiros.length === 0 ? (
                      <p className="text-gray-500">Nenhum passageiro encontrado para esta viagem.</p>
                    ) : (
                      <Table>
                        <TableCaption>Lista de passageiros da viagem selecionada</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>CPF</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>Poltrona</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {passageiros.map((passageiro) => (
                            // Update the table rendering
                            <TableRow key={passageiro.id}>
                              <TableCell>{passageiro.nomepassageiro}</TableCell>
                              <TableCell>{passageiro.cpfpassageiro}</TableCell>
                              <TableCell>{passageiro.telefonepassageiro}</TableCell>
                              <TableCell 
                                className="cursor-pointer text-blue-600 hover:underline"
                                onClick={() => handleUpdatePoltrona(passageiro.id, passageiro.poltrona)}
                              >
                                {passageiro.poltrona || "Não atribuída"}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  onClick={() => handleDeletePassageiro(passageiro.id)}
                                  disabled={loading}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GerenciarPassageirosForm;
