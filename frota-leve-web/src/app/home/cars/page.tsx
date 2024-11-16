"use client";

import { DataTable } from "./data-table";
import { getAll } from "@/services/car";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, PlusCircleIcon } from "lucide-react";
import { DialogForm } from "./dialog-form";
import { Car } from "@/types/types";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis } from "@/components/ui/pagination";

const Cars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [openFormModal, setOpenFormModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [isPageFirst, setIsPageFirst] = useState<boolean>(false);
  const [isPageLast, setIsPageLast] = useState<boolean>(false);

  async function getAllCars(page: number = currentPage) {
    setLoading(true);
    const data = await getAll(page, itemsPerPage);
    setCars(data.content);
    setTotalPages(data.totalPages);
    setIsPageFirst(data.first);
    setIsPageLast(data.last);
    setLoading(false);
  }

  function handleOnOpenModalChange(isOpen: boolean) {
    setOpenFormModal(isOpen);
    getAllCars();
  }

  function previousPage() {
    const prev = currentPage - 1;
    setCurrentPage(prev);
    getAllCars(prev);
  }

  function nextPage() {
    const next = currentPage + 1;
    setCurrentPage(next);
    getAllCars(next);
  }

  function selectPage(page: number) {
    setCurrentPage(page);
    getAllCars(page);
  }

  useEffect(() => {
    getAllCars();
  }, []);

  return (
    <div>
      <div className="w-100 mb-2 flex justify-end">
        <Button onClick={() => setOpenFormModal(true)}>
          <PlusCircleIcon />
          Novo Veiculo
        </Button>
      </div>
      <div>
        <DataTable loading={loading} onUpdateTable={getAllCars} cars={cars} />
        <div className="mt-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button disabled={isPageFirst} variant="outline" onClick={previousPage}>
                  <ChevronLeft />
                  Anterior
                </Button>
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
        </div>
      </div>
      <DialogForm
        open={openFormModal}
        car={{
          id: "",
          name: "",
          mileage: 0,
          plate: "",
          brand: "",
        }}
        onOpenChange={handleOnOpenModalChange}
      />
    </div>
  );
};

export default Cars;
