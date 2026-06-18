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
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function History() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");

  const { data: purchases = [], isLoading } = trpc.purchases.list.useQuery({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    paymentStatus: (statusFilter as any) || undefined,
    employeeId: employeeFilter ? parseInt(employeeFilter) : undefined,
  });

  const { data: employees = [] } = trpc.employees.list.useQuery({});

  const employeeMap = useMemo(() => {
    return employees.reduce((acc: any, emp: any) => {
      acc[emp.id] = emp.name;
      return acc;
    }, {});
  }, [employees]);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "employeeId",
        header: "Funcionário",
        cell: (info: any) => employeeMap[info.getValue()] || "N/A",
      },
      {
        accessorKey: "purchaseDate",
        header: "Data da Compra",
        cell: (info: any) => {
          const date = new Date(info.getValue() as string);
          return date.toLocaleDateString("pt-BR");
        },
      },
      {
        accessorKey: "quantity",
        header: "Passes",
        cell: (info: any) => info.getValue(),
      },
      {
        accessorKey: "totalValue",
        header: "Valor",
        cell: (info: any) => `R$ ${parseFloat(info.getValue() as string).toFixed(2)}`,
      },
      {
        accessorKey: "paymentStatus",
        header: "Status",
        cell: (info: any) => {
          const status = info.getValue() as string;
          const statusClass = {
            pending: "badge-pending",
            paid: "badge-paid",
            cancelled: "badge-cancelled",
          }[status] || "badge-pending";
          return <span className={statusClass}>{status}</span>;
        },
      },
      {
        accessorKey: "notes",
        header: "Observações",
        cell: (info: any) => info.getValue() || "-",
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
    if (isSorted === "asc") return <ChevronUp className="h-4 w-4" />;
    if (isSorted === "desc") return <ChevronDown className="h-4 w-4" />;
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Histórico de Compras</h1>
        <p className="text-subtle mt-2">Consulte todo o histórico de compras de vale-transporte</p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium block mb-2">Funcionário</label>
            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="input-field"
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
            <label className="text-sm font-medium block mb-2">Data Inicial</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Data Final</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Status de Pagamento</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
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
      <Card className="overflow-hidden">
        <div className="table-container">
          <table className="w-full">
            <thead className="table-header">
              {table.getHeaderGroups().map((headerGroup: any) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header: any) => (
                    <th
                      key={header.id}
                      className="table-cell text-left font-semibold cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <SortIcon isSorted={header.column.getIsSorted()} />
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="table-cell text-center py-8">
                    Carregando...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-cell text-center py-8 text-[hsl(var(--muted))]">
                    Nenhum registro encontrado
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row: any) => (
                  <tr key={row.id} className="table-row">
                    {row.getVisibleCells().map((cell: any) => (
                      <td key={cell.id} className="table-cell">
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

      {/* Decorative elements */}
      <div className="absolute top-40 right-20 h-32 w-32 rounded-full bg-accent-blue opacity-5 blur-3xl pointer-events-none" />
    </div>
  );
}
