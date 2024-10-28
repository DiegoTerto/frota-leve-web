"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car } from "@/types/types";
import { AuthContext } from '@/contexts/AuthContext';
import { createCar } from "@/services/car";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { Form, useForm, FormProvider } from "react-hook-form";
import { z } from "zod";

export type CarFormProps = {
  car: Car;
  open: boolean;
  onOpenChange: Function;
};

const formSchema = z.object({
  brand: z.string().max(50,{
    message: "marca inválida",
  }),
  plate: z.string().max(7, {
    message: "Placa inválida",
  }),
  name: z.string().max(50, {
    message: "Nome muito longo",
  }),
  model: z.string().max(50, {
    message: "Modelo invalido",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function DialogForm({
  car,
  open,
  onOpenChange,
}: CarFormProps) {

  function handleOnOpenChange(isOpen: boolean) {
    onOpenChange(isOpen);
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: car.name,
      model: car.model,
      plate: car.plate,
      brand: car.brand,
    },
  });

  const onSubmit = async (data: FormValues) => {
    await createCar({
      name: data.name,
      model: data.model,
      plate: data.plate,
      brand: data.brand,
    });
    handleOnOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {car.id ? "Editar Veiculo" : "Novo Veiculo"}
          </DialogTitle>
          <DialogDescription>
            Informe os dados do novo Veiculo
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
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo</FormLabel>
                      <FormControl>
                        <Input placeholder="modelo do veiculo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="plate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Placa</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite a placa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca</FormLabel>
                      <FormControl>
                        <Input placeholder="Marca do veiculo" {...field} />
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
  );
}