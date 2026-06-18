import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-subtle mt-2">Resumo geral do sistema de Vale-Transporte</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Funcionários Ativos */}
        <Card className="bg-geometric-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funcionários Ativos</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.activeEmployees || 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Ativos no sistema</p>
          </CardContent>
        </Card>

        {/* Valor Total do Mês */}
        <Card className="bg-geometric-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor do Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold">
                R$ {(stats?.monthlyValue || 0).toFixed(2)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Total gasto este mês</p>
          </CardContent>
        </Card>

        {/* Compras Pendentes */}
        <Card className="bg-geometric-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compras Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.pendingPurchases || 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Aguardando pagamento</p>
          </CardContent>
        </Card>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 h-32 w-32 rounded-full bg-accent-blue opacity-5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 h-40 w-40 rounded-full bg-accent-pink opacity-5 blur-3xl pointer-events-none" />
    </div>
  );
}
