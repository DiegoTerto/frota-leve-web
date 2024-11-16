export interface Employee {
  id: string;
  name: string;
  email: string;
  document: string;
  role: string;
}

export interface Car {
  id: string;
  name: string;
  mileage: number;
  plate: string;
  brand: string;
  qrCode?: string;
}