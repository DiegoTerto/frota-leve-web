import api from "@/lib/axios-config";
import { Car } from "@/types/types";

export type CreateCarType = {
  mileage: number;
  name: string;
  brand: string;
  plate:string
}

export type UptadeCarType = {
  mileage: number;
  name: string;
  brand: string;
}


export async function createCar(data: CreateCarType): Promise<void> {
  return await api.post(`/api/car`, data);
}

export async function deleteCar(id:string): Promise<void> {
  return await api.delete(`/api/car/${id}`);
}

export async function updateCar(carId:string, data: UptadeCarType) {
  return await api.put(`/api/car/${carId}`, data)
}

export async function getAll(page: number, size: number): Promise<any> {
  const { data } = await api.get('/api/car',{
    params:{
      page: page - 1,
      size
    }
  });
  return data
}

export async function getByPlate(car: Car) {
  return await api.get(`/api/car/${car.plate}`)
}