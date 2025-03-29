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
import { Search, X, Calendar } from "lucide-react";
import { parseISO } from "date-fns";

interface Adiantamento {
  id: string;
  created_at: string;
  adianttaxaspara: string;
  adiantfretevalor: number;
  adiantfretepara: string;
  adianttaxasvalor: number;
  adiantestacionamentovalor: number;
  adiantestacionamentopara: string;
  adianttrasladosvalor: number;
  adianttrasladospara: string;
  adianthospedagemvalor: number;
  adianthospedagempara: string;
  adiantpasseiosvalor: number;
  adiantpasseiospara: string;
  adiantbrindesvalor: number;
  adiantbrindespara: string;
  totaladiantamentos: number;
}

interface FilterValues {
  searchTerm: string;
  filterField: string;
}

const AdiantamentosRelatorio = () => {
  const [adiantamentos, setAdiantamentos] = useState<Adiantamento[]>([]);
  const [filteredAdiantamentos, setFilteredAdiantamentos] = useState<Adiantamento[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<FilterValues>({
    defaultValues: {
      searchTerm: "",
      filterField: "created_at"
    }
  });

  useEffect(() => {
    const fetchAdiantamentos = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("adiantamentos")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setAdiantamentos(data || []);
        setFilteredAdiantamentos(data || []);
      } catch (error) {
        console.error("Erro ao buscar adiantamentos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdiantamentos();
    return setupPrintStyles();
  }, []);

  const applyFilter = (values: FilterValues) => {
    const { searchTerm, filterField } = values;
    
    if (!searchTerm.trim()) {
      setFilteredAdiantamentos(adiantamentos);
      return;
    }

    const filtered = adiantamentos.filter(adiantamento => {
      if (filterField === 'created_at') {
        const date = new Date(adiantamento.created_at).toLocaleDateString("pt-BR");
        return date.includes(searchTerm);
      }

      const fieldValue = adiantamento[filterField as keyof Adiantamento];
      if (fieldValue === null || fieldValue === undefined) return false;
      
      if (typeof fieldValue === 'number') {
        return String(fieldValue).includes(searchTerm);
      }
      
      return String(fieldValue).toLowerCase().includes(searchTerm.toLowerCase());
    });

    setFilteredAdiantamentos(filtered);
  };

  const resetFilter = () => {
    form.reset({
      searchTerm: "",
      filterField: "created_at"
    });
    setFilteredAdiantamentos(adiantamentos);
  };

  const formatLocalDate = (dateString: string) => {
    if (!dateString) return "";
    
    const date = parseISO(dateString);
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  const handleExport = () => {
    const dataForExport = filteredAdiantamentos.map(adiantamento => ({
      Data: formatLocalDate(adiantamento.created_at),
      "Taxas Para": adiantamento.adianttaxaspara || "-",
      "Valor Taxas": `R$ ${adiantamento.adianttaxasvalor.toFixed(2)}`,
      "Frete Para": adiantamento.adiantfretepara || "-",
      "Valor Frete": `R$ ${adiantamento.adiantfretevalor.toFixed(2)}`,
      "Estacionamento Para": adiantamento.adiantestacionamentopara || "-",
      "Valor Estacionamento": `R$ ${adiantamento.adiantestacionamentovalor.toFixed(2)}`,
      "Traslados Para": adiantamento.adianttrasladospara || "-",
      "Valor Traslados": `R$ ${adiantamento.adianttrasladosvalor.toFixed(2)}`,
      "Hospedagem Para": adiantamento.adianthospedagempara || "-",
      "Valor Hospedagem": `R$ ${adiantamento.adianthospedagemvalor.toFixed(2)}`,
      "Passeios Para": adiantamento.adiantpasseiospara || "-",
      "Valor Passeios": `R$ ${adiantamento.adiantpasseiosvalor.toFixed(2)}`,
      "Brindes Para": adiantamento.adiantbrindespara || "-",
      "Valor Brindes": `R$ ${adiantamento.adiantbrindesvalor.toFixed(2)}`,
      "Total": `R$ ${adiantamento.totaladiantamentos.toFixed(2)}`
    }));

    exportToExcel(dataForExport, "Relatório_Adiantamentos");
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <ReportLayout title="Relatório de Adiantamentos" onExport={handleExport}>
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
                      <SelectItem value="created_at">Data</SelectItem>
                      <SelectItem value="adianttaxaspara">Taxas Para</SelectItem>
                      <SelectItem value="adiantfretepara">Frete Para</SelectItem>
                      <SelectItem value="adiantestacionamentopara">Estacionamento Para</SelectItem>
                      <SelectItem value="adianttrasladospara">Traslados Para</SelectItem>
                      <SelectItem value="adianthospedagempara">Hospedagem Para</SelectItem>
                      <SelectItem value="adiantpasseiospara">Passeios Para</SelectItem>
                      <SelectItem value="adiantbrindespara">Brindes Para</SelectItem>
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
                    <div className="flex">
                      {form.watch("filterField") === "created_at" && (
                        <div className="bg-muted p-2 rounded-l-md border-y border-l border-input">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <Input 
                        placeholder={form.watch("filterField") === "created_at" ? "DD/MM/AAAA" : "Buscar..."} 
                        {...field} 
                        className={`w-full ${form.watch("filterField") === "created_at" ? "rounded-l-none" : ""}`}
                        onChange={(e) => {
                          field.onChange(e);
                          if (!e.target.value) {
                            setFilteredAdiantamentos(adiantamentos);
                          }
                        }}
                      />
                    </div>
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
      ) : filteredAdiantamentos.length === 0 ? (
        <p className="text-center py-4">Nenhum adiantamento encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Taxas</TableHead>
                <TableHead>Frete</TableHead>
                <TableHead>Estacionamento</TableHead>
                <TableHead>Traslados</TableHead>
                <TableHead>Hospedagem</TableHead>
                <TableHead>Passeios</TableHead>
                <TableHead>Brindes</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdiantamentos.map((adiantamento) => (
                <TableRow key={adiantamento.id}>
                  <TableCell className="font-medium">
                    {formatLocalDate(adiantamento.created_at)}
                  </TableCell>
                  <TableCell>{adiantamento.adianttaxasvalor > 0 ? `${formatCurrency(adiantamento.adianttaxasvalor)} (${adiantamento.adianttaxaspara || "-"})` : "-"}</TableCell>
                  <TableCell>{adiantamento.adiantfretevalor > 0 ? `${formatCurrency(adiantamento.adiantfretevalor)} (${adiantamento.adiantfretepara || "-"})` : "-"}</TableCell>
                  <TableCell>{adiantamento.adiantestacionamentovalor > 0 ? `${formatCurrency(adiantamento.adiantestacionamentovalor)} (${adiantamento.adiantestacionamentopara || "-"})` : "-"}</TableCell>
                  <TableCell>{adiantamento.adianttrasladosvalor > 0 ? `${formatCurrency(adiantamento.adianttrasladosvalor)} (${adiantamento.adianttrasladospara || "-"})` : "-"}</TableCell>
                  <TableCell>{adiantamento.adianthospedagemvalor > 0 ? `${formatCurrency(adiantamento.adianthospedagemvalor)} (${adiantamento.adianthospedagempara || "-"})` : "-"}</TableCell>
                  <TableCell>{adiantamento.adiantpasseiosvalor > 0 ? `${formatCurrency(adiantamento.adiantpasseiosvalor)} (${adiantamento.adiantpasseiospara || "-"})` : "-"}</TableCell>
                  <TableCell>{adiantamento.adiantbrindesvalor > 0 ? `${formatCurrency(adiantamento.adiantbrindesvalor)} (${adiantamento.adiantbrindespara || "-"})` : "-"}</TableCell>
                  <TableCell className="font-bold">{formatCurrency(adiantamento.totaladiantamentos)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </ReportLayout>
  );
};

export default AdiantamentosRelatorio;
