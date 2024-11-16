"use client";

import { DataTable } from "./data-table";
import { getAll } from "@/services/employee";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, PlusCircleIcon } from "lucide-react";
import { DialogForm } from "./dialog-form";
import { Employee } from "@/types/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [openFormModal, setOpenFormModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [loadingGetEmployees, setLoadingGetEmployess] = useState<boolean>(false);
  const [isPageFirst, setIsPageFirst] = useState<boolean>(false);
  const [isPageLast, setIsPageLast] = useState<boolean>(false);

  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: '',
    name: '',
    email: '',
    document: '',
    role: '',
  });

  async function getAllEmployees(page: number = currentPage) {
    setLoadingGetEmployess(true);
    const { data } = await getAll(page, itemsPerPage);
    setEmployees(data.content);
    setTotalPages(data.totalPages);
    setIsPageFirst(data.first);
    setIsPageLast(data.last);
    setLoadingGetEmployess(false);
  }

  function handleOnOpenModalChange(isOpen: boolean) {
    setOpenFormModal(isOpen);
    getAllEmployees();
  }

  function previousPage() {
    const prev = currentPage - 1;
    setCurrentPage(prev);
    getAllEmployees(prev);
  }

  function nextPage() {
    const next = currentPage + 1;
    setCurrentPage(next);
    getAllEmployees(next);
  }

  function selectPage(page: number) {
    setCurrentPage(page);
    getAllEmployees(page);
  }

  function handleOpenNewEmployeeDialog() {
    setNewEmployee({
      id: "",
      name: "",
      email: "",
      document: "",
      role: "",
    });
    setOpenFormModal(true);
  }

  useEffect(() => {
    getAllEmployees();
  }, []);

  return (
    <div>
      <div className="w-100 mb-2 flex justify-end">
        <Button onClick={handleOpenNewEmployeeDialog}>
          <PlusCircleIcon />
          Novo Funcionário
        </Button>
      </div>
      <div>
        <DataTable loading={loadingGetEmployees} onUpdateTable={getAllEmployees} employees={employees} />
        <div className="mt-2">
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
        </div>
      </div>
      <DialogForm
        open={openFormModal}
        employee={newEmployee}
        onOpenChange={handleOnOpenModalChange}
      />
    </div>
  );
};

export default Employees;
