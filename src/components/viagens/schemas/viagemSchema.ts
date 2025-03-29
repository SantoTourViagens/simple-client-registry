
import { z } from 'zod';

export const viagemSchemaOptional = z.object({
  tipohospedagem: z.string().optional(),
  regimehospedagem: z.string().optional(),
  
  // Transporte
  contatoempresa: z.string().max(50).optional().nullable(),
  
  // Traslados
  traslado3descricao: z.string().max(50).optional().nullable(),
  
  // Hospedagem
  contatohospedagem: z.string().max(50).optional().nullable(),
  hospedagemobservacao: z.string().max(100).optional().nullable(),
  
  // Passeios
  descricaopasseios1: z.string().max(50).optional().nullable(),
  descricaopasseios2: z.string().max(50).optional().nullable(),
  descricaopasseios3: z.string().max(50).optional().nullable(),
  passeiosobservacao: z.string().max(100).optional().nullable(),
  
  // Brindes e extras
  brindesdescricao: z.string().max(50).optional().nullable(),
  extras1descricao: z.string().max(50).optional().nullable(),
  extras2descricao: z.string().max(50).optional().nullable(),
  extras3descricao: z.string().max(50).optional().nullable(),
  brindeseextrasobservacao: z.string().max(100).optional().nullable(),
  
  // Sorteios
  sorteio1descricao: z.string().max(50).optional().nullable(),
  sorteio2descricao: z.string().max(50).optional().nullable(),
  sorteio3descricao: z.string().max(50).optional().nullable(),
  
  // Outras receitas
  outrasreceitas1descricao: z.string().max(50).optional().nullable(),
  outrasreceitas2descricao: z.string().max(50).optional().nullable(),
});

