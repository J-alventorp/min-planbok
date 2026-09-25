import { makeId } from '../utils/id';

export function defaultCategories() {
  return [
    { id: makeId('cat'), name: 'Mat', icon: '🛒' },
    { id: makeId('cat'), name: 'Nöje', icon: '🎉' },
    { id: makeId('cat'), name: 'Transport', icon: '🚌' },
    { id: makeId('cat'), name: 'Shopping', icon: '🛍️' },
    { id: makeId('cat'), name: 'Övrigt', icon: '✨' },
  ];
}
