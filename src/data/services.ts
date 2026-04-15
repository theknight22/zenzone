import type { Service } from '@/types';

export const serviceCategories: { key: Service['category']; label: string; subtitle: string }[] = [
  { key: 'masaze', label: 'Masaže', subtitle: 'Fokus na oporavak i opuštanje' },
  { key: 'parcijalni', label: 'Parcijalni tretmani', subtitle: 'Ciljana njega' },
  { key: 'hidzama', label: 'Hidžama', subtitle: 'Tradicionalna detoksikacija' },
];
