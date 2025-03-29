
// src\pages\forms\ViagensForm.tsx
import { useEffect, useMemo, useCallback, useState } from "react"; 
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { viagemSchema, ViagemFormValues } from "@/components/viagens/types";
import { useCalculateValues } from "@/hooks/useCalculateValues";
import { useParams, useNavigate } from "react-router-dom";
import { processFormData } from "@/utils/form-helpers";

// Import sections - use dynamic imports if needed
import {
  GeneralInfoSection,
  TaxasSection,
  TransporteSection,
  MotoristasSection,
  TrasladosSection,
  HospedagemSection,
  PasseiosSection,
  BrindesExtrasSection,
  SorteiosSection,
  OutrasReceitasSection,
  DespesasDiversasSection,
  ResultadosSection,
} from "@/components/viagens/sections";

interface ViagensFormProps {
  initialData?: any;
  isEditing?: boolean;
}

const ViagensForm = ({ initialData, isEditing }: ViagensFormProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  // Estado para controlar se o preço sugerido foi editado manualmente
  const [precoSugeridoEditado, setPrecoSugeridoEditado] = useState(false);
  
  // Memoize default values
  const defaultValues = useMemo(() => ({
    despesasdiversas: 0,
    taxasobservacao: "", // Adicionando valor padrão para taxasobservacao
    contatoempresa: null,
    traslado3descricao: null,
    contatohospedagem: null,
    hospedagemobservacao: null,
    cidadesvisitar: null, // Alterado para null para consistência
    outrastaxasdescricao: null,
    motoristasobservacao: null,
    traslado1descricao: null,
    traslado2descricao: null,
    nomehospedagem: null,
    telefonehospedagem: null,
    outrosservicosdescricao: null,
    observacaodespesasdiversas: null,
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
    outrasreceitasobservacao: null
  }), []);
  
  const form = useForm<ViagemFormValues>({
    resolver: zodResolver(viagemSchema),
    defaultValues,
    mode: "onBlur", // Changed to onBlur for better performance
    criteriaMode: "all", // Show all validation errors
    shouldFocusError: true,
  });

  // Only watch fields that affect calculations
  const formValues = form.watch();
  
  // Use the calculation hook
  const calculatedValues = useCalculateValues(formValues);

  // Memoize the update function to prevent unnecessary re-renders
  const updateCalculatedValues = useCallback((values: any) => {
    if (!values) return;
    
    // Update all calculated values in the form, exceto precosugerido se foi editado manualmente
    Object.entries(values).forEach(([key, value]) => {
      // Não atualizar precosugerido se foi editado manualmente
      if (key === 'precosugerido' && precoSugeridoEditado) {
        return;
      }
      
      form.setValue(key as any, value, {
        shouldDirty: false,
        shouldValidate: false
      });
    });
  }, [form, precoSugeridoEditado]);

  // Update calculated values with debounce
  useEffect(() => {
    if (!calculatedValues) return;
    
    const timer = setTimeout(() => {
      updateCalculatedValues(calculatedValues);
    }, 500); // Increased delay to reduce frequency of updates
    
    return () => clearTimeout(timer);
  }, [calculatedValues, updateCalculatedValues]);

  // Fetch viagem data
  const fetchViagem = useCallback(async (viagemId: string) => {
    const { data, error } = await supabase
      .from("viagens")
      .select("*")
      .eq("id", viagemId)
      .single();

    if (error) {
      toast({
        title: "Erro ao carregar viagem",
        description: "Não foi possível carregar os dados da viagem.",
        variant: "destructive",
      });
      navigate("/form/viagens");
      return null;
    }

    return data;
  }, [toast, navigate]);

  // Load viagem data
  useEffect(() => {
    const carregarViagem = async () => {
      if (!id && !initialData) return;

      try {
        const viagemData = initialData || await fetchViagem(id as string);
        
        if (viagemData) {
          // Convert string dates to Date objects and handle nullable fields
          const formData = {
            ...viagemData,
            datapartida: new Date(viagemData.datapartida + 'T12:00:00'),
            dataretorno: new Date(viagemData.dataretorno + 'T12:00:00'),
            tipoveiculo: viagemData.tipoveiculo as "Van" | "Ônibus" | "Semi Leito" | "Microônibus" | "Carro",
            // Default values for null fields
            taxasobservacao: viagemData.taxasobservacao || "", // Garantir que taxasobservacao seja uma string vazia se for nulo
            contatoempresa: viagemData.contatoempresa || null,
            traslado3descricao: viagemData.traslado3descricao || null,
            contatohospedagem: viagemData.contatohospedagem || null,
            hospedagemobservacao: viagemData.hospedagemobservacao || null,
            cidadesvisitar: viagemData.cidadesvisitar || null,
            outrastaxasdescricao: viagemData.outrastaxasdescricao || null,
            motoristasobservacao: viagemData.motoristasobservacao || null,
            traslado1descricao: viagemData.traslado1descricao || null,
            traslado2descricao: viagemData.traslado2descricao || null,
            nomehospedagem: viagemData.nomehospedagem || null,
            telefonehospedagem: viagemData.telefonehospedagem || null,
            outrosservicosdescricao: viagemData.outrosservicosdescricao || null,
            observacaodespesasdiversas: viagemData.observacaodespesasdiversas || null,
            descricaopasseios1: viagemData.descricaopasseios1 || null,
            descricaopasseios2: viagemData.descricaopasseios2 || null,
            descricaopasseios3: viagemData.descricaopasseios3 || null,
            passeiosobservacao: viagemData.passeiosobservacao || null,
            brindesdescricao: viagemData.brindesdescricao || null,
            extras1descricao: viagemData.extras1descricao || null,
            extras2descricao: viagemData.extras2descricao || null,
            extras3descricao: viagemData.extras3descricao || null,
            brindeseextrasobservacao: viagemData.brindeseextrasobservacao || null,
            sorteio1descricao: viagemData.sorteio1descricao || null,
            sorteio2descricao: viagemData.sorteio2descricao || null,
            sorteio3descricao: viagemData.sorteio3descricao || null,
            outrasreceitas1descricao: viagemData.outrasreceitas1descricao || null,
            outrasreceitas2descricao: viagemData.outrasreceitas2descricao || null,
            outrasreceitasobservacao: viagemData.outrasreceitasobservacao || null
          };
          
          form.reset(formData);
          
          // Se tem preço sugerido preenchido e é diferente de zero, considerar como editado manualmente
          if (viagemData.precosugerido && viagemData.precosugerido > 0) {
            setPrecoSugeridoEditado(true);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar viagem:", error);
      }
    };

    carregarViagem();
  }, [id, initialData, form, fetchViagem]);

  // Handle form submission
  const onSubmit = useCallback(async (data: ViagemFormValues) => {
    console.log("Formulário submetido com dados:", data);
    console.log("ID da viagem:", id);
    console.log("isEditing:", isEditing);
    
    try {
      // Incluir valores calculados, mas preservar o precosugerido do formulário
      const completeData = {
        ...calculatedValues,
        ...data, // Colocando data por último para garantir que os valores do formulário tenham prioridade
      };
      
      // Process form data to ensure proper formats for DB, converting Dates to strings
      const viagemData = processFormData(completeData);
      
      // Validate required fields
      if (!viagemData.datapartida || !viagemData.dataretorno || !viagemData.destino || !viagemData.tipoveiculo) {
        throw new Error("Campos obrigatórios ausentes");
      }
      
      console.log("Saving data:", viagemData);
      
      if (id || isEditing) {
        // Update existing viagem
        const viagemId = id || initialData?.id;
        
        console.log("Atualizando viagem com ID:", viagemId);
        console.log("Dados para atualização:", viagemData);
        
        if (!viagemId) {
          throw new Error("ID da viagem não encontrado para atualização");
        }
        
        // Casting to any to bypass type checking, as we've already ensured the data is correctly formatted
        const { data: updateData, error } = await supabase
          .from("viagens")
          .update(viagemData as any)
          .eq("id", viagemId)
          .select();
  
        if (error) {
          console.error("Erro na atualização Supabase:", error);
          throw error;
        }
        
        console.log("Atualização bem-sucedida:", updateData);
  
        toast({
          title: "Viagem atualizada com sucesso!",
          description: "As alterações foram salvas no banco de dados.",
        });
      } else {
        // Create new viagem
        // Casting to any to bypass type checking, as we've already ensured the data is correctly formatted
        const { error } = await supabase
          .from("viagens")
          .insert(viagemData as any);
  
        if (error) throw error;
  
        toast({
          title: "Viagem cadastrada com sucesso!",
          description: "Os dados foram salvos no banco de dados.",
        });
      }
  
      // Navigate after success
      navigate("/form/viagens");
      
    } catch (error: any) {
      console.error("Erro na operação:", error);
      toast({
        title: id ? "Erro ao atualizar viagem" : "Erro ao cadastrar viagem",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    }
  }, [id, isEditing, initialData, calculatedValues, toast, navigate]);

  // Adicionar um efeito para detectar quando o preço sugerido é editado no ResultadosSection
  useEffect(() => {
    // Criar um evento personalizado para comunicação entre componentes
    const handlePrecoSugeridoEditado = () => {
      setPrecoSugeridoEditado(true);
      console.log("Preço sugerido foi editado manualmente");
    };

    // Adicionar listener para o evento
    window.addEventListener('precoSugeridoEditado', handlePrecoSugeridoEditado);

    // Limpar listener quando o componente for desmontado
    return () => {
      window.removeEventListener('precoSugeridoEditado', handlePrecoSugeridoEditado);
    };
  }, []);

  // Memorize form rendering to prevent unnecessary re-renders
  const formContent = useMemo(() => (
    <FormProvider {...form}>
      <form onSubmit={(e) => {
        console.log("Form submitted, validation errors:", form.formState.errors);
        form.handleSubmit(onSubmit)(e);
      }} className="space-y-8">
        <GeneralInfoSection />
        <TaxasSection calculatedValues={calculatedValues} />
        <TransporteSection calculatedValues={calculatedValues} />
        <MotoristasSection calculatedValues={calculatedValues} />
        <TrasladosSection calculatedValues={calculatedValues} />
        <HospedagemSection calculatedValues={calculatedValues} />
        <PasseiosSection calculatedValues={calculatedValues} />
        <BrindesExtrasSection calculatedValues={calculatedValues} />
        <SorteiosSection calculatedValues={calculatedValues} />
        <OutrasReceitasSection calculatedValues={calculatedValues} />
        <DespesasDiversasSection calculatedValues={calculatedValues} />
        <ResultadosSection calculatedValues={calculatedValues} />

        {/* Display validation errors */}
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Erros de validação:</strong>
            <ul className="mt-2">
              {Object.entries(form.formState.errors).map(([field, error]) => (
                <li key={field}>
                  Campo {field}: {error?.message?.toString()}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-navy hover:bg-navy/90"
            onClick={() => {
              console.log("Botão clicado - Form válido:", form.formState.isValid);
              console.log("Validation errors:", form.formState.errors);
            }}
          >
            {id || isEditing ? "Atualizar Viagem" : "Cadastrar Viagem"}
          </Button>
        </div>
      </form>
    </FormProvider>
  ), [form, calculatedValues, onSubmit, id, isEditing]);

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full form-section-card">
          <CardHeader className="bg-navy text-white">
            <CardTitle className="text-xl font-inter">Cadastro de Viagens</CardTitle>
            <CardDescription className="text-gray-200 font-roboto">
              Preencha os dados da viagem
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {formContent}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ViagensForm;
