
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RelatorioPagina = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the new reports index page
    navigate("/relatorios", { replace: true });
  }, [navigate]);

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 font-inter">Relatórios</h1>
        
        <Card>
          <CardHeader className="bg-navy text-white">
            <CardTitle className="text-xl font-inter">Redirecionando...</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-muted-foreground font-roboto">
              Redirecionando para a nova página de relatórios...
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RelatorioPagina;
