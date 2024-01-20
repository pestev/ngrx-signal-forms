export type Country = 'SR' | 'CZ' | 'DE' | 'PL' | 'HU' | 'UK' | 'US';

export type Address = {
  street: string,
  city: string,
  country: Country
}

export interface ExampleCompany {
  name: string;
  address: Address;
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
