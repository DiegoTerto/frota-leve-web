"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Download, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { getAll } from "@/services/race";
import api from "@/lib/axios-config";
import { LoadingTable } from "./LoadingTable";

type Race = {
  id: string;
  startAt: string;
  endAt: string;
  carId: string;
  employeeId: string;
  startMileage: number;
  finalMileage: number;
  situation: string;
  photoEvidenceUrl: string;
  carName: string;
  carPlate: string;
  employeeName: string;
};

export function Viagens() {
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [races, setRaces] = useState<Race[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPageFirst, setIsPageFirst] = useState<boolean>(false);
  const [isPageLast, setIsPageLast] = useState<boolean>(false);

  async function getAllRaces(page: number = currentPage) {
    setLoading(true)
    const { data }: any = await getAll(page, itemsPerPage);
    setRaces(data.content);
    setTotalPages(data.totalPages);
    setIsPageFirst(data.first);
    setIsPageLast(data.last);
    setLoading(false)
  }

  function previousPage() {
    const prev = currentPage - 1;
    setCurrentPage(prev);
    getAllRaces(prev);
  }

  function nextPage() {
    const next = currentPage + 1;
    setCurrentPage(next);
    getAllRaces(next);
  }

  function selectPage(page: number) {
    setCurrentPage(page);
    getAllRaces(page);
  }

  async function downloadEvidence(imageUrl: string) {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.setAttribute("download", "imagem.jpg"); // Nome do arquivo ao baixar
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  useEffect(() => {
    getAllRaces();
  }, []);

  return (
    <>
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">Todas Viagens</TabsTrigger>
            {/* <TabsTrigger value="inProgress">Em Andamento</TabsTrigger>
                        <TabsTrigger value="completed">Finalizadas</TabsTrigger> */}
          </TabsList>
          {/* <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1 text-xs"
                                >
                                    <ListFilter className="h-3 w-3" />
                                    <span className="sr-only sm:not-sr-only">Filtros</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filtre por</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked>
                                    Em andamento
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    Finalizadas
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1 text-xs"
                        >
                            <File className="h-3 w-3" />
                            <span className="sr-only sm:not-sr-only">Exportar</span>
                        </Button>
                    </div> */}
        </div>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Todas Viagens</CardTitle>
              <CardDescription>Uma lista de todas as viagens.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Veiculo</TableHead>
                    <TableHead>Condutor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data Inicio</TableHead>
                    <TableHead>Data Fim</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? <LoadingTable length={races.length}/>
                  : races.map((race) => (
                    <TableRow
                      key={race.id}
                      onClick={() => setSelectedRace(race)}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium">{race.carName}</div>
                            <div className="text-sm text-muted-foreground">
                              {race.carPlate}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={`https://api.dicebear.com/6.x/initials/svg?seed=${race.employeeName}`}
                              alt={race.employeeName}
                            />
                            <AvatarFallback>
                              {race.employeeName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{race.employeeName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            race.situation === "IN_PROGRESS"
                              ? "default"
                              : race.situation === "COMPLETED"
                              ? "secondary"
                              : "outline"
                          }
                          className={
                            race.situation === "IN_PROGRESS"
                              ? "bg-[#FFC314] text-black"
                              : "bg-green-400"
                          }
                        >
                          {race.situation === "IN_PROGRESS"
                            ? "Em andamento"
                            : "Finalizada"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {race.startAt
                          ? format(race.startAt, "dd / MMM / yyyy - HH:MM", {
                              locale: ptBR,
                            })
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {race.endAt
                          ? format(race.endAt, "dd / MMM / yyyy - HH:MM", {
                              locale: ptBR,
                            })
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Button disabled={isPageFirst} variant="outline" onClick={previousPage}>
                      <ChevronLeft />
                      Anterior
                    </Button>
                    {/* <PaginationPrevious
                      onClick={previousPage}
                      aria-disabled={currentPage === 1}
                    /> */}
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNumber = i + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => selectPage(pageNumber)}
                            isActive={pageNumber === currentPage}
                            className={
                              pageNumber === currentPage
                                ? "bg-zinc-950 text-white cursor-pointer"
                                : "cursor-pointer"
                            }
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return <PaginationEllipsis key={i} />;
                    }
                    return null;
                  })}
                  <PaginationItem>
                    <Button disabled={isPageLast} variant="outline" onClick={nextPage}>
                      Proxima
                      <ChevronRight />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedRace} onOpenChange={() => setSelectedRace(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes da corrida</DialogTitle>
            <DialogDescription>
              Informações detalhadas da corrida
            </DialogDescription>
          </DialogHeader>
          {selectedRace && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <div className="font-semibold">Veículo:</div>
                <div>
                  {selectedRace.carName} ({selectedRace.carPlate})
                </div>
                <div className="font-semibold">Condutor(a):</div>
                <div>{selectedRace.employeeName}</div>
                <div className="font-semibold">Status:</div>
                <div>
                  <Badge
                    variant={
                      selectedRace.situation === "IN_PROGRESS"
                        ? "default"
                        : selectedRace.situation === "COMPLETED"
                        ? "secondary"
                        : "outline"
                    }
                    className={
                      selectedRace.situation === "IN_PROGRESS"
                        ? "bg-[#FFC314] text-black"
                        : "bg-green-400"
                    }
                  >
                    {selectedRace.situation === "IN_PROGRESS"
                      ? "Em andamento"
                      : "Finalizada"}
                  </Badge>
                </div>
                <div className="font-semibold">Data de início:</div>
                <div>
                  {selectedRace.startAt
                    ? format(selectedRace.startAt, "dd / MMM / yyyy - HH:MM", {
                        locale: ptBR,
                      })
                    : "-"}
                </div>
                <div className="font-semibold">Data fim:</div>
                <div>
                  {selectedRace.endAt
                    ? format(selectedRace.endAt, "dd / MMM / yyyy - HH:MM", {
                        locale: ptBR,
                      })
                    : "-"}
                </div>
                <div className="font-semibold">KM Inicial:</div>
                <div>{selectedRace.startMileage}</div>
                <div className="font-semibold">KM Final:</div>
                <div>{selectedRace.finalMileage || "N/A"}</div>
                <div className="font-semibold">KM Rodados:</div>
                <div>
                  {selectedRace.finalMileage
                    ? selectedRace.finalMileage - selectedRace.startMileage
                    : "-"}
                </div>
                <div className="font-semibold">Reabastecido:</div>
                <div className="flex items-center gap-2">Sim</div>
                <div className="font-semibold">KM final Evidência:</div>
                <Button
                  disabled={!selectedRace.photoEvidenceUrl}
                  variant="link"
                  className="flex items-center justify-start"
                >
                  <Eye/>
                  <a href={selectedRace.photoEvidenceUrl} target="_blank" rel="noopener noreferrer">
                    Visualizar
                  </a>
                </Button>
              </div>
              <div className="space-y-2">
                <div className="font-semibold">Datalhes Condutor(a):</div>
                <div>Nome: {selectedRace.employeeName}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
