import { Cart } from '../../../domain/models/cart.model';

export interface CartPageVm {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  total: number;
  isEmpty: boolean;
}

