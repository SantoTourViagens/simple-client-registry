
import { z } from "zod";

export const viagemSchema = z.object({
  // Campos obrigatórios
  destino: z.string().max(50, "Destino não pode ter mais que 50 caracteres"),
  datapartida: z.preprocess(
    (val) => {
      if (val instanceof Date) return val;
      if (typeof val === "string") {
        const date = new Date(val);
        return !isNaN(date.getTime()) ? date : new Date();
      }
      return new Date();
    },
    z.date({
      required_error: "Data de partida é obrigatória"
    }).refine((date) => !isNaN(date.getTime()), {
      message: "Data de partida inválida",
    })
  ),
  dataretorno: z.preprocess(
    (val) => {
      if (val instanceof Date) return val;
      if (typeof val === "string") {
        const date = new Date(val);
        return !isNaN(date.getTime()) ? date : new Date();
      }
      return new Date();
    },
    z.date({
      required_error: "Data de retorno é obrigatória"
    }).refine((date) => !isNaN(date.getTime()), {
      message: "Data de retorno inválida",
    })
  ),
  tipoveiculo: z.enum(["Van", "Ônibus", "Semi Leito", "Microônibus", "Carro"]),
  frete: z.coerce.number().min(0),
  precosugerido: z.coerce.number().min(0),

  // Campos opcionais
  cidadesvisitar: z.string().max(50, "Cidades a visitar não pode ter mais que 50 caracteres").nullable(),
  
  // Taxas
  taxacidade: z.coerce.number().min(0).optional().default(0),
  taxaguialocal: z.coerce.number().min(0).optional().default(0),
  outrastaxasdescricao: z.string().max(50).nullable(),
  outrastaxasvalor: z.coerce.number().min(0).optional().default(0),
  totaltaxas: z.coerce.number().min(0).optional().default(0),
  taxasobservacao: z.string().max(100).nullable(),

  // Transporte
  empresatransporte: z.string().max(50, "Empresa de transporte não pode ter mais que 50 caracteres").nullable(),
  contatoempresa: z.string().max(50).nullable(),
  telefoneempresa: z.string().nullable(),
  qtdeassentos: z.coerce.number().int().min(0).optional().default(0),
  qtdereservadosguias: z.coerce.number().int().min(0).optional().default(0),
  qtdepromocionais: z.coerce.number().int().min(0).optional().default(0),
  qtdenaopagantes: z.coerce.number().int().min(0).optional().default(0),
  qtdepagantes: z.coerce.number().int().min(0).optional().default(0),
  estacionamento: z.coerce.number().min(0).optional().default(0),
  totaldespesastransporte: z.coerce.number().min(0).optional().default(0),

  // Motoristas
  qtdemotoristas: z.coerce.number().int().min(0).optional().default(1),
  qtdealmocosmotoristas: z.coerce.number().int().min(0).optional().default(0),
  qtdejantasmotoristas: z.coerce.number().int().min(0).optional().default(0),
  refeicaomotoristaunitario: z.coerce.number().min(0).optional().default(30),
  totalrefeicaomotorista: z.coerce.number().min(0).optional().default(0),
  qtdedeslocamentosmotoristas: z.coerce.number().int().min(0).optional().default(0),
  deslocamentomotoristaunitario: z.coerce.number().min(0).optional().default(0),
  totaldeslocamentosmotoristas: z.coerce.number().min(0).optional().default(0),
  totaldespesasmotoristas: z.coerce.number().min(0).optional().default(0),
  motoristasobservacao: z.string().max(100).nullable(),

  // Traslados
  traslado1descricao: z.string().max(50).nullable(),
  qtdetraslado1: z.coerce.number().int().min(0).optional().default(0),
  traslado1valor: z.coerce.number().min(0).optional().default(0),
  traslado2descricao: z.string().max(50).nullable(),
  qtdetraslado2: z.coerce.number().int().min(0).optional().default(0),
  traslado2valor: z.coerce.number().min(0).optional().default(0),
  traslado3descricao: z.string().max(50).nullable(),
  qtdetraslado3: z.coerce.number().int().min(0).optional().default(0),
  traslado3valor: z.coerce.number().min(0).optional().default(0),
  totaltraslados: z.coerce.number().min(0).optional().default(0),

  // Hospedagem
  tipohospedagem: z.enum(["Hostel", "Pousada", "Hotel", "Casa", "Chácara"]).optional(),
  qtdehospedes: z.coerce.number().int().min(0).optional().default(0),
  nomehospedagem: z.string().max(50).nullable(),
  contatohospedagem: z.string().max(50).nullable(),
  telefonehospedagem: z.string().nullable(),
  regimehospedagem: z.enum(["Pernoite", "Café da Manhã", "Meia Pensão", "Pensão Completa"]).optional(),
  qtdediarias: z.coerce.number().int().min(0).optional().default(0),
  valordiariaunitario: z.coerce.number().min(0).optional().default(0),
  totaldiarias: z.coerce.number().min(0).optional().default(0),
  outrosservicosdescricao: z.string().max(50).nullable(),
  outrosservicosvalor: z.coerce.number().min(0).optional().default(0),
  totaldespesashospedagem: z.coerce.number().min(0).optional().default(0),
  hospedagemobservacao: z.string().max(100).nullable(),

  // Passeios
  qtdepasseios1: z.coerce.number().int().min(0).optional().default(0),
  descricaopasseios1: z.string().max(50).nullable(),
  valorpasseios1: z.coerce.number().min(0).optional().default(0),
  qtdepasseios2: z.coerce.number().int().min(0).optional().default(0),
  descricaopasseios2: z.string().max(50).nullable(),
  valorpasseios2: z.coerce.number().min(0).optional().default(0),
  qtdepasseios3: z.coerce.number().int().min(0).optional().default(0),
  descricaopasseios3: z.string().max(50).nullable(),
  valorpasseios3: z.coerce.number().min(0).optional().default(0),
  totaldespesaspasseios: z.coerce.number().min(0).optional().default(0),
  passeiosobservacao: z.string().max(100).nullable(),

  // Brindes e extras
  brindesdescricao: z.string().max(50).nullable(),
  qtdebrindes: z.coerce.number().int().min(0).optional().default(0),
  brindesunitario: z.coerce.number().min(0).optional().default(0),
  brindestotal: z.coerce.number().min(0).optional().default(0),
  extras1descricao: z.string().max(50).nullable(),
  extras1valor: z.coerce.number().min(0).optional().default(0),
  extras2descricao: z.string().max(50).nullable(),
  extras2valor: z.coerce.number().min(0).optional().default(0),
  extras3descricao: z.string().max(50).nullable(),
  extras3valor: z.coerce.number().min(0).optional().default(0),
  totaldespesasbrindeesextras: z.coerce.number().min(0).optional().default(0),
  brindeseextrasobservacao: z.string().max(100).nullable(),

  // Sorteios
  sorteio1descricao: z.string().max(50).nullable(),
  sorteio1qtde: z.coerce.number().int().min(0).optional().default(0),
  sorteio1valor: z.coerce.number().min(0).optional().default(0),
  sorteio2descricao: z.string().max(50).nullable(),
  sorteio2qtde: z.coerce.number().int().min(0).optional().default(0),
  sorteio2valor: z.coerce.number().min(0).optional().default(0),
  sorteio3descricao: z.string().max(50).nullable(),
  sorteio3qtde: z.coerce.number().int().min(0).optional().default(0),
  sorteio3valor: z.coerce.number().min(0).optional().default(0),
  totaldespesassorteios: z.coerce.number().min(0).optional().default(0),

  // Outras receitas
  outrasreceitas1descricao: z.string().max(50).nullable(),
  outrasreceitas1valor: z.coerce.number().min(0).optional().default(0),
  outrasreceitas2descricao: z.string().max(50).nullable(),
  outrasreceitas2valor: z.coerce.number().min(0).optional().default(0),
  totaloutrasreceitas: z.coerce.number().min(0).optional().default(0),
  outrasreceitasobservacao: z.string().max(100).nullable(),

  // Despesas Diversas
  despesasdiversas: z.coerce.number().min(0).optional().default(0),
  observacaodespesasdiversas: z.string().max(100).nullable(),

  // Campos calculados (Resultados)
  despesatotal: z.coerce.number().min(0).optional().default(0),
  pontoequilibrio: z.coerce.number().min(0).optional().default(0),
  receitatotal: z.coerce.number().min(0).optional().default(0),
  lucrobruto: z.coerce.number().min(0).optional().default(0),
});

export type ViagemFormValues = z.infer<typeof viagemSchema>;

export interface CalculatedValues {
  totaldespesastaxas: number;
  totaldespesastransporte: number;
  totaldespesasmotoristas: number;
  totaldespesastraslados: number;
  totaldespesashospedagem: number;
  totaldespesaspasseios: number;
  totaldespesasbrindeesextras: number;
  brindestotal: number;
  totaldespesassorteios: number;
  totaloutrasreceitas: number;
  qtdeassentos: number;
  qtdereservadosguias: number;
  qtdepromocionais: number;
  qtdehospedes: number;
  qtdenaopagantes: number;
  qtdepagantes: number;
  qtdebrindes: number; // Certifique-se de que esta propriedade existe
  totalrefeicaomotorista: number;
  totaldeslocamentosmotoristas: number;
  qtdediarias: number;
  totaldiarias: number;
  despesasdiversas: number;
  despesatotal: number;
  pontoequilibrio: number;
  precosugerido: number;
  receitatotal: number;
  lucrobruto: number;
}
