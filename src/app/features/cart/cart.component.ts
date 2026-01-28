import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <ng-container *ngIf="cartService.showCart$ | async">
      <!-- Only show overlay if not "classic" (full page) or if we want classic to be a modal -->
      <div class="cart-overlay" (click)="close()" *ngIf="layout !== 'classic'"></div>
      
      <div class="cart-container" [ngClass]="[layout, theme]">
        
        <div class="cart-header">
          <h3>Shopping Bag ({{ cartService.count$ | async }})</h3>
          <button class="close-btn" (click)="close()">×</button>
        </div>

        <div class="cart-items">
          <div *ngFor="let item of cart$ | async" class="cart-item">
            <div class="item-img-container">
                <img [src]="item.image" alt="Product" class="item-img" (error)="onImgError($event)">
            </div>
            <div class="item-details">
              <h4>{{ item.name }}</h4>
              <p class="item-price">{{ item.price | currency }}</p>
              <div class="qty-controls">
                <button (click)="updateQty(item.id, item.quantity - 1)">-</button>
                <span class="qty-num">{{ item.quantity }}</span>
                <button (click)="updateQty(item.id, item.quantity + 1)">+</button>
              </div>
            </div>
            <button class="remove-btn" (click)="removeItem(item.id)">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
          </div>
          
          <div *ngIf="(cart$ | async)?.length === 0" class="empty-state">
            <div class="empty-icon">🛒</div>
            <p>Your cart is empty.</p>
            <button class="cont-btn" (click)="close()">Start Shopping</button>
          </div>
        </div>

        <div class="cart-footer" *ngIf="(cart$ | async)?.length !== 0">
          <div class="summary-details">
            <div class="row">
                <span>Subtotal</span>
                <span>{{ cartService.total$ | async | currency }}</span>
            </div>
            <div class="row shipping">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
            </div>
          </div>
          <div class="total-row">
            <span>Total:</span>
            <span class="total-price">{{ cartService.total$ | async | currency }}</span>
          </div>
          <button class="checkout-btn" (click)="checkout()">
            Go to Checkout
          </button>
        </div>

      </div>
    </ng-container>
  `,
  styles: [`
    .cart-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.4); z-index: 1000;
      backdrop-filter: blur(8px);
    }
    
    .cart-container {
      position: fixed; z-index: 1001;
      background: white;
      display: flex; flex-direction: column;
      box-shadow: -10px 0 30px rgba(0,0,0,0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .cart-header { padding: 30px; display: flex; justify-content: space-between; align-items: center; }
    .cart-items { flex: 1; overflow-y: auto; padding: 0 30px; }
    .cart-footer { padding: 30px; border-top: 1px solid #eee; background: #fafafa; }
    
    .cart-item { display: flex; gap: 20px; padding: 20px 0; border-bottom: 1px solid #f0f0f0; align-items: center; position: relative; }
    .item-img-container { background: #f9f9f9; border-radius: 8px; padding: 5px; }
    .item-img { width: 80px; height: 80px; object-fit: cover; border-radius: 4px; }
    .item-details { flex: 1; }
    .item-details h4 { margin: 0 0 5px 0; font-size: 1rem; font-weight: 700; }
    .item-price { color: #666; font-weight: 600; margin-bottom: 10px; }
    
    .qty-controls { display: flex; align-items: center; background: #eee; border-radius: 50px; width: fit-content; padding: 2px; }
    .qty-controls button { width: 28px; height: 28px; border-radius: 50%; border: none; background: white; cursor: pointer; font-weight: bold; }
    .qty-num { padding: 0 15px; font-weight: 700; font-size: 0.9rem; }
    
    .remove-btn { position: absolute; top: 20px; right: 0; background: transparent; border: none; cursor: pointer; color: #ccc; width: 20px; transition: color 0.2s; }
    .remove-btn:hover { color: #e74c3c; }

    .total-row { display: flex; justify-content: space-between; font-weight: 800; font-size: 1.3rem; margin: 20px 0; }
    .checkout-btn { width: 100%; padding: 20px; border: none; font-size: 1.1rem; font-weight: 800; cursor: pointer; transition: 0.3s; }
    
    .summary-details { margin-bottom: 20px; color: #888; font-size: 0.9rem; }
    .summary-details .row { display: flex; justify-content: space-between; margin-bottom: 8px; }

    /* --- LAYOUT: DRAWER --- */
    .cart-container.drawer { top: 0; right: 0; bottom: 0; width: 500px; animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

    /* --- LAYOUT: OVERLAY (Used as a drop-down/modal for Electronics) --- */
    .cart-container.overlay {
      top: 100px; right: 40px;
      width: 450px; max-height: 70vh;
      border-radius: 12px;
      animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes popIn { from { opacity: 0; transform: scale(0.95) translateY(-20px); } to { opacity: 1; transform: scale(1) translateY(0); } }

    /* --- FASHION THEME --- */
    .cart-container.fashion { font-family: 'Inter', sans-serif; }
    .cart-container.fashion h3 { font-family: 'Playfair Display', serif; font-size: 24px; }
    .cart-container.fashion .checkout-btn { background: #000; color: #fff; text-transform: uppercase; letter-spacing: 2px; }
    .cart-container.fashion .checkout-btn:hover { background: #333; }

    /* --- ELECTRONICS THEME --- */
    .cart-container.electronics { background: #0a192f; color: #ccd6f6; border: 1px solid #112240; }
    .cart-container.electronics .cart-footer { background: #112240; border-top: 1px solid #233554; }
    .cart-container.electronics .item-img-container { background: #112240; }
    .cart-container.electronics .item-price { color: #64ffda; }
    .cart-container.electronics .checkout-btn { background: #64ffda; color: #0a192f; border-radius: 4px; }
    .cart-container.electronics .qty-controls { background: #233554; }
    .cart-container.electronics .qty-controls button { background: #0a192f; color: #64ffda; }

    /* --- GROCERY THEME --- */
    .cart-container.grocery { border-radius: 20px; overflow: hidden; }
    .cart-container.grocery .checkout-btn { background: #2ecc71; color: #fff; border-radius: 50px; }
    .cart-container.grocery .total-price { color: #2ecc71; }
    .cart-container.grocery .qty-controls button { color: #2ecc71; }

    /* --- CLOSE BUTTON --- */
    .close-btn { background: none; border: none; font-size: 2rem; cursor: pointer; color: #888; font-weight: 300; }
    .close-btn:hover { color: #000; }

    /* --- EMPTY STATE --- */
    .empty-state { text-align: center; padding: 60px 0; }
    .empty-icon { font-size: 4rem; margin-bottom: 20px; opacity: 0.3; }
    .cont-btn { margin-top: 20px; background: transparent; border: 2px solid #ddd; padding: 12px 30px; border-radius: 50px; font-weight: 700; cursor: pointer; }
  `]
})
export class CartComponent implements OnInit {
  @Input() layout: string = 'drawer';
  @Input() theme: string = 'fashion';

  cart$: Observable<CartItem[]>;

  constructor(
    public cartService: CartService,
    private router: Router
  ) {
    this.cart$ = this.cartService.cart$;
  }

  ngOnInit() { }

  close() { this.cartService.closeCart(); }

  updateQty(id: string, qty: number) {
    this.cartService.updateQuantity(id, qty);
  }

  removeItem(id: string) {
    this.cartService.removeFromCart(id);
  }

  checkout() {
    this.close();
    this.router.navigate(['/checkout']);
  }

  onImgError(event: any) {
    event.target.src = 'https://via.placeholder.com/80?text=Product';
  }
}
