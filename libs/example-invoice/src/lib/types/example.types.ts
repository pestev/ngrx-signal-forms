export type Country = 'SR' | 'CZ' | 'DE' | 'PL' | 'HU' | 'UK' | 'US';

export interface ExampleInvoice {
  id: number;
  invoiceNumber: string;
  company: ExampleCompany;
  client: ExampleCompany;
  dueDate: string;
  inclVat: boolean;
  totalPriceInclVat: number;
  items: ExampleItem[];
}

export interface ExampleItem {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  vat: number;
  totalPriceWithVat: number;
}

export type Address = {
  street: string,
  city: string,
  country: Country
}

export interface ExampleCompany {
  name: string;
  address: Address;
}
