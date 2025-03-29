
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

interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  bairro: string;
  cidade: string;
  localembarque: string;
  nomeindicadopor: string;
  enderecoembarque: string;
  datanascimento: string;
}

interface FilterValues {
  searchTerm: string;
  filterField: string;
}

const ClientesRelatorio = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<FilterValues>({
    defaultValues: {
      searchTerm: "",
      filterField: "nome"
    }
  });

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("clientes")
          .select("*")
          .order("nome");

        if (error) throw error;
        
        if (data) {
          // Map the data to match the Cliente interface
          const clientesFormatted: Cliente[] = data.map(cliente => ({
            id: cliente.id,
            nome: cliente.nome,
            cpf: cliente.cpf,
            telefone: cliente.telefone || "",
            bairro: cliente.bairro,
            cidade: cliente.cidade,
            localembarque: cliente.localembarque || "",
            enderecoembarque: cliente.enderecoembarque || "",
            nomeindicadopor: cliente.indicadopor || "",
            datanascimento: cliente.datanascimento || ""
          }));
          
          setClientes(clientesFormatted);
          setFilteredClientes(clientesFormatted);
        }
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
    return setupPrintStyles();
  }, []);

  const applyFilter = (values: FilterValues) => {
    const { searchTerm, filterField } = values;
    
    if (!searchTerm.trim()) {
      setFilteredClientes(clientes);
      return;
    }

    const filtered = clientes.filter(cliente => {
      const fieldValue = cliente[filterField as keyof Cliente];
      if (fieldValue === null || fieldValue === undefined) return false;
      
      return String(fieldValue).toLowerCase().includes(searchTerm.toLowerCase());
    });

    setFilteredClientes(filtered);
  };

  const resetFilter = () => {
    form.reset({
      searchTerm: "",
      filterField: "nome"
    });
    setFilteredClientes(clientes);
  };

  const handleExport = () => {
    const dataForExport = filteredClientes.map(cliente => ({
      Nome: cliente.nome,
      CPF: cliente.cpf,
      Telefone: cliente.telefone || "-",
      Bairro: cliente.bairro,
      Cidade: cliente.cidade,
      "Local de Embarque": cliente.localembarque || "-",
      "Endereço de Embarque": cliente.enderecoembarque || "-",
      "Indicado Por": cliente.nomeindicadopor || "-",
      "Data de Nascimento": cliente.datanascimento ? new Date(cliente.datanascimento).toLocaleDateString("pt-BR") : "-"
    }));

    exportToExcel(dataForExport, "Relatório_Clientes");
  };

  return (
    <ReportLayout title="Relatório de Clientes" onExport={handleExport}>
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
                      <SelectItem value="nome">Nome</SelectItem>
                      <SelectItem value="cpf">CPF</SelectItem>
                      <SelectItem value="telefone">Telefone</SelectItem>
                      <SelectItem value="bairro">Bairro</SelectItem>
                      <SelectItem value="cidade">Cidade</SelectItem>
                      <SelectItem value="localembarque">Local de Embarque</SelectItem>
                      <SelectItem value="nomeindicadopor">Indicado Por</SelectItem>
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
                          setFilteredClientes(clientes);
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
      ) : filteredClientes.length === 0 ? (
        <p className="text-center py-4">Nenhum cliente encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Bairro</TableHead>
                <TableHead>Local de Embarque</TableHead>
                <TableHead>Endereço de Embarque</TableHead>
                <TableHead>Indicado Por</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell>{cliente.cpf}</TableCell>
                  <TableCell>{cliente.telefone || "-"}</TableCell>
                  <TableCell>{cliente.cidade}</TableCell>
                  <TableCell>{cliente.bairro}</TableCell>
                  <TableCell>{cliente.localembarque || "-"}</TableCell>
                  <TableCell>{cliente.enderecoembarque || "-"}</TableCell>
                  <TableCell>{cliente.nomeindicadopor || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </ReportLayout>
  );
};

export default ClientesRelatorio;
