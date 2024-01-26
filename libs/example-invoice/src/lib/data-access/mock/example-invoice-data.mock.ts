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

export function save(entity: ExampleInvoice): Observable<ExampleInvoice> {
  const index = invoicesData.findIndex(e => e.id === entity.id);

  if (index === -1) {
    const entityWithGeneratedId = {
      ...entity,
      id: getNextId()
    };

    invoicesData.push(entityWithGeneratedId);

    return of(entityWithGeneratedId);
  }

  invoicesData[index] = entity;

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

function getNextId(): number {
  if (!invoicesData.length) {
    return 1;
  }

  const sortedIds = invoicesData.map(e => e.id).sort();

  return sortedIds[sortedIds.length - 1];
}
