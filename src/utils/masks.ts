
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
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

// Adding the missing parseCurrency function
export const parseCurrency = (value: string): number => {
  if (!value) return 0;
  
  // Remove currency symbol and any non-numeric characters except for decimal separator
  const sanitized = value.replace(/[^\d,.]/g, '')
                        .replace(/\./g, '')  // Remove thousand separators
                        .replace(',', '.');  // Replace comma with dot for decimal
  
  // Parse to float or return 0 if invalid
  const parsed = parseFloat(sanitized);
  return isNaN(parsed) ? 0 : parsed;
};

