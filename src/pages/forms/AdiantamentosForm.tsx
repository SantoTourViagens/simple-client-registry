
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
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Trash } from "lucide-react";
import { NumericInput } from "@/components/ui/numeric-input";
import { useAdiantamentoForm } from "@/hooks/adiantamentos/useAdiantamentoForm";
import { DatePicker } from "@/components/ui/date-picker";
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

const AdiantamentosForm = () => {
  const {
    form,
    listaClientes,
    listaViagens,
    activeTab,
    isAdiantamentoLoaded,
    adiantamentoId,
    setActiveTab,
    handleClienteChange,
    handleViagemChange,
    handleDeleteAdiantamento,
    onSubmit,
    fetchClientes,
    fetchViagens
  } = useAdiantamentoForm();

  useEffect(() => {
    fetchClientes();
    fetchViagens();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full">
          <CardHeader className="bg-navy text-white">
            <CardTitle className="text-xl font-inter">Registro de Adiantamentos</CardTitle>
            <CardDescription className="text-gray-200 font-roboto">
              Preencha os detalhes do adiantamento
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="idcliente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-inter font-medium">Cliente</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleClienteChange(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o cliente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {listaClientes.map((cliente) => (
                              <SelectItem key={cliente.value} value={cliente.value}>
                                {cliente.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="idviagem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-inter font-medium">Viagem</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleViagemChange(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a viagem" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {listaViagens.map((viagem) => (
                              <SelectItem key={viagem.value} value={viagem.value}>
                                {viagem.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="dataadiantamento"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data do Adiantamento</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>Escolha uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => {
                                field.onChange(date ? date.toISOString() : '');
                              }}
                              disabled={(date) =>
                                date > new Date() || date < new Date("2023-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="valoradiantamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-inter font-medium">Valor do Adiantamento</FormLabel>
                        <FormControl>
                          <NumericInput
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            className="font-roboto"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="observacoes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-inter font-medium">Observações</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Observações adicionais"
                            {...field}
                            className="font-roboto"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between items-center mt-6">
                  <Button type="submit" className="flex-1">
                    {isAdiantamentoLoaded ? "Atualizar Adiantamento" : "Registrar Adiantamento"}
                  </Button>
                  
                  {isAdiantamentoLoaded && adiantamentoId && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" type="button" className="ml-4">
                          <Trash className="h-4 w-4 mr-2" />
                          Excluir Adiantamento
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este adiantamento? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAdiantamento}>
                            Confirmar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

export default AdiantamentosForm;
