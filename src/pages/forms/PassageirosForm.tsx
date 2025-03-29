
import { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import { usePassageiroForm } from "@/hooks/passageiros/usePassageiroForm";
import PassageiroPersonalInfoSection from "@/components/passageiros/PassageiroPersonalInfoSection";
import PassageiroPaymentSection from "@/components/passageiros/PassageiroPaymentSection";
import DeletePassageiroButton from "@/components/passageiros/DeletePassageiroButton";
import { Save } from "lucide-react";
import { unmask } from "@/utils/masks";

const PassageirosForm = () => {
  const {
    form,
    listaViagens,
    activeTab,
    isPassageiroLoaded,
    vehicleType,
    availableSeats,
    setActiveTab,
    handleViagemChange,
    handleCPFChange,
    handlePagamentoAVistaChange,
    handleDeletePassageiro,
    onSubmit,
    fetchViagens,
    handleDeletePassageiroFromViagem
  } = usePassageiroForm();

  useEffect(() => {
    fetchViagens();
  }, []);

  // Prepara os dados antes de enviar para o servidor, garantindo que CPF e telefone estejam sem formatação
  const handleSubmit = (data) => {
    // Garantir que o CPF e telefone estão sem formatação
    const formattedData = {
      ...data,
      cpfpassageiro: unmask(data.cpfpassageiro),
      telefonepassageiro: data.telefonepassageiro ? unmask(data.telefonepassageiro) : ""
    };
    
    onSubmit(formattedData);
  };

  // Fixed function to handle deleting passenger from trip
  const handleDeleteFromViagem = async () => {
    const viagemId = form.getValues("idviagem");
    if (viagemId) {
      await handleDeletePassageiroFromViagem(viagemId);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full form-section-card">
          <CardHeader className="bg-navy text-white">
            <CardTitle className="text-xl font-inter">Cadastro de Passageiros</CardTitle>
            <CardDescription className="text-gray-200 font-roboto">
              Preencha os dados do passageiro
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="dados-pessoais">Dados Pessoais</TabsTrigger>
                    <TabsTrigger value="pagamento">Pagamento</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="dados-pessoais" className="space-y-6">
                    <PassageiroPersonalInfoSection 
                      form={form}
                      listaViagens={listaViagens}
                      availableSeats={availableSeats}
                      vehicleType={vehicleType}
                      handleViagemChange={handleViagemChange}
                      handleCPFChange={handleCPFChange}
                    />
                  </TabsContent>
                  
                  <TabsContent value="pagamento" className="space-y-6">
                    <PassageiroPaymentSection
                      form={form}
                      handlePagamentoAVistaChange={handlePagamentoAVistaChange}
                    />
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-between items-center mt-6">
                  {isPassageiroLoaded ? (
                    <div className="flex justify-between w-full space-x-2">
                      <Button type="submit" className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Atualizar Passageiro
                      </Button>
                      <DeletePassageiroButton
                        onDelete={handleDeletePassageiro}
                        isVisible={true}
                      />
                    </div>
                  ) : (
                    <Button type="submit" className="w-full">
                      Cadastrar Passageiro
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PassageirosForm;
