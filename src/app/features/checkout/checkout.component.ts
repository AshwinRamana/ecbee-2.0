import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TenantConfigService } from '../../core/services/tenant-config.service';
import { CartService } from '../../core/services/cart.service';
import { TenantConfig } from '../../core/models/tenant.model';
import { Observable, take } from 'rxjs';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="checkout-container" *ngIf="config$ | async as config" [ngClass]="config.theme">
      
      <!-- FASHION CHECKOUT: Accordion / Minimal -->
      <div *ngIf="config.theme === 'fashion'" class="layout-fashion">
        <h1>Secure Checkout</h1>
        <div class="accordion">
          <div class="step active">
            <h3>1. Shipping Address</h3>
            <form>
               <input type="text" placeholder="Full Name">
               <input type="text" placeholder="Address Line 1">
               <input type="text" placeholder="City">
            </form>
          </div>
          <div class="step">
            <h3>2. Payment Method</h3>
            <p>Credit Card ending in ...0000</p>
          </div>
        </div>
        <button class="pay-btn" (click)="placeOrder()">Place Order</button>
      </div>

      <!-- ELECTRONICS CHECKOUT: Wizard Steps -->
      <div *ngIf="config.theme === 'electronics'" class="layout-electronics">
        <div class="progress-bar">
          <div class="step completed">Cart</div>
          <div class="step active">Shipping</div>
          <div class="step">Payment</div>
        </div>
        
        <div class="tech-panel">
          <h3>Shipping Details</h3>
          <div class="grid-form">
            <input type="text" placeholder="First Name">
            <input type="text" placeholder="Last Name">
            <input type="email" placeholder="Email Address">
          </div>
          <div class="summary">
            <h4>Total: {{ cartService.total$ | async | currency }}</h4>
          </div>
          <button class="tech-btn" (click)="placeOrder()">Proceed to Payment >></button>
        </div>
      </div>

      <!-- GROCERY CHECKOUT: Fast & Slots -->
      <div *ngIf="config.theme === 'grocery'" class="layout-grocery">
        <h2>Checkout</h2>
        <div class="split-view">
          <div class="details">
            <h3>Delivery Slot</h3>
            <div class="slots">
              <button class="slot selected">Today, 5PM-7PM</button>
              <button class="slot">Tomorrow, 7AM-9AM</button>
            </div>
            
            <h3>Address</h3>
            <textarea placeholder="Delivery Instructions..."></textarea>
          </div>
          
          <div class="cart-summary">
             <h3>Receipt</h3>
             <div class="total">To Pay: {{ cartService.total$ | async | currency }}</div>
             <button class="pay-green" (click)="placeOrder()">Confirm Order</button>
          </div>
        </div>
      </div>
      
      <!-- RESTAURANT CHECKOUT -->
      <div *ngIf="config.theme === 'restaurant'" class="layout-restaurant">
        <h1>Finalize Order</h1>
        <div class="order-card">
           <label>Delivery or Pickup?</label>
           <select><option>Delivery</option><option>Pickup</option></select>
           
           <label>Tip your driver</label>
           <div class="tips">
             <button>10%</button><button class="active">15%</button><button>20%</button>
           </div>
           
           <button class="yummy-btn" (click)="placeOrder()">Hungry! Place Order</button>
        </div>
      </div>

       <!-- CORPORATE CHECKOUT: Quote Request -->
       <div *ngIf="config.theme === 'corporate'" class="layout-corporate">
         <h1>Request for Quote</h1>
         <p>Please provide your company details for PO generation.</p>
         
         <form class="corp-form">
           <div class="row">
             <input type="text" placeholder="Company Name">
             <input type="text" placeholder="Tax ID">
           </div>
           <input type="text" placeholder="Purchase Order # (Optional)">
           <textarea placeholder="Additional Requirements"></textarea>
           
           <button class="corp-btn" (click)="placeOrder()">Submit Request</button>
         </form>
       </div>

    </div>
  `,
  styles: [`
    .checkout-container { max-width: 1000px; margin: 40px auto; padding: 20px; }
    input, textarea, select { width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    
    /* FASHION */
    .layout-fashion h1 { text-align: center; font-family: serif; letter-spacing: 1px; }
    .layout-fashion .step { border-bottom: 1px solid #eee; padding: 20px 0; }
    .layout-fashion .step h3 { margin: 0 0 10px 0; font-weight: normal; }
    .layout-fashion .pay-btn { width: 100%; padding: 15px; background: black; color: white; border: none; font-size: 1.1rem; cursor: pointer; margin-top: 20px; }

    /* ELECTRONICS */
    .layout-electronics { background: #0b1c2c; padding: 30px; border-radius: 8px; color: #ccd6f6; border: 1px solid #1f4068; }
    .layout-electronics input { background: #112240; border: 1px solid #233554; color: white; }
    .progress-bar { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #233554; padding-bottom: 10px; }
    .step { color: #8892b0; }
    .step.active { color: #64ffda; font-weight: bold; }
    .tech-btn { background: transparent; border: 1px solid #64ffda; color: #64ffda; padding: 12px 25px; cursor: pointer; float: right; }
    .tech-btn:hover { background: rgba(100, 255, 218, 0.1); }

    /* GROCERY */
    .layout-grocery .split-view { display: flex; gap: 30px; flex-wrap: wrap; }
    .layout-grocery .details { flex: 2; min-width: 300px; }
    .layout-grocery .cart-summary { flex: 1; background: #f9f9f9; padding: 20px; border-radius: 8px; min-width: 250px; }
    .slots { display: flex; gap: 10px; margin-bottom: 20px; }
    .slot { padding: 10px; border: 1px solid #ddd; background: white; cursor: pointer; }
    .slot.selected { border-color: #2ecc71; background: #e8f5e9; }
    .pay-green { width: 100%; background: #2ecc71; color: white; padding: 15px; border: none; font-weight: bold; cursor: pointer; margin-top: 10px; border-radius: 4px; }

    /* RESTAURANT */
    .layout-restaurant { text-align: center; max-width: 500px; margin: 0 auto; }
    .tips { display: flex; gap: 10px; justify-content: center; margin-bottom: 20px; }
    .tips button { padding: 10px 20px; border: 1px solid #ddd; background: white; cursor: pointer; }
    .tips button.active { background: #e67e22; color: white; border-color: #e67e22; }
    .yummy-btn { width: 100%; background: #d35400; color: white; padding: 15px; border: none; font-weight: bold; cursor: pointer; border-radius: 50px; font-size: 1.2rem; }

    /* CORPORATE */
    .layout-corporate { background: white; border: 1px solid #ccc; padding: 40px; }
    .layout-corporate h1 { border-bottom: 4px solid #333; padding-bottom: 10px; margin-bottom: 30px; }
    .row { display: flex; gap: 20px; }
    .corp-btn { background: #333; color: white; padding: 12px 30px; border: none; cursor: pointer; }
  `]
})
export class CheckoutComponent {
  config$: Observable<TenantConfig>;

  constructor(
    public tenantService: TenantConfigService,
    public cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {
    this.config$ = this.tenantService.config;
  }

  placeOrder() {
    const user = this.authService.getCurrentUserValue();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.tenantService.config.pipe(take(1)).subscribe(config => {
      this.cartService.cart$.pipe(take(1)).subscribe(items => {
        this.cartService.total$.pipe(take(1)).subscribe(total => {

          const orderData = {
            tenantId: config.tenantId,
            userId: user.id || user._id,
            items: items.map(i => ({
              productId: i.id,
              name: i.name,
              price: i.price,
              quantity: i.quantity,
              image: i.image
            })),
            total: total,
            shippingAddress: {
              street: '123 Test St',
              city: 'Demo City',
              state: 'DS',
              zip: '12345',
              country: 'USA'
            },
            paymentStatus: 'paid' // Defaulting for demo
          };

          this.orderService.createOrder(orderData).subscribe({
            next: () => {
              this.cartService.clearCart();
              this.router.navigate(['/order-confirmation']);
            },
            error: (err) => {
              alert('Failed to place order: ' + err.message);
            }
          });
        });
      });
    });
  }
}
