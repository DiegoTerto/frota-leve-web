"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthContext } from '@/contexts/AuthContext';
import { createEmployee } from "@/services/employee";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Employee } from "@/types/types";

export type EmployeeFormProps = {
  employee: Employee;
  open: boolean;
  onOpenChange: Function;
};

const formSchema = z.object({
  email: z.string().email({
    message: "Email inválido",
  }),
  document: z.string().max(11, {
    message: "Documento inválido",
  }),
  name: z.string().max(50, {
    message: "Nome muito longo",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function DialogForm({
  employee,
  open,
  onOpenChange,
}: EmployeeFormProps) {
  const { user } = useContext(AuthContext);

  function handleOnOpenChange(isOpen: boolean) {
    onOpenChange(isOpen);
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: employee.email,
      document: employee.document,
      name: employee.name,
    },
  });

  const onSubmit = async (data: FormValues) => {
    await createEmployee(user.businessId, {
      email: data.email,
      document: data.document,
      name: data.name,
    });
    handleOnOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {employee.id ? "Editar Funcionário" : "Novo Funcionário"}
          </DialogTitle>
          <DialogDescription>
            Informe os dados do novo funcionário
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
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
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documento</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o documento" {...field} />
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
        {/* <DialogFooter>
          <Button type="submit">Salvar</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
