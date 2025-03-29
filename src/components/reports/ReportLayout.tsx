
import { ReactNode } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Printer } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReportLayoutProps {
  title: string;
  children: ReactNode;
  onPrint?: () => void;
  onExport?: () => void;
}

const ReportLayout = ({ title, children, onPrint, onExport }: ReportLayoutProps) => {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleExport = () => {
    if (onExport) {
      console.log(`Iniciando exportação do relatório: ${title}`);
      onExport();
    } else {
      toast({
        title: "Exportação",
        description: "Funcionalidade em desenvolvimento.",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <Card className="mb-6 print:shadow-none print:border-none">
          <CardHeader className="bg-navy text-white print:bg-white print:text-black">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src="/logo2.png" alt="Logo Santo Tour" className="w-[100px] h-[100px]" />
                <CardTitle className="text-2xl font-inter">{title}</CardTitle>
              </div>
              <div className="flex gap-2 print:hidden">
                <Button variant="outline" className="bg-white text-navy hover:bg-gray-100" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
                <Button variant="outline" className="bg-white text-navy hover:bg-gray-100" onClick={handleExport}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Exportar (.xls)
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 print:pt-2">
            <div className="print:m-[1cm]">
              {children}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ReportLayout;
