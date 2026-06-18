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
import EmployeeModal from "@/components/EmployeeModal";
import { toast } from "sonner";

export default function Employees() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [nameFilter, setNameFilter] = useState("");
  const [storeFilter, setStoreFilter] = useState("");
  const [checkFilter, setCheckFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);

  const utils = trpc.useUtils();

  // Acoplado dinamicamente aos filtros operacionais do sistema
  const { data: employees = [], isLoading } = trpc.employees.list.useQuery({
    name: nameFilter || undefined,
    position: storeFilter || undefined, // Mapeia para o filtro de 'Loja'
    status: (checkFilter as any) || undefined, // Mapeia para o filtro de 'Checagem'
  });

  const deleteMutation = trpc.employees.delete?.useMutation({
    onSuccess: () => {
      toast.success("Funcionário excluído com sucesso!");
      utils.employees.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao excluir funcionário");
    },
  });

  const handleEdit = (employee: any) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este funcionário? Isso pode afetar os registros de compras associados.")) {
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
        accessorKey: "name",
        header: "Nome",
        cell: (info) => <span className="font-bold text-slate-900">{info.getValue() as string}</span>,
      },
      {
        accessorKey: "startDate",
        header: "Inícios",
        cell: (info) => {
          const dateVal = info.getValue() as string;
          if (!dateVal) return <span className="text-slate-400">---</span>;
          // Converte o formato do input date (AAAA-MM-DD) para o formato brasileiro (DD/MM/AAAA)
          const parts = dateVal.split("-");
          if (parts.length === 3) {
            const [year, month, day] = parts;
            return <span className="text-slate-700 font-medium">{`${day}/${month}/${year}`}</span>;
          }
          return <span className="text-slate-700 font-medium">{dateVal}</span>;
        },
      },
      {
        accessorKey: "position",
        header: "Loja",
        cell: (info) => <span className="text-slate-700 font-medium">{info.getValue() as string}</span>,
      },
      {
        accessorKey: "phone",
        header: "Telefone",
        cell: (info) => <span className="text-slate-600">{info.getValue() as string || "---"}</span>,
      },
      {
        accessorKey: "busLine",
        header: "Empresa de Transporte",
        cell: (info) => <span className="text-slate-700">{info.getValue() as string}</span>,
      },
      {
        accessorKey: "cpf",
        header: "Nº Cartão",
        cell: (info) => <span className="font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{info.getValue() as string}</span>,
      },
      {
        accessorKey: "status",
        header: "Checagem",
        cell: (info) => {
          const status = info.getValue() as string;
          const config = {
            active: { label: "Ativo", css: "bg-emerald-100 text-emerald-800 border-emerald-200" },
            inactive: { label: "Faltante", css: "bg-amber-100 text-amber-800 border-amber-200" },
            optante: { label: "Optante", css: "bg-sky-100 text-sky-800 border-sky-200" },
            resigned: { label: "Desligado", css: "bg-rose-100 text-rose-800 border-rose-200" },
          }[status] || { label: status, css: "bg-slate-100 text-slate-800 border-slate-200" };

          return (
            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${config.css}`}>
              {config.label}
            </span>
          );
        },
      },
      {
        accessorKey: "daysOff",
        header: "F",
        cell: (info) => <span className="font-semibold text-center block text-slate-900">{info.getValue() as string || "1"}</span>,
      },
      {
        accessorKey: "vtValue",
        header: "P",
        cell: (info) => <span className="font-semibold text-center block text-sky-700">{parseInt(info.getValue() as string || "2")}</span>,
      },
      {
        id: "actions",
        header: "Ações",
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleEdit(info.row.original)}
              className="p-1 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded transition-colors"
              title="Editar"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(info.row.original.id)}
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
              title="Excluir"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: employees,
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Matriz Operacional de Funcionários</h1>
          <p className="text-slate-500 mt-1 text-xs">Logística de transporte, folgas e passes ativos</p>
        </div>
        <Button 
          className="bg-sky-600 hover:bg-sky-700 text-white font-medium px-4 py-2 rounded-lg transition-colors gap-2 shadow-sm text-sm" 
          onClick={() => {
            setSelectedEmployee(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Novo Registro
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Filtrar por Nome</label>
            <Input
              placeholder="Buscar colaborador..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 text-sm bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Filtrar por Loja</label>
            <Input
              placeholder="Buscar por loja..."
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 text-sm bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Filtrar por Checagem</label>
            <select
              value={checkFilter}
              onChange={(e) => setCheckFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Faltantes</option>
              <option value="optante">Optantes</option>
              <option value="resigned">Desligados</option>
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
                      className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
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
            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center font-medium text-slate-400">
                    Carregando dados estruturados...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center font-medium text-slate-400">
                    Nenhum colaborador encontrado
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row: any) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    {row.getVisibleCells().map((cell: any) => (
                      <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
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

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        employee={selectedEmployee}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmployee(null);
        }}
        onSuccess={() => {
          utils.employees.list.invalidate();
        }}
      />
    </div>
  );
}