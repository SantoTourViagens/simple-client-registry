
import { useState, useEffect } from "react";
import ReportLayout from "@/components/reports/ReportLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { exportToExcel, setupPrintStyles } from "@/utils/exportUtils";
import { Card, CardContent } from "@/components/ui/card";

interface FinanceiroData {
  totalReceitas: number;
  totalDespesas: number;
  lucroTotal: number;
  viagensLucrativas: number;
  viagensDeficitarias: number;
  viagensRecentes: {
    id: string;
    destino: string;
    datapartida: string;
    receitatotal: number;
    despesatotal: number;
    lucrobruto: number;
  }[];
  passageirosAPagar: {
    id: string;
    nomepassageiro: string;
    nomeviagem: string;
    valorviagem: number;
    valorfaltareceber: number;
  }[];
}

const FinanceiroRelatorio = () => {
  const [data, setData] = useState<FinanceiroData>({
    totalReceitas: 0,
    totalDespesas: 0,
    lucroTotal: 0,
    viagensLucrativas: 0,
    viagensDeficitarias: 0,
    viagensRecentes: [],
    passageirosAPagar: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Buscar viagens
        const { data: viagens, error: viagensError } = await supabase
          .from("viagens")
          .select("id, destino, datapartida, receitatotal, despesatotal, lucrobruto")
          .order("datapartida", { ascending: false });

        if (viagensError) throw viagensError;

        // Buscar passageiros com pendências
        const { data: passageiros, error: passageirosError } = await supabase
          .from("passageiros")
          .select("id, nomepassageiro, nomeviagem, valorviagem, valorfaltareceber")
          .gt("valorfaltareceber", 0)
          .order("valorfaltareceber", { ascending: false });

        if (passageirosError) throw passageirosError;

        // Calcular totais
        const totalReceitas = viagens?.reduce((acc, viagem) => acc + Number(viagem.receitatotal || 0), 0) || 0;
        const totalDespesas = viagens?.reduce((acc, viagem) => acc + Number(viagem.despesatotal || 0), 0) || 0;
        const lucroTotal = viagens?.reduce((acc, viagem) => acc + Number(viagem.lucrobruto || 0), 0) || 0;
        const viagensLucrativas = viagens?.filter(v => Number(v.lucrobruto) > 0).length || 0;
        const viagensDeficitarias = viagens?.filter(v => Number(v.lucrobruto) <= 0).length || 0;
        
        setData({
          totalReceitas,
          totalDespesas,
          lucroTotal,
          viagensLucrativas,
          viagensDeficitarias,
          viagensRecentes: viagens?.slice(0, 5) || [],
          passageirosAPagar: passageiros || []
        });
      } catch (error) {
        console.error("Erro ao buscar dados financeiros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return setupPrintStyles();
  }, []);

  const handleExport = () => {
    // Exportar dados sobre viagens recentes
    const viagensData = data.viagensRecentes.map(viagem => ({
      Destino: viagem.destino,
      "Data de Partida": new Date(viagem.datapartida).toLocaleDateString("pt-BR"),
      "Receita": `R$ ${viagem.receitatotal.toFixed(2)}`,
      "Despesa": `R$ ${viagem.despesatotal.toFixed(2)}`,
      "Lucro": `R$ ${viagem.lucrobruto.toFixed(2)}`
    }));

    // Exportar dados sobre passageiros com pendências
    const passageirosData = data.passageirosAPagar.map(passageiro => ({
      Nome: passageiro.nomepassageiro,
      Viagem: passageiro.nomeviagem,
      "Valor Total": `R$ ${passageiro.valorviagem.toFixed(2)}`,
      "Valor a Receber": `R$ ${passageiro.valorfaltareceber.toFixed(2)}`
    }));

    // Exportar resumo financeiro
    const resumoData = [{
      "Total de Receitas": `R$ ${data.totalReceitas.toFixed(2)}`,
      "Total de Despesas": `R$ ${data.totalDespesas.toFixed(2)}`,
      "Lucro Total": `R$ ${data.lucroTotal.toFixed(2)}`,
      "Viagens Lucrativas": data.viagensLucrativas,
      "Viagens Deficitárias": data.viagensDeficitarias
    }];

    // Exportar todos os dados em planilhas separadas
    // (Simulação - na prática, teríamos que usar uma biblioteca mais robusta)
    exportToExcel([...resumoData, ...viagensData, ...passageirosData], "Relatório_Financeiro");
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <ReportLayout title="Relatório Financeiro" onExport={handleExport}>
      {loading ? (
        <p className="text-center py-4">Carregando dados...</p>
      ) : (
        <div className="space-y-6">
          {/* Resumo financeiro */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Receitas Totais</h3>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(data.totalReceitas)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Despesas Totais</h3>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(data.totalDespesas)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Lucro Total</h3>
                <p className={`text-2xl font-bold ${data.lucroTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(data.lucroTotal)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Estatísticas de viagens */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Estatísticas de Viagens</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-lg">Viagens Lucrativas: <span className="font-bold text-green-600">{data.viagensLucrativas}</span></p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-lg">Viagens Deficitárias: <span className="font-bold text-red-600">{data.viagensDeficitarias}</span></p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Viagens Recentes */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Viagens Recentes</h3>
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Destino</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Receita</TableHead>
                    <TableHead>Despesa</TableHead>
                    <TableHead>Lucro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.viagensRecentes.map((viagem) => (
                    <TableRow key={viagem.id}>
                      <TableCell className="font-medium">{viagem.destino}</TableCell>
                      <TableCell>{new Date(viagem.datapartida).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{formatCurrency(viagem.receitatotal)}</TableCell>
                      <TableCell>{formatCurrency(viagem.despesatotal)}</TableCell>
                      <TableCell className={viagem.lucrobruto >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(viagem.lucrobruto)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Passageiros com pendências de pagamento */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Passageiros com Pendências de Pagamento</h3>
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Viagem</TableHead>
                    <TableHead>Valor da Viagem</TableHead>
                    <TableHead>Valor a Receber</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.passageirosAPagar.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">Não há passageiros com pendências de pagamento.</TableCell>
                    </TableRow>
                  ) : (
                    data.passageirosAPagar.map((passageiro) => (
                      <TableRow key={passageiro.id}>
                        <TableCell className="font-medium">{passageiro.nomepassageiro}</TableCell>
                        <TableCell>{passageiro.nomeviagem}</TableCell>
                        <TableCell>{formatCurrency(passageiro.valorviagem)}</TableCell>
                        <TableCell className="text-red-600">{formatCurrency(passageiro.valorfaltareceber)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </ReportLayout>
  );
};

export default FinanceiroRelatorio;
