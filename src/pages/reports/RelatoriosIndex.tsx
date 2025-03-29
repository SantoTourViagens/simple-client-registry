
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, Users, Plane, Wallet, DollarSign } from "lucide-react";

const RelatoriosIndex = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-6">
          <img src="/logo2.png" alt="Logo Santo Tour" className="w-[100px] h-[100px]" />
          <h2 className="text-2xl font-bold font-inter">Relatórios Disponíveis</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ReportCard 
            title="Relatório de Clientes" 
            description="Lista completa de todos os clientes cadastrados"
            icon={<Users size={24} />}
            href="/relatorios/clientes"
          />

          <ReportCard 
            title="Relatório de Viagens" 
            description="Dados de todas as viagens e resultados financeiros"
            icon={<Plane size={24} />}
            href="/relatorios/viagens"
          />

          <ReportCard 
            title="Relatório de Passageiros" 
            description="Lista de passageiros e status de pagamento"
            icon={<FileText size={24} />}
            href="/relatorios/passageiros"
          />

          <ReportCard 
            title="Relatório de Adiantamentos" 
            description="Registro de todos os adiantamentos realizados"
            icon={<Wallet size={24} />}
            href="/relatorios/adiantamentos"
          />

          <ReportCard 
            title="Relatório Financeiro" 
            description="Resumo financeiro completo da operação"
            icon={<DollarSign size={24} />}
            href="/relatorios/financeiro"
          />

          <Card className="bg-gray-50 border-dashed border-gray-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-500 flex items-center gap-2">
                <BarChart3 size={24} />
                Em Desenvolvimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Novos relatórios serão adicionados em breve para facilitar ainda mais a sua gestão.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const ReportCard = ({ title, description, icon, href }: ReportCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <Link to={href}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            {description}
          </CardDescription>
        </CardContent>
      </Link>
    </Card>
  );
};

export default RelatoriosIndex;
