import { makeId } from '../utils/id';

export function defaultFixedExpenses() {
  return ['Hyra', 'El', 'Vatten', 'Försäkring', 'Telefon', 'Internet', 'Abonnemang']
    .map((name) => ({ id: makeId('fe'), name, amount: 0, active: true }));
}
