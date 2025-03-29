
import { z } from "zod";

export const passageiroSchema = z.object({
  idviagem: z.string().min(1, { message: "Selecione uma viagem" }),
  nomeviagem: z.string().optional(),
  cpfpassageiro: z.string().min(11, { message: "CPF deve ter 11 dígitos" }).max(14),
  nomepassageiro: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  telefonepassageiro: z.string().optional(),
  bairropassageiro: z.string().min(1, { message: "Bairro é obrigatório" }),
  cidadepassageiro: z.string().min(1, { message: "Cidade é obrigatória" }),
  localembarquepassageiro: z.string().optional(),
  enderecoembarquepassageiro: z.string().optional(),
  passageiroindicadopor: z.string().optional(),
  dataviagem: z.string(),
  valorviagem: z.number().min(0),
  pagamentoavista: z.boolean(),
  datapagamentoavista: z.string().optional(),
  formapagamentoavista: z.string().optional(),
  valorfaltareceber: z.number().min(0),
  datasinal: z.string().optional().nullable(),
  valorsinal: z.number().min(0).optional(),
  dataparcela2: z.string().optional().nullable(),
  valorparcela2: z.number().min(0).optional(),
  dataparcela3: z.string().optional().nullable(),
  valorparcela3: z.number().min(0).optional(),
  dataparcela4: z.string().optional().nullable(),
  valorparcela4: z.number().min(0).optional(),
  dataparcela5: z.string().optional().nullable(),
  valorparcela5: z.number().min(0).optional(),
  dataparcela6: z.string().optional().nullable(),
  valorparcela6: z.number().min(0).optional(),
  dataparcela7: z.string().optional().nullable(),
  valorparcela7: z.number().min(0).optional(),
  dataparcela8: z.string().optional().nullable(),
  valorparcela8: z.number().min(0).optional(),
  dataparcela9: z.string().optional().nullable(),
  valorparcela9: z.number().min(0).optional(),
  dataparcela10: z.string().optional().nullable(),
  valorparcela10: z.number().min(0).optional(),
  dataparcela11: z.string().optional().nullable(),
  valorparcela11: z.number().min(0).optional(),
  dataparcela12: z.string().optional().nullable(),
  valorparcela12: z.number().min(0).optional(),
  poltrona: z.string().optional(),
  tipoveiculo: z.string().optional(),
}).refine((formData) => {
  if (formData && !formData.pagamentoavista) {
    return formData && formData.valorfaltareceber >= 0;
  }
  return true;
}, {
  message: "Valor restante não pode ser negativo",
  path: ["valorfaltareceber"],
});

export type PassageiroFormValues = z.infer<typeof passageiroSchema>;
