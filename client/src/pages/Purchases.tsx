import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, ChevronUp, ChevronDown, Pencil, Trash2 } from "lucide-react";
import PurchaseModal from "@/components/PurchaseModal";
import { toast } from "sonner";

export default function Purchases() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [selectedPurchase, setSelectedPurchase] = useState<any | null>(null);

  const utils = trpc.useUtils();

  const { data: purchases = [], isLoading } = trpc.purchases.list.useQuery({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    paymentStatus: (statusFilter as any) || undefined,
    employeeId: employeeFilter ? parseInt(employeeFilter) : undefined,
  });

  const { data: employees = [] } = trpc.employees.list.useQuery({});

  // Mutação para excluir compra (caso seu router dê suporte, ou para estruturar ações futuras)
  const deleteMutation = trpc.purchases.delete?.useMutation({
    onSuccess: () => {
      toast.success("Compra excluída com sucesso!");
      utils.purchases.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao excluir compra");
    },
  });

  const employeeMap = useMemo(() => {
    return employees.reduce((acc: any, emp: any) => {
      acc[emp.id] = emp.name;
      return acc;
    }, {});
  }, [employees]);

  const handleEdit = (purchase: any) => {
    setSelectedPurchase(purchase);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este registro de compra?")) {
      if (deleteMutation) {
        deleteMutation.mutate({ id });
      } else {
        toast.error("Funcionalidade de exclusão não configurada no servidor backend.");
      }
    }
  };

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "employeeId",
        header: "Funcionário",
        cell: (info: any) => <span className="font-semibold text-slate-900">{employeeMap[info.getValue()] || "N/A"}</span>,
      },
      {
        accessorKey: "purchaseDate",
        header: "Data da Compra",
        cell: (info: any) => {
          const date = new Date(info.getValue() as string);
          return <span className="text-slate-700">{date.toLocaleDateString("pt-BR")}</span>;
        },
      },
      {
        accessorKey: "quantity",
        header: "Quantidade",
        cell: (info: any) => <span className="text-slate-700 font-medium">{info.getValue()}</span>,
      },
      {
        accessorKey: "totalValue",
        header: "Valor Total",
        cell: (info: any) => <span className="font-bold text-slate-900">{`R$ ${parseFloat(info.getValue() as string).toFixed(2)}`}</span>,
      },
      {
        accessorKey: "paymentStatus",
        header: "Status",
        cell: (info: any) => {
          const status = info.getValue() as string;
          const statusConfig = {
            pending: { label: "Pendente", css: "bg-amber-100 text-amber-800 border-amber-200" },
            paid: { label: "Pago", css: "bg-emerald-100 text-emerald-800 border-emerald-200" },
            cancelled: { label: "Cancelado", css: "bg-rose-100 text-rose-800 border-rose-200" },
          }[status] || { label: status, css: "bg-slate-100 text-slate-800 border-slate-200" };

          return (
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusConfig.css}`}>
              {statusConfig.label}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Ações",
        cell: (info: any) => {
          const purchase = info.row.original;
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(purchase)}
                className="p-1 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded transition-colors"
                title="Editar Compra"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(purchase.id)}
                className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                title="Excluir Compra"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        },
      },
    ],
    [employeeMap]
  );

  const table = useReactTable({
    data: purchases,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const SortIcon = ({ isSorted }: { isSorted: false | "asc" | "desc" }) => {
    if (isSorted === "asc") return <ChevronUp className="h-4 w-4 text-slate-900" />;
    if (isSorted === "desc") return <ChevronDown className="h-4 w-4 text-slate-900" />;
    return null;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Compras de VT</h1>
          <p className="text-slate-600 mt-1 text-sm">Registre e acompanhe as compras semanais de vales-transportes</p>
        </div>
        <Button 
          className="bg-sky-600 hover:bg-sky-700 text-white font-medium px-4 py-2 rounded-lg transition-colors gap-2 shadow-sm" 
          onClick={() => {
            setSelectedPurchase(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Nova Compra
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Funcionário</label>
            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="">Todos</option>
              {employees.map((emp: any) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Data Inicial</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Data Final</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Status de Pagamento</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="">Todos</option>
              <option value="pending">Pendente</option>
              <option value="paid">Pago</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden bg-white border border-slate-200 shadow-sm rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              {table.getHeaderGroups().map((headerGroup: any) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header: any) => (
                    <th
                      key={header.id}
                      className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1.5">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <SortIcon isSorted={header.column.getIsSorted()} />
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm font-medium text-slate-500">
                    Carregando compras...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm font-medium text-slate-400">
                    Nenhuma compra encontrada
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row: any) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    {row.getVisibleCells().map((cell: any) => (
                      <td key={cell.id} className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={isModalOpen}
        purchase={selectedPurchase}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPurchase(null);
        }}
        onSuccess={() => {
          utils.purchases.list.invalidate();
        }}
      />
    </div>
  );
}