
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface DeletePassageiroButtonProps {
  onDelete: () => Promise<void>;
  isVisible: boolean;
  buttonText?: string;
}

const DeletePassageiroButton = ({ 
  onDelete, 
  isVisible, 
  buttonText = "Excluir Passageiro" 
}: DeletePassageiroButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  if (!isVisible) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete();
      
      toast({
        title: "Operação realizada com sucesso",
        description: "O passageiro foi excluído com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao excluir passageiro:", error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o passageiro.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive" className="flex items-center gap-2">
          <Trash className="h-4 w-4" />
          {buttonText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este passageiro? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Excluindo..." : "Confirmar exclusão"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePassageiroButton;
