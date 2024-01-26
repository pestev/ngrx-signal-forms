import { Observable, of, throwError }  from 'rxjs';
import { ExampleInvoice, ExampleItem } from '../../types/example.types';

const invoicesData: ExampleInvoice[] = [
  {
    id: 1,
    invoiceNumber: 'I2024001',
    company: {
      name: 'My company',
      address: {
        street: 'My street',
        city: 'My city',
        country: 'SR'
      }
    },
    client: {
      name: 'Super Partner',
      address: {
        street: 'Partner street',
        city: 'Partner city',
        country: 'CZ'
      }
    },
    dueDate: '2024-13-1',
    inclVat: false,
    totalPriceInclVat: 5 * 12,
    items: generateItems(5)
  }
];

export function getOne(id: number): Observable<ExampleInvoice> {
  const entity = invoicesData.find(e => e.id === id);

  if (!entity) {
    return throwError(() => '404 - Not found!');
  }

  return of(entity);
}

function generateItems(length: number): ExampleItem[] {
  return Array.from({ length }, (_, i) => ({
    id: i,
    name: `Item number ${ i }`,
    quantity: 1,
    unitPrice: 10,
    totalPrice: 10,
    vat: 20,
    totalPriceWithVat: 12
  }));
}
