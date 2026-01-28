import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-shell">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="brand">
           <div class="logo-orb">A</div>
           <span>Admin Console</span>
        </div>

        <nav class="side-nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item">
            <span class="icon">📊</span> Dashboard
          </a>
          <a routerLink="/admin/products" routerLinkActive="active" class="nav-item">
            <span class="icon">📦</span> Products
          </a>
          <a routerLink="/admin/orders" routerLinkActive="active" class="nav-item">
            <span class="icon">🧾</span> Orders
          </a>
          <a routerLink="/admin/customize" routerLinkActive="active" class="nav-item">
            <span class="icon">🎨</span> Customize
          </a>
          <div class="nav-divider" *ngIf="(authService.currentUser$ | async)?.role === 'superadmin'"></div>
          <a routerLink="/admin/tenants" routerLinkActive="active" class="nav-item super-only" *ngIf="(authService.currentUser$ | async)?.role === 'superadmin'">
            <span class="icon">🏢</span> Client Onboarding
          </a>
        </nav>

        <div class="user-footer">
          <div class="user-info">
             <span class="user-name">{{ (authService.currentUser$ | async)?.email.split('@')[0] }}</span>
             <span class="user-role">{{ (authService.currentUser$ | async)?.role }}</span>
          </div>
          <button class="logout-link" (click)="logout()">Logout</button>
        </div>
      </aside>

      <!-- MAIN CONTENT AREA -->
      <main class="main-stage">
         <header class="stage-header">
            <div class="page-title">
               <h2>Control Center</h2>
               <p>Manage your multi-tenant ecosystem.</p>
            </div>
         </header>
         
         <div class="content-view">
            <router-outlet></router-outlet>
         </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-shell { display: flex; height: 100vh; background: #f0f2f5; font-family: 'Inter', sans-serif; overflow: hidden; }

    /* SIDEBAR */
    .sidebar { 
      width: 280px; background: #1a1c1e; color: #fff; display: flex; flex-direction: column; padding: 30px 20px;
      box-shadow: 10px 0 30px rgba(0,0,0,0.1); z-index: 10;
    }
    .brand { display: flex; align-items: center; gap: 15px; margin-bottom: 50px; padding: 0 10px; }
    .logo-orb { width: 40px; height: 40px; background: linear-gradient(135deg, var(--accent-color, #00d2d3), var(--primary-color, #2ecc71)); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 20px; }
    .brand span { font-weight: 800; font-size: 18px; letter-spacing: 1px; }

    .side-nav { flex: 1; }
    .nav-item { 
      display: flex; align-items: center; gap: 15px; padding: 14px 18px; color: #94a3b8; text-decoration: none; 
      border-radius: 12px; margin-bottom: 8px; transition: 0.3s; font-weight: 500;
    }
    .nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
    .nav-item.active { background: #334155; color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    .icon { font-size: 20px; }
    .nav-divider { height: 1px; background: rgba(255,255,255,0.1); margin: 20px 0; }
    .super-only { border: 1px dashed rgba(0, 210, 211, 0.3); }

    .user-footer { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 25px; display: flex; justify-content: space-between; align-items: center; }
    .user-info { display: flex; flex-direction: column; }
    .user-name { font-weight: 700; font-size: 14px; }
    .user-role { font-size: 11px; text-transform: uppercase; color: var(--accent-color); letter-spacing: 1px; }
    .logout-link { background: none; border: none; color: #ff4d4d; cursor: pointer; font-weight: 700; font-size: 13px; }

    /* MAIN STAGE */
    .main-stage { flex: 1; display: flex; flex-direction: column; overflow-y: auto; }
    .stage-header { padding: 40px 60px; display: flex; justify-content: space-between; align-items: center; background: #fff; border-bottom: 1px solid #e2e8f0; }
    .page-title h2 { margin: 0; font-size: 28px; font-weight: 800; color: #1e293b; }
    .page-title p { margin: 5px 0 0 0; color: #64748b; }
    
    .btn-primary { background: var(--primary-color); color: var(--accent-color); border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: 0.3s; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }

    .content-view { padding: 40px 60px; }
  `]
})
export class AdminComponent {
  constructor(public authService: AuthService, private router: Router) { }
  logout() { this.authService.logout(); this.router.navigate(['/login']); }
}
