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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Car } from "@/types/types";
import { AlertTriangleIcon, Loader2, PenIcon, QrCode, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { deleteCar, getByPlate, updateCar } from "@/services/car";
import { FormProvider, useForm } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingTable } from "@/components/LoadingTable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface DataTableProps {
  cars: Car[];
  onUpdateTable: Function;
  loading: boolean
}

const carUptadeFormSchema = z.object({
  brand: z.string().max(50, {
    message: "marca inválida",
  }),
  name: z.string().max(50, {
    message: "Nome muito longo",
  }),
  mileage: z.coerce.number(),
});

type CarUpdateFormValues = z.infer<typeof carUptadeFormSchema>;

export function DataTable({ cars, onUpdateTable, loading }: DataTableProps) {
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [carDeleteId, setcarDeleteIdl] = useState<string>("");

  const [carUpdated, setCarUpdated] = useState<Car | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);

  const [loadingDownloadQrCode, setLoadingDownloadQrCode] = useState<boolean>(false);
  const [carDownloadQrCodeId, setCarDownloadQrCodeId] = useState<string>('');

  const carUpdateForm = useForm<CarUpdateFormValues>({
    resolver: zodResolver(carUptadeFormSchema),
  });

  const onSubmit = async (data: CarUpdateFormValues) => {
    if (!carUpdated?.id) return;
    await updateCar(carUpdated?.id, data);
    setOpenUpdateModal(false);
    onUpdateTable();
  };

  function handleOpenDeleteModal(carId: string) {
    setcarDeleteIdl(carId);
    setOpenDeleteModal(true);
  }

  function handleOpenUpdateModal(carUpdated: Car) {
    setCarUpdated(carUpdated);
    carUpdateForm.setValue(`name`, carUpdated.name);
    carUpdateForm.setValue(`brand`, carUpdated.brand);
    carUpdateForm.setValue(`mileage`, carUpdated.mileage);
    setOpenUpdateModal(true);
  }

  async function handleDelete() {
    await deleteCar(carDeleteId);
    setOpenDeleteModal(false);
    onUpdateTable();
  }

  function handleCloseUpdateModal(value: boolean) {
    setOpenUpdateModal(value);
  }

  async function handleDownloadQrCode(car: Car) {
    setCarDownloadQrCodeId(car.id)
    setLoadingDownloadQrCode(true);
    const { data } = await getByPlate(car);
    const byteCharacters = atob(data.qrCode);
    const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${car.name}-${car.plate}.jpg`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
    setLoadingDownloadQrCode(false);
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead> Nome</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>KM atual</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? <LoadingTable length={cars.length}/>
              : cars.map((car) => (
              <TableRow key={car.id}>
                <TableCell>{car.name} </TableCell>
                <TableCell>{car.plate} </TableCell>
                <TableCell>{car.brand} </TableCell>
                <TableCell>{car.mileage} </TableCell>
                <TableCell>
                  <div className="gap-2 flex">
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-blue-300 hover:bg-blue-200"
                            onClick={() => handleDownloadQrCode(car)}
                          > 
                            {loadingDownloadQrCode && carDownloadQrCodeId === car.id ? 
                              	<Loader2 className="animate-spin" />
                                : <QrCode className="h-4 w-4" />
                            }
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Baixar QRCode</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-[#FFC314] hover:bg-yellow-300"
                      onClick={() => handleOpenUpdateModal(car)}
                    >
                      <PenIcon className="h-4 w-4" color="white" />
                    </Button>
                    <Button
                      onClick={() => handleOpenDeleteModal(car.id)}
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
        <Dialog
          open={openDeleteModal}
          onOpenChange={() => setOpenDeleteModal((value) => !value)}
        >
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
        <Dialog open={openUpdateModal} onOpenChange={setOpenUpdateModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <div style={{ display: "flex", alignItems: "center" }}>
                  Editar Veiculo
                </div>
              </DialogTitle>
            </DialogHeader>
            <div>
              <FormProvider {...carUpdateForm}>
                <form
                  onSubmit={carUpdateForm.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={carUpdateForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="...(gol, astra, celta)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={carUpdateForm.control}
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
                  <FormField
                    control={carUpdateForm.control}
                    name="mileage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Km Atual</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Km do veiculo"
                            {...field}
                          />
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
