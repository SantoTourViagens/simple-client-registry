
import { useEffect, useState } from "react";
import { ViagemFormValues, CalculatedValues } from "@/components/viagens/types";
import { differenceInDays } from "date-fns";

export const useCalculateValues = (formData: ViagemFormValues) => {
  const [calculatedValues, setCalculatedValues] = useState<CalculatedValues>({
    totaldespesastaxas: 0,
    totaldespesastransporte: 0,
    totaldespesasmotoristas: 0,
    totaldespesastraslados: 0,
    totaldespesashospedagem: 0,
    totaldespesaspasseios: 0,
    totaldespesasbrindeesextras: 0,
    brindestotal: 0,
    totaldespesassorteios: 0,
    totaloutrasreceitas: 0,
    qtdeassentos: 0,
    qtdereservadosguias: 0,
    qtdepromocionais: 0,
    qtdehospedes: 0,
    qtdenaopagantes: 0,
    qtdepagantes: 0,
    qtdebrindes: 0,
    totalrefeicaomotorista: 0,
    totaldeslocamentosmotoristas: 0,
    qtdediarias: 0,
    totaldiarias: 0,
    despesasdiversas: 0,
    despesatotal: 0,
    pontoequilibrio: 0,
    precosugerido: 0,
    receitatotal: 0,
    lucrobruto: 0,
  });

  useEffect(() => {
    if (!formData) return;

    // Calculate qtde diarias based on dates
    let qtdeDiarias = 0;
    if (formData.datapartida && formData.dataretorno) {
      const partida = new Date(formData.datapartida);
      const retorno = new Date(formData.dataretorno);
      
      // Calculate days difference minus 1 day
      const diffDays = differenceInDays(retorno, partida);
      qtdeDiarias = Math.max(0, diffDays - 1);
    }

    // Calculate vehicle capacities based on vehicle type
    let qtdeAssentos = 0;
    let qtdeReservadosGuias = 0;
    let qtdePromocionais = 0;

    switch (formData.tipoveiculo) {
      case "Van":
        qtdeAssentos = 15;
        qtdeReservadosGuias = 1;
        qtdePromocionais = 0;
        break;
      case "Ônibus":
        qtdeAssentos = 46;
        qtdeReservadosGuias = 2;
        qtdePromocionais = 1;
        break;
      case "Semi Leito":
        qtdeAssentos = 44;
        qtdeReservadosGuias = 2;
        qtdePromocionais = 1;
        break;
      case "Microônibus":
        qtdeAssentos = 28;
        qtdeReservadosGuias = 2;
        qtdePromocionais = 1;
        break;
      case "Carro":
        qtdeAssentos = 7;
        qtdeReservadosGuias = 1;
        qtdePromocionais = 0;
        break;
      default:
        qtdeAssentos = 0;
        qtdeReservadosGuias = 0;
        qtdePromocionais = 0;
    }

    const qtdeNaoPagantes = qtdeReservadosGuias + qtdePromocionais;
    const qtdePagantes = Math.max(0, qtdeAssentos - qtdeNaoPagantes);

    // Calculate total taxas
    const taxaCidade = Number(formData.taxacidade || 0);
    const taxaGuiaLocal = Number(formData.taxaguialocal || 0);
    const outrasTaxas = Number(formData.outrastaxasvalor || 0);
    const estacionamento = Number(formData.estacionamento || 0);
    const totalTaxas = taxaCidade + taxaGuiaLocal + outrasTaxas + estacionamento;

    // Calculate total transporte
    const frete = Number(formData.frete || 0);

    // Calculate total motoristas
    const qtdeMotoristas = Number(formData.qtdemotoristas || 1);
    const qtdeAlmocosMotoristas = Number(formData.qtdealmocosmotoristas || 0);
    const qtdeJantasMotoristas = Number(formData.qtdejantasmotoristas || 0);
    const refeicaoMotoristaUnitario = Number(formData.refeicaomotoristaunitario || 30);
    const totalRefeicaoMotorista = (qtdeAlmocosMotoristas + qtdeJantasMotoristas) * refeicaoMotoristaUnitario;
    
    const qtdeDeslocamentosMotoristas = Number(formData.qtdedeslocamentosmotoristas || 0);
    const deslocamentoMotoristaUnitario = Number(formData.deslocamentomotoristaunitario || 0);
    const totalDeslocamentosMotoristas = qtdeDeslocamentosMotoristas * deslocamentoMotoristaUnitario;
    
    const totalDespesasMotoristas = totalRefeicaoMotorista + totalDeslocamentosMotoristas;

    // Calculate total traslados
    const traslado1Qtde = Number(formData.qtdetraslado1 || 0);
    const traslado1Valor = Number(formData.traslado1valor || 0);
    const traslado2Qtde = Number(formData.qtdetraslado2 || 0);
    const traslado2Valor = Number(formData.traslado2valor || 0);
    const traslado3Qtde = Number(formData.qtdetraslado3 || 0);
    const traslado3Valor = Number(formData.traslado3valor || 0);
    const totalTraslados = (traslado1Qtde * traslado1Valor) + (traslado2Qtde * traslado2Valor) + (traslado3Qtde * traslado3Valor);

    // Calculate total hospedagem
    const valorDiariaUnitario = Number(formData.valordiariaunitario || 0);
    const totalDiarias = qtdeDiarias * valorDiariaUnitario * (qtdeAssentos + qtdeMotoristas);
    const outrosServicosValor = Number(formData.outrosservicosvalor || 0);
    const totalDespesasHospedagem = totalDiarias + outrosServicosValor;

    // Calculate total passeios
    const passeios1Qtde = Number(formData.qtdepasseios1 || 0);
    const passeios1Valor = Number(formData.valorpasseios1 || 0);
    const passeios2Qtde = Number(formData.qtdepasseios2 || 0);
    const passeios2Valor = Number(formData.valorpasseios2 || 0);
    const passeios3Qtde = Number(formData.qtdepasseios3 || 0);
    const passeios3Valor = Number(formData.valorpasseios3 || 0);
    const totalDespesasPasseios = (passeios1Qtde * passeios1Valor) + (passeios2Qtde * passeios2Valor) + (passeios3Qtde * passeios3Valor);

    // Calculate total brindes e extras
    const qtdeBrindes = qtdeAssentos; // Usar qtdeAssentos diretamente
    const brindesUnitario = Number(formData.brindesunitario || 0);
    const brindesTotal = qtdeBrindes * brindesUnitario;
    const extras1Valor = Number(formData.extras1valor || 0);
    const extras2Valor = Number(formData.extras2valor || 0);
    const extras3Valor = Number(formData.extras3valor || 0);
    const totalDespesasBrindesEExtras = brindesTotal + extras1Valor + extras2Valor + extras3Valor;

    // Calculate total sorteios
    const sorteio1Qtde = Number(formData.sorteio1qtde || 0);
    const sorteio1Valor = Number(formData.sorteio1valor || 0);
    const sorteio2Qtde = Number(formData.sorteio2qtde || 0);
    const sorteio2Valor = Number(formData.sorteio2valor || 0);
    const sorteio3Qtde = Number(formData.sorteio3qtde || 0);
    const sorteio3Valor = Number(formData.sorteio3valor || 0);
    const totalDespesasSorteios = (sorteio1Qtde * sorteio1Valor) + (sorteio2Qtde * sorteio2Valor) + (sorteio3Qtde * sorteio3Valor);

    // Calculate other revenues total
    const outrasReceitas1 = Number(formData.outrasreceitas1valor || 0);
    const outrasReceitas2 = Number(formData.outrasreceitas2valor || 0);
    const totalOutrasReceitas = outrasReceitas1 + outrasReceitas2;

    // Calculate despesas diversas
    const despesasDiversas = Number(formData.despesasdiversas || 0);

    // Calculate total despesas transporte
    const totalDespesasTransporte = frete + totalDespesasMotoristas + totalTraslados;

    // Calculate total despesas
    const despesaTotal = totalTaxas + totalDespesasTransporte + totalDespesasHospedagem + 
                     totalDespesasPasseios + totalDespesasBrindesEExtras + totalDespesasSorteios + despesasDiversas;

    // Calculate ponto de equilibrio
    const pontoEquilibrio = qtdePagantes > 0 ? despesaTotal / qtdePagantes : 0;

    // Calculate preco sugerido - now with 20% margin
    // Importante: Só calcular se não existe um valor no formulário ou valor é zero
    // Isso evita sobrescrever um valor editado manualmente
    let precoSugerido = pontoEquilibrio * 1.2;
    
    // Se já existe um valor no formulário e não é zero, mantenha esse valor
    if (formData.precosugerido && formData.precosugerido > 0) {
      precoSugerido = Number(formData.precosugerido);
      console.log("Usando o preço sugerido do formulário:", precoSugerido);
    } else {
      console.log("Calculando novo preço sugerido:", precoSugerido);
    }

    // Calculate receita total baseado no precoSugerido atual (que pode ser o editado manualmente)
    const receitaTotal = precoSugerido * qtdePagantes + totalOutrasReceitas;

    // Calculate lucro bruto
    const lucroBruto = receitaTotal - despesaTotal;

    setCalculatedValues({
      totaldespesastaxas: totalTaxas,
      totaldespesastransporte: totalDespesasTransporte,
      totaldespesasmotoristas: totalDespesasMotoristas,
      totaldespesastraslados: totalTraslados,
      totaldespesashospedagem: totalDespesasHospedagem,
      totaldespesaspasseios: totalDespesasPasseios,
      totaldespesasbrindeesextras: totalDespesasBrindesEExtras,
      brindestotal: brindesTotal,
      totaldespesassorteios: totalDespesasSorteios,
      totaloutrasreceitas: totalOutrasReceitas,
      qtdeassentos: qtdeAssentos,
      qtdereservadosguias: qtdeReservadosGuias,
      qtdepromocionais: qtdePromocionais,
      qtdehospedes: qtdeAssentos,
      qtdenaopagantes: qtdeNaoPagantes,
      qtdepagantes: qtdePagantes,
      qtdebrindes: qtdeBrindes,
      totalrefeicaomotorista: totalRefeicaoMotorista,
      totaldeslocamentosmotoristas: totalDeslocamentosMotoristas,
      qtdediarias: qtdeDiarias,
      totaldiarias: totalDiarias,
      despesasdiversas: despesasDiversas,
      despesatotal: despesaTotal,
      pontoequilibrio: pontoEquilibrio,
      precosugerido: precoSugerido,
      receitatotal: receitaTotal,
      lucrobruto: lucroBruto,
    });
  }, [formData]);

  return calculatedValues;
};
