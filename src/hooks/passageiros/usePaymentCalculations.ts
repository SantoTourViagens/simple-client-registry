
export const usePaymentCalculations = () => {
  const recalculateValorFaltaReceber = (
    valorViagem: number,
    valorSinal: number,
    valorParcela2: number = 0,
    valorParcela3: number = 0,
    valorParcela4: number = 0,
    valorParcela5: number = 0,
    valorParcela6: number = 0,
    valorParcela7: number = 0,
    valorParcela8: number = 0,
    valorParcela9: number = 0,
    valorParcela10: number = 0,
    valorParcela11: number = 0,
    valorParcela12: number = 0
  ): number => {
    return valorViagem - valorSinal - valorParcela2 - valorParcela3 - 
           valorParcela4 - valorParcela5 - valorParcela6 - valorParcela7 - 
           valorParcela8 - valorParcela9 - valorParcela10 - valorParcela11 - valorParcela12;
  };

  return {
    recalculateValorFaltaReceber
  };
};
