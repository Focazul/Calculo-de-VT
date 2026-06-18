import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { toast } from "sonner";

export default function PurchaseModal({ isOpen, onClose, onSuccess }: any) {
  const { data: employees = [] } = trpc.employees.list.useQuery({});
  const createMutation = trpc.purchases.create.useMutation();
  
  const [selectedStore, setSelectedStore] = useState("");
  const [formData, setFormData] = useState({
    employeeId: "",
    periodStart: "",
    periodEnd: "",
    notes: "",
  });

  const stores = useMemo(() => Array.from(new Set(employees.map(e => e.position))), [employees]);
  const filteredEmployees = useMemo(() => employees.filter(e => e.position === selectedStore), [employees, selectedStore]);

  const calculatedPasses = useMemo(() => {
    const emp = employees.find((e: any) => e.id.toString() === formData.employeeId);
    if (!emp || !formData.periodStart || !formData.periodEnd) return 0;

    const folgas = parseInt(emp.folgasSemanais?.toString() || "1");
    const passesDiarios = parseInt(emp.passesPorDia?.toString() || "2");

    const start = new Date(formData.periodStart);
    const end = new Date(formData.periodEnd);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    let sabados = 0;
    let domingos = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getDay() === 6) sabados++;
      if (d.getDay() === 0) domingos++;
    }

    const diasParaDeduzir = folgas === 2 ? (domingos + sabados) : domingos;
    const diasTrabalhados = Math.max(0, totalDays - diasParaDeduzir);

    return diasTrabalhados * passesDiarios;
  }, [formData.employeeId, formData.periodStart, formData.periodEnd, employees]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.periodStart || !formData.periodEnd) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        employeeId: Number(formData.employeeId),
        purchaseDate: new Date().toISOString().split('T')[0],
        periodStart: formData.periodStart,
        periodEnd: formData.periodEnd,
        totalCalculatedValue: String(calculatedPasses),
        notes: formData.notes || ""
      });
      toast.success("Compra registrada com sucesso!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar a compra.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <Card className="w-full max-w-md bg-white p-6 shadow-2xl rounded-xl border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Nova Compra de VT</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} className="text-slate-500" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <select 
            className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 outline-none"
            onChange={(e) => { setSelectedStore(e.target.value); setFormData({...formData, employeeId: ""}); }}
          >
            <option value="">Selecione a Loja</option>
            {stores.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select 
            className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 outline-none"
            value={formData.employeeId}
            onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
          >
            <option value="">Selecione o Funcionário</option>
            {filteredEmployees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Início</label>
              <Input type="date" onChange={(e) => setFormData({...formData, periodStart: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Fim</label>
              <Input type="date" onChange={(e) => setFormData({...formData, periodEnd: e.target.value})} />
            </div>
          </div>

          <Textarea 
            placeholder="Observações (opcional)" 
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />

          <div className="p-4 bg-sky-50 border border-sky-100 rounded-lg text-center">
            <p className="text-sm font-medium text-sky-800">Total de passes calculados:</p>
            <p className="text-4xl font-black text-sky-900">{calculatedPasses}</p>
          </div>

          <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={calculatedPasses === 0}>
            Salvar Compra
          </Button>
        </form>
      </Card>
    </div>
  );
}