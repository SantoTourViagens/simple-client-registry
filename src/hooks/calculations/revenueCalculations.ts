
import { ViagemFormValues } from '@/components/viagens/types';

// Calculate revenue based on custom price
export const recalculateFinancialsWithCustomPrice = (
  precoSugerido: number,
  qtdePagantes: number,
  despesaTotal: number,
  outrasReceitas: number,
  despesasDiversas: number
) => {
  // Calculate total revenue including outrasReceitas
  const receitatotal = (precoSugerido * qtdePagantes) + outrasReceitas;
  
  // Calculate gross profit
  const lucrobruto = receitatotal - despesaTotal;
  
  // Return calculated values
  return {
    receitatotal,
    lucrobruto,
    precosugerido: precoSugerido
  };
};

// Calculate financial summary based on form data
export const calculateFinancialSummary = (
  allExpenses: number,
  qtdePagantes: number,
  outrasReceitas: number, 
  desiredMargin: number = 0.2 // 20% default margin
) => {
  // Calculate break-even point
  const pontoEquilibrio = qtdePagantes > 0 ? allExpenses / qtdePagantes : 0;
  
  // Calculate suggested price with margin
  const precoSugerido = pontoEquilibrio * (1 + desiredMargin);
  
  // Calculate total revenue
  const receitaTotal = (precoSugerido * qtdePagantes) + outrasReceitas;
  
  // Calculate gross profit
  const lucroBruto = receitaTotal - allExpenses;
  
  return {
    pontoequilibrio: pontoEquilibrio,
    precosugerido: precoSugerido,
    receitatotal: receitaTotal,
    lucrobruto: lucroBruto
  };
};
