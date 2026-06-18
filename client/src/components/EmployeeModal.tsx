import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { toast } from "sonner";

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee?: any | null;
}

export default function EmployeeModal({ isOpen, onClose, onSuccess, employee }: EmployeeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    position: "",
    phone: "",
    busLine: "",
    cpf: "",
    status: "OK",
    folgasSemanais: "1", 
    passesPorDia: "2",
  });

  useEffect(() => {
    if (isOpen) {
      if (employee) {
        setFormData({
          name: employee.name || "",
          startDate: employee.startDate || "",
          position: employee.position || "",
          phone: employee.phone || "",
          busLine: employee.busLine || "",
          cpf: employee.cpf || "",
          status: employee.status || "OK",
          folgasSemanais: employee.folgasSemanais?.toString() || "1",
          passesPorDia: employee.passesPorDia?.toString() || "2",
        });
      } else {
        setFormData({
          name: "",
          startDate: "",
          position: "",
          phone: "",
          busLine: "",
          cpf: "",
          status: "OK",
          folgasSemanais: "1",
          passesPorDia: "2",
        });
      }
    }
  }, [isOpen, employee]);

  const createMutation = trpc.employees.create.useMutation();
  const updateMutation = trpc.employees.update.useMutation();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { 
        ...formData,
        folgasSemanais: parseInt(formData.folgasSemanais),
        passesPorDia: parseInt(formData.passesPorDia),
      };

      if (employee?.id) {
        await updateMutation.mutateAsync({ id: employee.id, ...payload });
        toast.success("Dados operacionais atualizados!");
      } else {
        await createMutation.mutateAsync(payload as any);
        toast.success("Novo colaborador registrado!");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar: verifique os dados no console.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden text-slate-900">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">
            {employee ? "Editar Registro" : "Novo Registro"}
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:bg-slate-200 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Nome Completo</label>
            <Input name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
            <Input name="position" placeholder="Loja" value={formData.position} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input name="phone" placeholder="Telefone" value={formData.phone} onChange={handleChange} />
            <Input name="busLine" placeholder="Empresa de Transporte" value={formData.busLine} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input name="cpf" placeholder="Nº Cartão VT" value={formData.cpf} onChange={handleChange} required />
            <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded-md p-2">
              <option value="OK">OK</option>
              <option value="FALTANDO">FALTANDO</option>
              <option value="DESLIGADO">DESLIGADO</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border rounded-lg">
            <div>
              <label className="text-xs font-bold block mb-1">Folgas Semanais</label>
              <select name="folgasSemanais" value={formData.folgasSemanais} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="1">1 Folga</option>
                <option value="2">2 Folgas</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Passes por Dia</label>
              <select name="passesPorDia" value={formData.passesPorDia} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="1">1 Passe</option>
                <option value="2">2 Passes</option>
              </select>
            </div>
          </div>
          <Button type="submit" className="w-full bg-sky-600">Salvar Registro</Button>
        </form>
      </Card>
    </div>
  );
}