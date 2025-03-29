import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription } from "@/components/ui/dialog";
import { ListaViagens } from "@/components/viagens/ListaViagens";
import { DeleteViagemDialog } from "@/components/viagens/DeleteViagemDialog";

const ViagensEntrada = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showListaViagens, setShowListaViagens] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedViagemId, setSelectedViagemId] = useState<string | null>(null);
  const [mode, setMode] = useState<'edit' | 'delete'>('edit');

  const handleDeleteClick = (id: string) => {
    setSelectedViagemId(id);
    setShowDeleteDialog(true);
    setShowListaViagens(false); // Fecha a lista ao abrir o diálogo de confirmação
  };

  const openListaViagens = (mode: 'edit' | 'delete') => {
    setMode(mode);
    setShowListaViagens(true);
    setShowDeleteDialog(false); // Garante que o diálogo de exclusão esteja fechado
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    
    try {
      const { error } = await supabase
        .from('viagens')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Viagem excluída com sucesso",
      });
      
      setShowDeleteDialog(false);
      setSelectedViagemId(null); // Limpa o ID selecionado
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a viagem",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedViagemId) {
      await handleDelete(selectedViagemId);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
        <Card className="w-full form-section-card">
          <CardHeader className="bg-navy text-white p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl font-inter">Viagens</CardTitle>
            <CardDescription className="text-gray-200 font-roboto text-sm sm:text-base">
              Selecione uma opção para gerenciar as viagens
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-8 flex flex-col sm:flex-row gap-3 sm:gap-6">
            <Button 
              onClick={() => navigate("/form/viagens/cadastrar")} 
              className="w-full py-4 sm:py-6 text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3"
            >
              <PlusCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              Cadastrar Viagem
            </Button>
            
            <Button 
              onClick={() => setShowListaViagens(true)}
              variant="secondary"
              className="w-full py-4 sm:py-6 text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3"
            >
              <Edit className="h-5 w-5 sm:h-6 sm:w-6" />
              Editar Viagem
            </Button>
            
            <Button 
              onClick={() => openListaViagens('delete')}
              variant="destructive"
              className="w-full py-4 sm:py-6 text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3"
            >
              <Trash className="h-5 w-5 sm:h-6 sm:w-6" />
              Excluir Viagem
            </Button>
          </CardContent>
        </Card>

        {/* Updated image container with loading handling */}
        <div className="mt-8 flex justify-center min-h-[400px]">
          <img
            src="/logo2.png"
            alt="Logo Santo Tour"
            className="rounded-lg shadow-lg max-w-[200px] max-h-[200px] w-auto h-auto opacity-0 transition-opacity duration-300"
            onLoad={(e) => {
              (e.target as HTMLImageElement).classList.remove('opacity-0');
            }}
            loading="lazy"
          />
        </div>
      </div>

      <Dialog open={showListaViagens} onOpenChange={setShowListaViagens}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl mx-2">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {mode === 'edit' ? 'Selecione uma viagem para editar' : 'Selecione uma viagem para excluir'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'edit' 
                ? 'Escolha a viagem que deseja modificar'
                : 'Escolha a viagem que deseja remover do sistema'
              }
            </DialogDescription>
          </DialogHeader>
          <ListaViagens 
            mode={mode}
            onDelete={handleDeleteClick}
            onEdit={(id) => navigate(`/form/viagens/editar/${id}`)}
          />
        </DialogContent>
      </Dialog>

      <DeleteViagemDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
      />
    </Layout>
  );
};

export default ViagensEntrada;
