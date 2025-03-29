
import { useState, useEffect } from "react";
import ReportLayout from "@/components/reports/ReportLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { exportToExcel, setupPrintStyles } from "@/utils/exportUtils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface Passageiro {
  id: string;
  nomepassageiro: string;
  cpfpassageiro: string;
  telefonepassageiro: string;
  cidadepassageiro: string;
  bairropassageiro: string;
  nomeviagem: string;
  dataviagem: string;
  valorviagem: number;
  valorfaltareceber: number;
}

interface FilterValues {
  searchTerm: string;
  filterField: string;
}

const PassageirosRelatorio = () => {
  const [passageiros, setPassageiros] = useState<Passageiro[]>([]);
  const [filteredPassageiros, setFilteredPassageiros] = useState<Passageiro[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<FilterValues>({
    defaultValues: {
      searchTerm: "",
      filterField: "nomepassageiro"
    }
  });

  useEffect(() => {
    const fetchPassageiros = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("passageiros")
          .select("*")
          .order("nomepassageiro");

        if (error) throw error;
        setPassageiros(data || []);
        setFilteredPassageiros(data || []);
      } catch (error) {
        console.error("Erro ao buscar passageiros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPassageiros();
    return setupPrintStyles();
  }, []);

  const applyFilter = (values: FilterValues) => {
    const { searchTerm, filterField } = values;
    
    if (!searchTerm.trim()) {
      setFilteredPassageiros(passageiros);
      return;
    }

    const filtered = passageiros.filter(passageiro => {
      const fieldValue = passageiro[filterField as keyof Passageiro];
      if (fieldValue === null || fieldValue === undefined) return false;
      
      if (typeof fieldValue === 'number') {
        return String(fieldValue).includes(searchTerm);
      }
      
      return String(fieldValue).toLowerCase().includes(searchTerm.toLowerCase());
    });

    setFilteredPassageiros(filtered);
  };

  const resetFilter = () => {
    form.reset({
      searchTerm: "",
      filterField: "nomepassageiro"
    });
    setFilteredPassageiros(passageiros);
  };

  const handleExport = () => {
    const dataForExport = filteredPassageiros.map(passageiro => ({
      Nome: passageiro.nomepassageiro,
      CPF: passageiro.cpfpassageiro,
      Telefone: passageiro.telefonepassageiro || "-",
      Cidade: passageiro.cidadepassageiro || "-",
      Bairro: passageiro.bairropassageiro || "-",
      Viagem: passageiro.nomeviagem,
      "Data da Viagem": new Date(passageiro.dataviagem).toLocaleDateString("pt-BR"),
      "Valor da Viagem": `R$ ${passageiro.valorviagem.toFixed(2)}`,
      "Valor a Receber": `R$ ${passageiro.valorfaltareceber.toFixed(2)}`
    }));

    exportToExcel(dataForExport, "Relatório_Passageiros");
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <ReportLayout title="Relatório de Passageiros" onExport={handleExport}>
      <div className="mb-6">
        <Form {...form}>
          <div className="flex flex-wrap items-end gap-4">
            <FormField
              control={form.control}
              name="filterField"
              render={({ field }) => (
                <FormItem className="w-full sm:w-auto">
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nomepassageiro">Nome</SelectItem>
                      <SelectItem value="cpfpassageiro">CPF</SelectItem>
                      <SelectItem value="telefonepassageiro">Telefone</SelectItem>
                      <SelectItem value="nomeviagem">Viagem</SelectItem>
                      <SelectItem value="cidadepassageiro">Cidade</SelectItem>
                      <SelectItem value="bairropassageiro">Bairro</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="searchTerm"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input 
                      placeholder="Buscar..." 
                      {...field} 
                      className="w-full"
                      onChange={(e) => {
                        field.onChange(e);
                        if (!e.target.value) {
                          setFilteredPassageiros(passageiros);
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button 
              type="button" 
              onClick={() => applyFilter(form.getValues())}
              className="flex-shrink-0"
            >
              <Search className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetFilter}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
        </Form>
      </div>

      {loading ? (
        <p className="text-center py-4">Carregando dados...</p>
      ) : filteredPassageiros.length === 0 ? (
        <p className="text-center py-4">Nenhum passageiro encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Viagem</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Valor a Receber</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPassageiros.map((passageiro) => (
                <TableRow key={passageiro.id}>
                  <TableCell className="font-medium">{passageiro.nomepassageiro}</TableCell>
                  <TableCell>{passageiro.cpfpassageiro}</TableCell>
                  <TableCell>{passageiro.telefonepassageiro || "-"}</TableCell>
                  <TableCell>{passageiro.nomeviagem}</TableCell>
                  <TableCell>{new Date(passageiro.dataviagem).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>{formatCurrency(passageiro.valorviagem)}</TableCell>
                  <TableCell>{formatCurrency(passageiro.valorfaltareceber)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </ReportLayout>
  );
};

export default PassageirosRelatorio;
