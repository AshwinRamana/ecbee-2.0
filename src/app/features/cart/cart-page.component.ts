import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';
import { TenantConfigService } from '../../core/services/tenant-config.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-cart-page',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="cart-page-container" *ngIf="config$ | async as config" [ngClass]="config.theme">
      <div class="container">
        
        <header class="cart-page-header">
           <h1>Your Shopping Cart</h1>
           <p>Check your items and proceed to checkout</p>
        </header>

        <div class="cart-grid">
           <!-- LEFT: ITEMS -->
           <div class="items-column">
              <div *ngIf="(cartService.cart$ | async)?.length === 0" class="empty-cart">
                 <div class="empty-art">🛒</div>
                 <h2>Your cart is currently empty</h2>
                 <p>Looks like you haven't added anything to your cart yet.</p>
                 <button routerLink="/home" class="shop-btn">Continue Shopping</button>
              </div>

              <div *ngFor="let item of cartService.cart$ | async" class="item-card">
                 <img [src]="item.image" class="item-img" alt="Product" (error)="onImgError($event)">
                 <div class="item-info">
                    <h3>{{ item.name }}</h3>
                    <p class="unit-price">{{ item.price | currency }} each</p>
                    <div class="item-actions">
                       <div class="qty-toggle">
                          <button (click)="updateQty(item.id, item.quantity - 1)">-</button>
                          <span>{{ item.quantity }}</span>
                          <button (click)="updateQty(item.id, item.quantity + 1)">+</button>
                       </div>
                       <button class="remove-link" (click)="removeItem(item.id)">Remove</button>
                    </div>
                 </div>
                 <div class="item-subtotal">
                    {{ (item.price * item.quantity) | currency }}
                 </div>
              </div>
           </div>

           <!-- RIGHT: SUMMARY -->
           <div class="summary-column" *ngIf="(cartService.cart$ | async)?.length !== 0">
              <div class="summary-card">
                 <h3>Order Summary</h3>
                 <div class="summary-row">
                    <span>Subtotal</span>
                    <span>{{ cartService.total$ | async | currency }}</span>
                 </div>
                 <div class="summary-row">
                    <span>Shipping</span>
                    <span class="free">FREE</span>
                 </div>
                 <div class="summary-row total">
                    <span>Estimated Total</span>
                    <span>{{ cartService.total$ | async | currency }}</span>
                 </div>
                 <button class="checkout-process-btn" (click)="checkout()">Proceed to Checkout</button>
                 <p class="secure-text">🔒 Secure Checkout Guaranteed</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  `,
    styles: [`
    .cart-page-container { min-height: 100vh; padding: 60px 0; background: #fbfbfb; font-family: 'Inter', sans-serif; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

    .cart-page-header { margin-bottom: 40px; }
    .cart-page-header h1 { font-size: 32px; font-weight: 800; margin: 0 0 10px 0; color: #1a1a1a; }
    .cart-page-header p { color: #666; font-size: 1.1rem; }

    .cart-grid { display: grid; grid-template-columns: 1fr 380px; gap: 40px; }
    @media (max-width: 992px) { .cart-grid { grid-template-columns: 1fr; } }

    .items-column { background: white; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03); overflow: hidden; }
    .item-card { display: flex; align-items: center; padding: 30px; border-bottom: 1px solid #f0f0f0; gap: 30px; }
    .item-img { width: 120px; height: 120px; object-fit: cover; border-radius: 8px; background: #f9f9f9; }
    .item-info { flex: 1; }
    .item-info h3 { margin: 0 0 5px 0; font-size: 1.2rem; font-weight: 700; }
    .unit-price { color: #888; margin-bottom: 20px; }
    
    .item-actions { display: flex; align-items: center; gap: 30px; }
    .qty-toggle { display: flex; align-items: center; gap: 15px; background: #f4f4f4; padding: 5px 15px; border-radius: 50px; }
    .qty-toggle button { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #555; }
    .qty-toggle span { font-weight: bold; width: 20px; text-align: center; }
    .remove-link { background: none; border: none; color: #e74c3c; cursor: pointer; text-decoration: underline; font-size: 0.9rem; }

    .item-subtotal { font-size: 1.2rem; font-weight: 800; color: #1a1a1a; width: 120px; text-align: right; }

    .summary-card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03); position: sticky; top: 120px; }
    .summary-card h3 { margin: 0 0 25px 0; font-size: 1.4rem; }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 15px; color: #555; }
    .summary-row.total { border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px; color: #000; font-weight: 800; font-size: 1.4rem; }
    .free { color: #2ecc71; font-weight: 700; }
    
    .checkout-process-btn { width: 100%; padding: 18px; background: #000; color: #fff; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 800; cursor: pointer; margin-top: 20px; transition: 0.3s; }
    .checkout-process-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
    .secure-text { text-align: center; font-size: 0.8rem; color: #aaa; margin-top: 15px; }

    /* Theme Overrides */
    .grocery .checkout-process-btn { background: #2ecc71; }
    .grocery .free { color: #27ae60; }
    .fashion h1 { font-family: 'Playfair Display', serif; }
    .electronics .checkout-process-btn { background: #00d2d3; color: #0a192f; }

    .empty-cart { text-align: center; padding: 80px 40px; }
    .empty-art { font-size: 60px; margin-bottom: 20px; }
    .shop-btn { background: #000; color: #fff; border: none; padding: 15px 40px; border-radius: 8px; font-weight: 800; cursor: pointer; margin-top: 20px; }
  `]
})
export class CartPageComponent implements OnInit {
    config$: Observable<any> = this.tenantService.config;

    constructor(
        public cartService: CartService,
        private tenantService: TenantConfigService,
        private router: Router
    ) { }

    ngOnInit() { }

    updateQty(id: string, qty: number) { this.cartService.updateQuantity(id, qty); }
    removeItem(id: string) { this.cartService.removeFromCart(id); }

    checkout() {
        this.router.navigate(['/checkout']);
    }

    onImgError(event: any) {
        event.target.src = 'https://via.placeholder.com/120?text=Product';
    }
}
