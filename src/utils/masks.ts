
// Assuming the following code already exists, adding formatCurrency if not present
export const unmask = (value: string): string => {
  return value ? value.replace(/\D/g, '') : '';
};

export const maskCPF = (cpf: string): string => {
  if (!cpf) return '';
  
  const unmasked = unmask(cpf);
  return unmasked
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14);
};

export const maskPhone = (phone: string): string => {
  if (!phone) return '';
  
  const unmasked = unmask(phone);
  
  if (unmasked.length <= 10) {
    return unmasked
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 14);
  } else {
    return unmasked
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  }
};

export const formatCurrency = (value: number): string => {
  const valorFixo = Number(value.toFixed(2));
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valorFixo);
};

export const parseCurrency = (value: string): number => {
  if (!value) return 0;
  
  const numeroLimpo = value.replace(/[^\d,]/g, '')
                          .replace(/\./g, '')
                          .replace(',', '.');
  
  const numero = parseFloat(numeroLimpo);
  return isNaN(numero) ? 0 : numero;
};

export const maskDate = (date: string): string => {
  if (!date) return '';
  
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    return date;
  }
  
  if (/^\d{4}-\d{2}-\d{2}/.test(date)) {
    const parts = date.split('T')[0].split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  
  const unmasked = unmask(date);
  return unmasked
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .slice(0, 10);
};
