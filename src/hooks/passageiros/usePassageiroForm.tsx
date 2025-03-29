// src\hooks\passageiros\usePassageiroForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PassageiroFormValues, passageiroSchema } from "@/components/passageiros/types";
import { unmask } from "@/utils/masks";
import { useViagemInfo } from "./useViagemInfo";
import { usePassageiroData } from "./usePassageiroData";
import { usePaymentCalculations } from "./usePaymentCalculations";

export const usePassageiroForm = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dados-pessoais");
  
  const {
    listaViagens,
    vehicleType,
    totalSeats,
    availableSeats,
    fetchViagens,
    fetchViagemDetails,
    fetchTakenSeats,
    setVehicleType
  } = useViagemInfo();
  
  const {
    passageiroId,
    isPassageiroLoaded,
    setPassageiroId,
    setIsPassageiroLoaded,
    fetchPassageiroData,
    fetchIndicadorData,
    deletePassageiro
  } = usePassageiroData();
  
  const { recalculateValorFaltaReceber } = usePaymentCalculations();

  const form = useForm<PassageiroFormValues>({
    resolver: zodResolver(passageiroSchema),
    defaultValues: {
      idviagem: "",
      nomeviagem: "",
      cpfpassageiro: "",
      nomepassageiro: "",
      telefonepassageiro: "",
      bairropassageiro: "",
      cidadepassageiro: "",
      localembarquepassageiro: "",
      enderecoembarquepassageiro: "",
      passageiroindicadopor: "",
      dataviagem: new Date().toISOString().split('T')[0],
      valorviagem: 0,
      pagamentoavista: true,
      datapagamentoavista: "",
      formapagamentoavista: "Dinheiro",
      valorfaltareceber: 0,
      datasinal: "",
      valorsinal: 0,
      dataparcela2: "",
      valorparcela2: 0,
      dataparcela3: "",
      valorparcela3: 0,
      dataparcela4: "",
      valorparcela4: 0,
      dataparcela5: "",
      valorparcela5: 0,
      dataparcela6: "",
      valorparcela6: 0,
      dataparcela7: "",
      valorparcela7: 0,
      dataparcela8: "",
      valorparcela8: 0,
      dataparcela9: "",
      valorparcela9: 0,
      dataparcela10: "",
      valorparcela10: 0,
      dataparcela11: "",
      valorparcela11: 0,
      dataparcela12: "",
      valorparcela12: 0,
      poltrona: "",
      tipoveiculo: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: PassageiroFormValues) => {
    try {
      const nomeViagem = listaViagens.find(v => v.value === data.idviagem)?.label || "";
      
      const cleanDateValue = (dateStr: string | null | undefined) => {
        return dateStr && dateStr.trim() !== "" ? dateStr : null;
      };
      
      // Create the data object that matches the Supabase table structure
      const passageiroData = {
        // We need to match the exact column names from the database
        cpfpassageiro: data.cpfpassageiro,
        nomepassageiro: data.nomepassageiro,
        telefonepassageiro: data.telefonepassageiro,
        bairropassageiro: data.bairropassageiro,
        cidadepassageiro: data.cidadepassageiro,
        localembarquepassageiro: data.localembarquepassageiro,
        enderecoembarquepassageiro: data.enderecoembarquepassageiro,
        passageiroindicadopor: data.passageiroindicadopor || null,
        nomeviagem: nomeViagem,
        dataviagem: data.dataviagem,
        valorviagem: data.valorviagem,
        pagamentoavista: data.pagamentoavista,
        datapagamentoavista: cleanDateValue(data.datapagamentoavista),
        formapagamentoavista: data.formapagamentoavista,
        valorfaltareceber: data.valorfaltareceber,
        datasinal: cleanDateValue(data.datasinal),
        valorsinal: data.valorsinal,
        dataparcela2: cleanDateValue(data.dataparcela2),
        valorparcela2: data.valorparcela2,
        dataparcela3: cleanDateValue(data.dataparcela3),
        valorparcela3: data.valorparcela3,
        dataparcela4: cleanDateValue(data.dataparcela4),
        valorparcela4: data.valorparcela4,
        dataparcela5: cleanDateValue(data.dataparcela5),
        valorparcela5: data.valorparcela5,
        dataparcela6: cleanDateValue(data.dataparcela6),
        valorparcela6: data.valorparcela6,
        dataparcela7: cleanDateValue(data.dataparcela7),
        valorparcela7: data.valorparcela7,
        dataparcela8: cleanDateValue(data.dataparcela8),
        valorparcela8: data.valorparcela8,
        dataparcela9: cleanDateValue(data.dataparcela9),
        valorparcela9: data.valorparcela9,
        dataparcela10: cleanDateValue(data.dataparcela10),
        valorparcela10: data.valorparcela10,
        dataparcela11: cleanDateValue(data.dataparcela11),
        valorparcela11: data.valorparcela11,
        dataparcela12: cleanDateValue(data.dataparcela12),
        valorparcela12: data.valorparcela12,
        poltrona: data.poltrona,
        idviagem: data.idviagem // Adding idviagem to match database field
      };
      
      let error;
      
      console.log('ID da viagem antes da inserção:', data.idviagem);
            console.log('Dados completos:', passageiroData);
      
            if (passageiroId) {
        const { error: updateError } = await supabase
          .from('passageiros')
          .update(passageiroData)
          .eq('id', passageiroId.toString());
        
        error = updateError;
        
        toast({
          title: "Passageiro atualizado com sucesso!",
          description: "Os dados foram atualizados no banco de dados.",
        });
      } else {
        const { data: insertData, error: insertError } = await supabase
          .from('passageiros')
          .insert(passageiroData)
          .select();
        
        console.log('Resposta completa do insert:', { data: insertData, error: insertError });
        
        if (insertError) {
          console.error('Detalhes do erro:', {
            code: insertError.code,
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint
          });
        }
        
        error = insertError;
        
        toast({
          title: "Passageiro cadastrado com sucesso!",
          description: "Os dados foram salvos no banco de dados.",
        });
      }
      
      if (error) throw error;
      
      form.reset();
      setActiveTab("dados-pessoais");
      setPassageiroId(null);
      setIsPassageiroLoaded(false);
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar passageiro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleViagemChange = async (viagemId: string) => {
    if (!viagemId) return;
    
    setPassageiroId(null);
    setIsPassageiroLoaded(false);
    form.reset({
      idviagem: viagemId,
      nomeviagem: "",
      cpfpassageiro: "",
      nomepassageiro: "",
      telefonepassageiro: "",
      bairropassageiro: "",
      cidadepassageiro: "",
      localembarquepassageiro: "",
      enderecoembarquepassageiro: "",
      passageiroindicadopor: "",
      dataviagem: new Date().toISOString().split('T')[0],
      valorviagem: 0,
      pagamentoavista: true,
      datapagamentoavista: "",
      formapagamentoavista: "Dinheiro",
      valorfaltareceber: 0,
      datasinal: "",
      valorsinal: 0,
      dataparcela2: "",
      valorparcela2: 0,
      dataparcela3: "",
      valorparcela3: 0,
      dataparcela4: "",
      valorparcela4: 0,
      dataparcela5: "",
      valorparcela5: 0,
      dataparcela6: "",
      valorparcela6: 0,
      dataparcela7: "",
      valorparcela7: 0,
      dataparcela8: "",
      valorparcela8: 0,
      dataparcela9: "",
      valorparcela9: 0,
      dataparcela10: "",
      valorparcela10: 0,
      dataparcela11: "",
      valorparcela11: 0,
      dataparcela12: "",
      valorparcela12: 0,
      poltrona: "",
      tipoveiculo: "",
    });
    
    const viagemData = await fetchViagemDetails(viagemId);
    
    if (viagemData) {
      form.setValue("idviagem", viagemId);
      if (viagemData.datapartida) {
        form.setValue("dataviagem", viagemData.datapartida);
      }
      
      if (viagemData.precosugerido !== null && viagemData.precosugerido !== undefined) {
        const precoNum = Number(viagemData.precosugerido);
        form.setValue("valorviagem", precoNum);
      }
      
      if (viagemData.tipoveiculo) {
        setVehicleType(viagemData.tipoveiculo);
        form.setValue("tipoveiculo", viagemData.tipoveiculo);
      }
      
      if (!form.getValues("pagamentoavista")) {
        const valorViagem = form.getValues("valorviagem");
        form.setValue("valorfaltareceber", valorViagem);
      }
      
      // Fetch taken seats
      await fetchTakenSeats(viagemId);
    }
  };

  const handleCPFChange = async (cpf: string) => {
    if (cpf.length < 11) {
      form.setValue("passageiroindicadopor", "");
      setPassageiroId(null);
      setIsPassageiroLoaded(false);
      return;
    }
    
    const viagemId = form.getValues("idviagem");
    const currentViagemName = listaViagens.find(v => v.value === viagemId)?.label;
    
    const passageiroData = await fetchPassageiroData(cpf, viagemId, currentViagemName);
    
    if (passageiroData) {
      // If we found a passenger for this trip, load their data
      if (isPassageiroLoaded) {
        Object.keys(passageiroData).forEach((key) => {
          if (key !== 'id' && key !== 'created_at' && key in form.getValues()) {
            const fieldName = key as keyof PassageiroFormValues;
            // @ts-ignore - we know this is safe
            form.setValue(fieldName, passageiroData[key]);
          }
        });
        return;
      }
      
      // If we found client data, load that
      if ('nome' in passageiroData && passageiroData.nome) {
        form.setValue("nomepassageiro", passageiroData.nome || "");
        form.setValue("telefonepassageiro", passageiroData.telefone || "");
        form.setValue("bairropassageiro", passageiroData.bairro || "");
        form.setValue("cidadepassageiro", passageiroData.cidade || "");
        form.setValue("localembarquepassageiro", passageiroData.localembarque || "");
        form.setValue("enderecoembarquepassageiro", passageiroData.enderecoembarque || "");
        
        if (passageiroData.indicadopor) {
          const indicadorData = await fetchIndicadorData(passageiroData.indicadopor);
          
          if (indicadorData?.nome) {
            form.setValue("passageiroindicadopor", indicadorData.nome);
          } else {
            form.setValue("passageiroindicadopor", "Indicador não encontrado");
          }
        } else {
          form.setValue("passageiroindicadopor", "");
        }
      }
    } else {
      form.setValue("passageiroindicadopor", "");
    }
  };

  const handlePagamentoAVistaChange = (value: boolean) => {
    form.setValue("pagamentoavista", value);
    
    if (value) {
      form.setValue("valorfaltareceber", 0);
      const today = new Date().toISOString().split('T')[0];
      form.setValue("datapagamentoavista", today);
    } else {
      const valorViagem = form.getValues("valorviagem");
      const valorSinal = form.getValues("valorsinal") || 0;
      const valorParcela2 = form.getValues("valorparcela2") || 0;
      const valorParcela3 = form.getValues("valorparcela3") || 0;
      const valorParcela4 = form.getValues("valorparcela4") || 0;
      const valorParcela5 = form.getValues("valorparcela5") || 0;
      const valorParcela6 = form.getValues("valorparcela6") || 0;
      const valorParcela7 = form.getValues("valorparcela7") || 0;
      const valorParcela8 = form.getValues("valorparcela8") || 0;
      const valorParcela9 = form.getValues("valorparcela9") || 0;
      const valorParcela10 = form.getValues("valorparcela10") || 0;
      const valorParcela11 = form.getValues("valorparcela11") || 0;
      const valorParcela12 = form.getValues("valorparcela12") || 0;
      
      const valorfaltareceber = recalculateValorFaltaReceber(
        valorViagem, valorSinal, valorParcela2, valorParcela3, valorParcela4, 
        valorParcela5, valorParcela6, valorParcela7, valorParcela8, valorParcela9, 
        valorParcela10, valorParcela11, valorParcela12
      );
      
      form.setValue("valorfaltareceber", valorfaltareceber);
    }
  };
  
  const handleDeletePassageiro = async () => {
    if (!passageiroId) {
      toast({
        title: "Erro ao excluir passageiro",
        description: "Nenhum passageiro selecionado para exclusão.",
        variant: "destructive",
      });
      return;
    }
    
    const success = await deletePassageiro(passageiroId);
    
    if (success) {
      form.reset();
      setActiveTab("dados-pessoais");
      setPassageiroId(null);
      setIsPassageiroLoaded(false);
      
      toast({
        title: "Passageiro excluído com sucesso!",
        description: "O passageiro foi removido do banco de dados.",
      });
    }
  };

  const handleDeletePassageiroFromViagem = async (viagemId: string) => {
    if (!passageiroId || !viagemId) {
      toast({
        title: "Erro ao excluir passageiro da viagem",
        description: "Nenhum passageiro ou viagem selecionado para exclusão.",
        variant: "destructive",
      });
      return;
    }

    console.log(`Attempting to delete passageiro_id: ${passageiroId}, viagem_id: ${viagemId}`);

    try {
      const { error } = await supabase
        .from('passageiros_viagens')
        .delete()
        .eq('passageiro_id', passageiroId)
        .eq('viagem_id', viagemId);

      if (error) throw error;

      toast({
        title: "Passageiro excluído da viagem com sucesso!",
        description: "O passageiro foi removido da viagem no banco de dados.",
      });

      form.reset();
      setActiveTab("dados-pessoais");
      setPassageiroId(null);
      setIsPassageiroLoaded(false);
    } catch (error: any) {
      toast({
        title: "Erro ao excluir passageiro da viagem",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    form,
    listaViagens,
    activeTab,
    passageiroId,
    isPassageiroLoaded,
    vehicleType,
    totalSeats,
    availableSeats,
    setActiveTab,
    handleViagemChange,
    handleCPFChange,
    handlePagamentoAVistaChange,
    handleDeletePassageiro,
    handleDeletePassageiroFromViagem, // Adicionando a nova função ao retorno
    onSubmit,
    fetchViagens
  };
};
