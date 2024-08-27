import {create} from 'zustand'
import {persist} from 'zustand/middleware'

export type BreadCrumbItem = {
  order: number;
  name: string;
  url: string;
}
interface CrumbState {
  breadCrumb: BreadCrumbItem[];
  setBreadCrumb: (crumbs: BreadCrumbItem[]) => void;
}
// export const useBreadCrumbStore = create<CrumbState>(
//   persist(
//     (set) => ({
//       breadCrumb: [],
//       setBreadCrumb: (crumbs) => set({breadCrumb: crumbs}),
//     }),
//     {name: 'breadCrumb'}
//   )
// )
