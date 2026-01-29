import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { TenantConfigService } from '../../core/services/tenant-config.service';
import { TenantConfig } from '../../core/models/tenant.model';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { CartComponent } from '../cart/cart.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, CartComponent],
  template: `
    <ng-container *ngIf="config$ | async as config">
      <header [ngClass]="config.theme">
        <div class="logo" routerLink="/home" style="cursor: pointer;">
          <img [src]="config.branding?.logo || (config.cdnBaseUrl + '/logo_' + config.theme + '.png')" alt="Logo" class="logo-img">
        </div>
        
        <nav class="nav-links">
          <a routerLink="/home" routerLinkActive="active">Home</a>
          
          <a *ngIf="config.features.offers" routerLink="/offers">Offers</a>
          
          <div *ngIf="config.features.cart" class="cart-icon-wrapper" (click)="openCart()">
             <span class="cart-emoji">🛒</span>
             <span class="badge" *ngIf="(cartService.count$ | async) as count">{{ count }}</span>
          </div>

          <!-- AUTH SECTION -->
          <ng-container *ngIf="!(authService.currentUser$ | async); else userProfile">
              <a *ngIf="config.features.login" routerLink="/login" class="login-link">Sign In</a>
          </ng-container>
          
          <ng-template #userProfile>
              <div class="profile-dropdown">
                  <span class="user-chip">👤 {{ (authService.currentUser$ | async)?.email.split('@')[0] }}</span>
                  <div class="dropdown-content">
                      <a (click)="logout()">Logout</a>
                  </div>
              </div>
          </ng-template>
        </nav>
      </header>

      <!-- Global Cart Component (Injected here to share config) -->
      <app-cart 
        [layout]="config.uiSettings?.cartTemplate || 'drawer'" 
        [theme]="config.theme">
      </app-cart>

    </ng-container>
  `,
  styles: [`
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: var(--primary-color, white);
      color: var(--accent-color, #333);
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      position: sticky; top: 0; z-index: 100;
    }
    .logo-img { height: 60px; transition: transform 0.3s ease; }
    .logo-img:hover { transform: scale(1.05); }
    .nav-links {
      display: flex;
      gap: 20px;
      align-items: center;
    }
    .nav-links a {
      text-decoration: none;
      color: var(--header-text-color, #333);
      font-weight: 700;
      transition: all 0.2s;
      text-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .nav-links a:hover { opacity: 0.8; transform: translateY(-1px); }
    .cart-emoji { font-size: 1.5rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); }
    
    /* CART ICON */
    .cart-icon-wrapper { position: relative; cursor: pointer; padding: 5px; color: var(--header-text-color); }
    .cart-icon-wrapper:hover { transform: scale(1.1); }
    .badge {
      position: absolute; top: -5px; right: -8px;
      background: #e74c3c; color: white;
      font-size: 0.7rem; font-weight: bold;
      width: 18px; height: 18px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid var(--primary-color);
    }

    /* PROFILE DROPDOWN */
    .profile-dropdown { position: relative; display: inline-block; cursor: pointer; }
    .user-chip { background: rgba(255,255,255,0.2); color: var(--header-text-color); padding: 6px 15px; border-radius: 20px; font-size: 0.9rem; font-weight: 700; backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.1); }
    .dropdown-content { display: none; position: absolute; right: 0; background-color: white; min-width: 120px; box-shadow: 0 8px 16px rgba(0,0,0,0.1); border-radius: 8px; z-index: 1000; }
    .dropdown-content a { color: #e74c3c !important; padding: 12px 16px; text-decoration: none; display: block; border-radius: 8px; font-weight: bold; text-shadow: none; }
    .profile-dropdown:hover .dropdown-content { display: block; }

    /* THEMES */
    header.fashion { background: var(--primary-color); color: var(--header-text-color); }
    header.electronics { background: var(--primary-color); border-bottom: 2px solid rgba(255,255,255,0.1); }
    header.grocery { background: var(--primary-color); }
    header.grocery .user-chip { background: rgba(0,0,0,0.05); }
  `]
})
export class HeaderComponent {
  config$: Observable<TenantConfig> = this.tenantService.config;

  constructor(
    public tenantService: TenantConfigService,
    public cartService: CartService,
    public authService: AuthService,
    private router: Router
  ) { }

  openCart() {
    this.tenantService.config.subscribe(config => {
      if (config.uiSettings?.cartTemplate === 'classic') {
        this.router.navigate(['/cart']);
      } else {
        this.cartService.openCart();
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
