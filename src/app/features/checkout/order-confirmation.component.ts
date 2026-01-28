import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TenantConfigService } from '../../core/services/tenant-config.service';
import { TenantConfig } from '../../core/models/tenant.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="confirm-container" *ngIf="config$ | async as config" [ngClass]="config.theme">
      
      <div class="card">
        <div class="check-icon">✓</div>
        
        <!-- DYNAMIC MESSAGING -->
        <h1 *ngIf="config.theme === 'fashion'">Order Placed</h1>
        <h1 *ngIf="config.theme === 'electronics'">Transaction Successful</h1>
        <h1 *ngIf="config.theme === 'grocery'">Order #2039 Confirmed</h1>
        <h1 *ngIf="config.theme === 'restaurant'">Kitchen is Preparing!</h1>
        <h1 *ngIf="config.theme === 'corporate'">Quote Request Sent</h1>

        <p class="subtext">
           Thank you for shopping with {{ config.name }}.
           <span *ngIf="config.theme === 'restaurant'">Estimated delivery: 25 mins.</span>
           <span *ngIf="config.theme === 'corporate'">One of our agents will contact you shortly.</span>
        </p>

        <button routerLink="/home" class="home-btn">Return Home</button>
      </div>

    </div>
  `,
  styles: [`
    .confirm-container {
      min-height: 80vh; display: flex; justify-content: center; align-items: center; background: #f9f9f9; padding: 20px;
    }
    .card {
      background: white; padding: 50px; text-align: center; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); max-width: 500px; width: 100%;
    }
    .check-icon {
      width: 80px; height: 80px; background: #2ecc71; color: white; border-radius: 50%; font-size: 40px; line-height: 80px; margin: 0 auto 20px auto;
    }
    h1 { margin-bottom: 10px; color: #333; }
    .subtext { margin-bottom: 30px; color: #666; line-height: 1.5; }
    
    .home-btn { padding: 12px 30px; border: none; cursor: pointer; background: #333; color: white; font-weight: bold; border-radius: 6px; }

    /* THEME OVERRIDES */
    .confirm-container.electronics { background: #020c1b; }
    .confirm-container.electronics .card { background: #112240; color: #ccd6f6; border: 1px solid #233554; }
    .confirm-container.electronics h1 { color: #64ffda; }
    .confirm-container.electronics .check-icon { background: transparent; border: 2px solid #64ffda; color: #64ffda; }
    .confirm-container.electronics .home-btn { background: transparent; border: 1px solid #64ffda; color: #64ffda; }

    .confirm-container.fashion .check-icon { background: black; }
    .confirm-container.fashion .home-btn { background: black; border-radius: 0; }
  `]
})
export class OrderConfirmationComponent {
  config$: Observable<TenantConfig>;

  constructor(public tenantService: TenantConfigService) {
    this.config$ = this.tenantService.config;
  }
}
