
import { formatDateForDB } from "./dateUtils";
import { ViagemFormValues } from "@/components/viagens/types";

// Helper for processing form data for submission
export const processFormData = <T extends Record<string, any>>(data: T, additionalFields?: Record<string, any>): Record<string, any> => {
  const processedData: Record<string, any> = {};
  
  // Process all fields from the original data
  for (const [key, value] of Object.entries(data)) {
    // Handle date objects by converting them to DB format
    if (value instanceof Date) {
      processedData[key] = formatDateForDB(value);
    } else if (value === undefined) {
      // Treat undefined as null for database consistency
      processedData[key] = null;
    } else {
      // Maintain original value for other cases (including null)
      processedData[key] = value;
    }
  }
  
  // Add any additional fields
  if (additionalFields) {
    Object.assign(processedData, additionalFields);
  }
  
  // Ensure all calculated fields are properly included
  const calculatedFields = [
    'totaltaxas', 'qtdeassentos', 'qtdereservadosguias', 'qtdepromocionais',
    'qtdenaopagantes', 'qtdepagantes', 'totalrefeicaomotorista',
    'totaldeslocamentosmotoristas', 'totaldespesasmotoristas', 'totaltraslados',
    'totaldespesastransporte', 'qtdediarias', 'totaldespesashospedagem',
    'totaldespesaspasseios', 'qtdebrindes', 'brindestotal', 
    'totaldespesasbrindeesextras', 'totaldespesassorteios', 'totaloutrasreceitas',
    'despesatotal', 'precosugerido', 'pontoequilibrio', 'receitatotal', 
    'lucrobruto', 'qtdehospedes', 'totaldiarias'
  ];
  
  // Double-check that datapartida and dataretorno are strings, not Date objects
  // This ensures they're in the correct format for the database
  if (processedData.datapartida instanceof Date) {
    processedData.datapartida = formatDateForDB(processedData.datapartida);
  }
  
  if (processedData.dataretorno instanceof Date) {
    processedData.dataretorno = formatDateForDB(processedData.dataretorno);
  }
  
  // Log for debugging purposes
  console.log("Processed data:", processedData);
  
  return processedData;
};

// Type-safe function to rename keys in a schema
export function renameFields<T extends Record<string, any>>(
  obj: T, 
  fieldMap: Record<string, keyof T>
): Partial<T> {
  const result: Partial<T> = {};
  
  for (const [oldKey, newKey] of Object.entries(fieldMap)) {
    if (oldKey in obj) {
      result[newKey] = obj[oldKey as keyof T];
    }
  }
  
  return result;
}
