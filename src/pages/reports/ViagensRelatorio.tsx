
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
import { parseISO } from "date-fns";

interface Viagem {
  id: string;
  destino: string;
  datapartida: string;
  dataretorno: string;
  qtdepagantes: number;
  qtdenaopagantes: number;
  qtdepromocionais: number;
  despesatotal: number;
  receitatotal: number;
  lucrobruto: number;
}

interface FilterValues {
  searchTerm: string;
  filterField: string;
}

const ViagensRelatorio = () => {
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [filteredViagens, setFilteredViagens] = useState<Viagem[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<FilterValues>({
    defaultValues: {
      searchTerm: "",
      filterField: "destino"
    }
  });

  useEffect(() => {
    const fetchViagens = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("viagens")
          .select("*")
          .order("datapartida", { ascending: false });

        if (error) throw error;
        setViagens(data || []);
        setFilteredViagens(data || []);
      } catch (error) {
        console.error("Erro ao buscar viagens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchViagens();
    return setupPrintStyles();
  }, []);

  const applyFilter = (values: FilterValues) => {
    const { searchTerm, filterField } = values;
    
    if (!searchTerm.trim()) {
      setFilteredViagens(viagens);
      return;
    }

    const filtered = viagens.filter(viagem => {
      const fieldValue = viagem[filterField as keyof Viagem];
      if (fieldValue === null || fieldValue === undefined) return false;
      
      if (typeof fieldValue === 'number') {
        return String(fieldValue).includes(searchTerm);
      }
      
      return String(fieldValue).toLowerCase().includes(searchTerm.toLowerCase());
    });

    setFilteredViagens(filtered);
  };

  const resetFilter = () => {
    form.reset({
      searchTerm: "",
      filterField: "destino"
    });
    setFilteredViagens(viagens);
  };

  const handleExport = () => {
    const dataForExport = filteredViagens.map(viagem => ({
      Destino: viagem.destino,
      "Data de Partida": formatLocalDate(viagem.datapartida),
      "Data de Retorno": formatLocalDate(viagem.dataretorno),
      "Pagantes": viagem.qtdepagantes,
      "Não Pagantes": viagem.qtdenaopagantes,
      "Promocionais": viagem.qtdepromocionais,
      "Despesa Total": `R$ ${viagem.despesatotal.toFixed(2)}`,
      "Receita Total": `R$ ${viagem.receitatotal.toFixed(2)}`,
      "Lucro Bruto": `R$ ${viagem.lucrobruto.toFixed(2)}`
    }));

    exportToExcel(dataForExport, "Relatório_Viagens");
  };

  // Format date correctly to avoid timezone issues
  const formatLocalDate = (dateString: string) => {
    if (!dateString) return "";
    
    // Parse the ISO date string without adjusting for timezone
    const date = parseISO(dateString);
    
    // Format as DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <ReportLayout title="Relatório de Viagens" onExport={handleExport}>
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
                      <SelectItem value="destino">Destino</SelectItem>
                      <SelectItem value="datapartida">Data de Partida</SelectItem>
                      <SelectItem value="dataretorno">Data de Retorno</SelectItem>
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
                          setFilteredViagens(viagens);
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
      ) : filteredViagens.length === 0 ? (
        <p className="text-center py-4">Nenhuma viagem encontrada.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Destino</TableHead>
                <TableHead>Data de Partida</TableHead>
                <TableHead>Data de Retorno</TableHead>
                <TableHead>Pagantes</TableHead>
                <TableHead>Não Pagantes</TableHead>
                <TableHead>Despesa Total</TableHead>
                <TableHead>Receita Total</TableHead>
                <TableHead>Lucro Bruto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredViagens.map((viagem) => (
                <TableRow key={viagem.id}>
                  <TableCell className="font-medium">{viagem.destino}</TableCell>
                  <TableCell>{formatLocalDate(viagem.datapartida)}</TableCell>
                  <TableCell>{formatLocalDate(viagem.dataretorno)}</TableCell>
                  <TableCell>{viagem.qtdepagantes}</TableCell>
                  <TableCell>{viagem.qtdenaopagantes}</TableCell>
                  <TableCell>{formatCurrency(viagem.despesatotal)}</TableCell>
                  <TableCell>{formatCurrency(viagem.receitatotal)}</TableCell>
                  <TableCell>{formatCurrency(viagem.lucrobruto)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </ReportLayout>
  );
};

export default ViagensRelatorio;
