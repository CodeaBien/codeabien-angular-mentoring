import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStore } from '../../domain/store/cart.store';
import { CartPageService } from './services/cart-page.service';
import { CartListComponent } from './components/cart-list/cart-list.component';
import { CartPageVm } from './models/cart-page.vm';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, CartListComponent],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPageComponent implements OnInit {
  private readonly cartStore = inject(CartStore);
  private readonly cartPageService = inject(CartPageService);

  // ViewModel computado y tipado
  readonly vm = computed<CartPageVm>(() => ({
    cart: this.cartStore.cart(),
    loading: this.cartStore.loading(),
    itemCount: this.cartStore.itemCount(),
    total: this.cartStore.total(),
    isEmpty: !this.cartStore.cart() || this.cartStore.cart()!.items.length === 0,
  }));

  ngOnInit(): void {
    // Cargar el carrito cuando se inicializa el componente
    const userId = 1; // Por defecto usar userId 1 para fakestoreapi
    
    // Solo cargar si no está ya cargado o si no se está cargando
    if (!this.vm().cart && !this.vm().loading) {
      this.cartPageService.loadUserCart(userId);
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeProduct(productId);
    } else {
      this.cartPageService.updateProductQuantity(1, productId, quantity);
    }
  }

  removeProduct(productId: number): void {
    this.cartPageService.removeProductFromCart(1, productId);
  }
}

