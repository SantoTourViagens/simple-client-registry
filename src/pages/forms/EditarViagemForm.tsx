
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";
import ViagensForm from "./ViagensForm";
import { viagemSchema } from "@/components/viagens/types";

type Viagem = {
  id: string;
  [key: string]: any;
};

const EditarViagemForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [viagemData, setViagemData] = useState<Viagem | null>(null);

  useEffect(() => {
    const fetchViagem = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("viagens")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error("Erro ao carregar dados da viagem");
        navigate("/form/viagens");
        return;
      }

      // Ensure dates are properly converted to Date objects and nullable fields are handled
      const formattedData = {
        ...data,
        datapartida: data.datapartida ? new Date(data.datapartida) : undefined,
        dataretorno: data.dataretorno ? new Date(data.dataretorno) : undefined,
        // Ensure select fields have their values correctly set
        tipoveiculo: data.tipoveiculo || undefined,
        tipohospedagem: data.tipohospedagem || undefined,
        regimehospedagem: data.regimehospedagem || undefined,
        // All nullable string fields stay as null if they are null in the database
        cidadesvisitar: data.cidadesvisitar,
        contatoempresa: data.contatoempresa,
        traslado3descricao: data.traslado3descricao,
        contatohospedagem: data.contatohospedagem,
        hospedagemobservacao: data.hospedagemobservacao,
        descricaopasseios1: data.descricaopasseios1,
        descricaopasseios2: data.descricaopasseios2,
        descricaopasseios3: data.descricaopasseios3,
        passeiosobservacao: data.passeiosobservacao,
        brindesdescricao: data.brindesdescricao,
        extras1descricao: data.extras1descricao,
        extras2descricao: data.extras2descricao,
        extras3descricao: data.extras3descricao,
        brindeseextrasobservacao: data.brindeseextrasobservacao,
        sorteio1descricao: data.sorteio1descricao,
        sorteio2descricao: data.sorteio2descricao,
        sorteio3descricao: data.sorteio3descricao,
        outrasreceitas1descricao: data.outrasreceitas1descricao,
        outrasreceitas2descricao: data.outrasreceitas2descricao,
        outrasreceitasobservacao: data.outrasreceitasobservacao,
        outrastaxasdescricao: data.outrastaxasdescricao,
        motoristasobservacao: data.motoristasobservacao,
        traslado1descricao: data.traslado1descricao,
        traslado2descricao: data.traslado2descricao,
        nomehospedagem: data.nomehospedagem,
        telefonehospedagem: data.telefonehospedagem,
        outrosservicosdescricao: data.outrosservicosdescricao,
        observacaodespesasdiversas: data.observacaodespesasdiversas,
        taxasobservacao: data.taxasobservacao,
        empresatransporte: data.empresatransporte,
        telefoneempresa: data.telefoneempresa
      };

      console.log("Data partida:", formattedData.datapartida);
      console.log("Data retorno:", formattedData.dataretorno);
      console.log("Loaded viagem data:", formattedData);
      console.log("Tipo veículo:", formattedData.tipoveiculo);
      console.log("Tipo hospedagem:", formattedData.tipohospedagem);
      console.log("Regime hospedagem:", formattedData.regimehospedagem);

      setViagemData(formattedData);
    };

    fetchViagem();
  }, [id, navigate]);

  if (!viagemData) {
    return <div>Carregando...</div>;
  }

  return (
    <Layout>
      <ViagensForm initialData={viagemData} isEditing={true} />
    </Layout>
  );
};

export default EditarViagemForm;
