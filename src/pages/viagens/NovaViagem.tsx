
import React from 'react';
import ViagensForm from '../forms/ViagensForm';
import { ViagemFormValues } from '@/components/viagens/types';

const NovaViagem = () => {
  // Providing default empty initialData to ensure all nullable fields are properly handled
  const initialData: Partial<ViagemFormValues> = {
    // Ensure all nullable string fields are initialized as null
    contatoempresa: null,
    traslado3descricao: null,
    contatohospedagem: null,
    hospedagemobservacao: null,
    descricaopasseios1: null,
    descricaopasseios2: null,
    descricaopasseios3: null,
    passeiosobservacao: null,
    brindesdescricao: null,
    extras1descricao: null,
    extras2descricao: null,
    extras3descricao: null,
    brindeseextrasobservacao: null,
    sorteio1descricao: null,
    sorteio2descricao: null,
    sorteio3descricao: null,
    outrasreceitas1descricao: null,
    outrasreceitas2descricao: null,
    outrasreceitasobservacao: null,
    // Initialize strings that should be null when empty
    cidadesvisitar: null,
    outrastaxasdescricao: null,
    motoristasobservacao: null,
    traslado1descricao: null,
    traslado2descricao: null,
    nomehospedagem: null,
    telefonehospedagem: null,
    outrosservicosdescricao: null,
    observacaodespesasdiversas: null,
    taxasobservacao: null,
    empresatransporte: null,
    telefoneempresa: null,
    // Initialize calculation fields with zero
    totaltaxas: 0,
    qtdeassentos: 0,
    qtdereservadosguias: 0,
    qtdepromocionais: 0,
    qtdenaopagantes: 0,
    qtdepagantes: 0,
    totalrefeicaomotorista: 0,
    totaldeslocamentosmotoristas: 0,
    totaldespesasmotoristas: 0,
    totaltraslados: 0, 
    totaldespesastransporte: 0,
    qtdediarias: 0,
    totaldespesashospedagem: 0,
    totaldespesaspasseios: 0,
    qtdebrindes: 0,
    brindestotal: 0,
    totaldespesasbrindeesextras: 0,
    totaldespesassorteios: 0,
    totaloutrasreceitas: 0,
    despesatotal: 0,
    precosugerido: 0,
    pontoequilibrio: 0,
    receitatotal: 0,
    lucrobruto: 0,
    qtdehospedes: 0,
    totaldiarias: 0,
    // Set default values for required fields (these will be overwritten by user input)
    destino: '', 
    frete: 0,
    tipoveiculo: 'Van' as const
  };
  
  return <ViagensForm initialData={initialData} />;
};

export default NovaViagem;
