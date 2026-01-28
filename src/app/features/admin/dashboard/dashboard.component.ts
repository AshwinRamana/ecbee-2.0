import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="dashboard-grid" *ngIf="stats$ | async as stats">
      
      <!-- STAT CARDS -->
      <div class="stat-card revenue">
         <div class="card-icon">💰</div>
         <div class="card-content">
            <span class="label">Total Revenue</span>
            <h3 class="value">{{ stats.revenue | currency }}</h3>
         </div>
      </div>

      <div class="stat-card orders">
         <div class="card-icon">🛒</div>
         <div class="card-content">
            <span class="label">Total Orders</span>
            <h3 class="value">{{ stats.totalOrders }}</h3>
         </div>
      </div>

      <div class="stat-card items">
         <div class="card-icon">📦</div>
         <div class="card-content">
            <span class="label">Live Products</span>
            <h3 class="value">{{ stats.totalProducts }}</h3>
         </div>
      </div>

      <!-- RECENT ORDERS TABLE -->
      <div class="table-container full-width">
         <h3>Recent Transactions</h3>
         <table class="admin-table">
            <thead>
               <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
               </tr>
            </thead>
            <tbody>
               <tr *ngFor="let order of stats.recentOrders">
                  <td>#{{ order._id.slice(-6) }}</td>
                  <td>User {{ order.userId.slice(-4) }}</td>
                  <td>{{ order.total | currency }}</td>
                  <td><span class="status-pill" [ngClass]="order.status">{{ order.status }}</span></td>
                  <td>{{ order.createdAt | date:'shortDate' }}</td>
               </tr>
               <tr *ngIf="stats.recentOrders.length === 0">
                   <td colspan="5" class="empty-msg">No recent orders found.</td>
               </tr>
            </tbody>
         </table>
      </div>

    </div>
  `,
    styles: [`
    .dashboard-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
    .full-width { grid-column: 1 / -1; }

    .stat-card { background: #fff; padding: 30px; border-radius: 20px; display: flex; align-items: center; gap: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
    .card-icon { width: 60px; height: 60px; background: #f8fafc; border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 28px; }
    .card-content .label { color: #64748b; font-size: 14px; font-weight: 500; }
    .card-content .value { margin: 5px 0 0 0; font-size: 28px; font-weight: 800; color: #1e293b; }

    .table-container { background: #fff; padding: 30px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
    .table-container h3 { margin: 0 0 25px 0; font-weight: 800; color: #1e293b; }
    .admin-table { width: 100%; border-collapse: collapse; }
    .admin-table th { text-align: left; padding: 15px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; }
    .admin-table td { padding: 20px 15px; color: #334155; font-size: 14px; border-bottom: 1px solid #f8fafc; }
    
    .status-pill { padding: 4px 12px; border-radius: 50px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
    .status-pill.pending { background: #fef3c7; color: #92400e; }
    .status-pill.paid { background: #dcfce7; color: #166534; }
    
    .empty-msg { text-align: center; padding: 40px; color: #94a3b8; font-style: italic; }
  `]
})
export class AdminDashboardComponent implements OnInit {
    stats$: Observable<any>;

    constructor(private adminService: AdminService, private authService: AuthService) {
        const user = this.authService.getCurrentUserValue();
        this.stats$ = this.adminService.getStats(user?.tenantId || 'T001');
    }

    ngOnInit(): void { }
}
