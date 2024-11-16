"use client";

import { DataTable } from "./data-table";
import { getAll } from "@/services/car";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { DialogForm } from "./dialog-form";
import { Car } from "@/types/types";

const Cars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [openFormModal, setOpenFormModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false)

  async function getAllCars() {
    setLoading(true)
    const data = await getAll();
    setCars(data);
    setLoading(false)
  }

  function handleOnOpenModalChange(isOpen: boolean) {
    setOpenFormModal(isOpen);
    getAllCars();
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
