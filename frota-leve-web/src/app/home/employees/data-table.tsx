"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Employee } from "@/types/types";
import { AlertTriangleIcon, PenIcon, Trash2Icon } from "lucide-react";
import { useContext, useState } from "react";
import { deleteEmployee, updateEmployee } from "@/services/employee";
import { AuthContext } from "@/contexts/AuthContext";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingTable } from "@/components/LoadingTable";

interface DataTableProps {
  employees: Employee[];
  onUpdateTable: Function;
  loading: boolean;
}

const employeeUpdateFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Nome obrigatório",
    })
    .max(50, {
      message: "Nome muito longo",
    }),
});

type EmployeeUpdateFormValues = z.infer<typeof employeeUpdateFormSchema>;

export function DataTable({
  employees,
  onUpdateTable,
  loading,
}: DataTableProps) {
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);

  const [employeeDeletedId, setEmployeeDeletedId] = useState<string>("");
  const { user } = useContext(AuthContext);
  const [employeeUpdated, setEmployeeUpdated] = useState<Employee | null>(null);

  function handleOpenDeleteModal(carId: string) {
    setEmployeeDeletedId(carId);
    setOpenDeleteModal(true);
  }

  function handleOpenUpdateModal(employeeUpdated: Employee) {
    setEmployeeUpdated(employeeUpdated);
    employeeUpdateForm.setValue("name", employeeUpdated.name);
    setOpenUpdateModal(true);
  }

  async function handleDelete() {
    await deleteEmployee(user.businessId, employeeDeletedId);
    setOpenDeleteModal(false);
    onUpdateTable();
  }

  const employeeUpdateForm = useForm<EmployeeUpdateFormValues>({
    resolver: zodResolver(employeeUpdateFormSchema),
  });

  const onSubmit = async (data: EmployeeUpdateFormValues) => {
    if (!employeeUpdated?.id) return;
    await updateEmployee(employeeUpdated.id, data.name);
    setOpenUpdateModal(false);
    onUpdateTable();
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? <LoadingTable length={employees.length}/>
              : employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name} </TableCell>
                    <TableCell>{employee.email} </TableCell>
                    <TableCell>{employee.document} </TableCell>
                    <TableCell>
                      <div className="gap-2 flex">
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-[#FFC314] hover:bg-yellow-300"
                          onClick={() => handleOpenUpdateModal(employee)}
                        >
                          <PenIcon className="h-4 w-4" color="white" />
                        </Button>
                        <Button
                          onClick={() => handleOpenDeleteModal(employee.id)}
                          variant="outline"
                          size="icon"
                          className="bg-red-500 hover:bg-red-300"
                        >
                          <Trash2Icon className="h-4 w-4" color="white" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <Dialog open={openDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <AlertTriangleIcon
                    style={{ marginRight: "8px", color: "red" }}
                  />
                  Atenção
                </div>
              </DialogTitle>
            </DialogHeader>
            <div>
              <p>Deseja realmente Excluir?</p>
            </div>
            <DialogFooter>
              <Button
                variant={"secondary"}
                onClick={() => setOpenDeleteModal(false)}
              >
                {" "}
                Não
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-300"
              >
                Sim
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog
          open={openUpdateModal}
          onOpenChange={() => setOpenUpdateModal((value) => !value)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <div>Editar Funcionário</div>
              </DialogTitle>
            </DialogHeader>
            <div>
              <FormProvider {...employeeUpdateForm}>
                <form
                  onSubmit={employeeUpdateForm.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={employeeUpdateForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o nome..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Salvar</Button>
                  </DialogFooter>
                </form>
              </FormProvider>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
