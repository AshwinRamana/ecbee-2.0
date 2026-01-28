import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-admin-orders',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="orders-mgmt">
      <div class="table-card">
         <div class="header-row">
            <h3>Sales History</h3>
            <div class="filters">
               <button class="filter-btn active">All Orders</button>
               <button class="filter-btn">Pending</button>
               <button class="filter-btn">Completed</button>
            </div>
         </div>

         <table class="mgmt-table">
            <thead>
               <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
               </tr>
            </thead>
            <tbody>
               <tr *ngFor="let o of orders">
                  <td><strong>#{{ o._id.slice(-6) }}</strong></td>
                  <td>{{ o.createdAt | date:'mediumDate' }}</td>
                  <td>User {{ o.userId.slice(-4) }}</td>
                  <td><strong>{{ o.total | currency }}</strong></td>
                  <td>
                     <select class="status-select" [value]="o.status" (change)="updateStatus(o._id, $event)">
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                     </select>
                  </td>
                  <td>
                     <button class="btn-detail" (click)="viewDetail(o)">View Items</button>
                  </td>
               </tr>
               <tr *ngIf="orders.length === 0">
                   <td colspan="6" class="empty-state">No orders found for this tenant.</td>
               </tr>
            </tbody>
         </table>
      </div>
    </div>
  `,
    styles: [`
    .orders-mgmt { padding-top: 20px; }
    .table-card { background: #fff; border-radius: 24px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
    
    .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .header-row h3 { margin: 0; font-size: 22px; font-weight: 800; }
    .filters { display: flex; gap: 10px; }
    .filter-btn { background: #f1f5f9; border: none; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 700; color: #64748b; cursor: pointer; }
    .filter-btn.active { background: #1e293b; color: #fff; }

    .mgmt-table { width: 100%; border-collapse: collapse; }
    .mgmt-table th { text-align: left; padding: 15px; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; }
    .mgmt-table td { padding: 20px 15px; border-bottom: 1px solid #f8fafc; font-size: 14px; }
    
    .status-select { padding: 6px 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; outline: none; }
    .btn-detail { background: none; border: 1px solid #e2e8f0; padding: 6px 15px; border-radius: 8px; font-size: 12px; font-weight: 700; color: #1e293b; cursor: pointer; transition: 0.3s; }
    .btn-detail:hover { background: #1e293b; color: #fff; }

    .empty-state { text-align: center; padding: 60px; color: #94a3b8; font-style: italic; }
  `]
})
export class OrderManagementComponent implements OnInit {
    orders: any[] = [];

    constructor(private adminService: AdminService, private authService: AuthService) { }

    ngOnInit(): void {
        this.loadOrders();
    }

    loadOrders() {
        const user = this.authService.getCurrentUserValue();
        this.adminService.getOrders(user.tenantId).subscribe(data => this.orders = data);
    }

    updateStatus(id: string, event: any) {
        const newStatus = event.target.value;
        // Implementation needed in AdminService
        console.log('Updating order status:', id, newStatus);
        alert('Status updated locally! (Implementation pending)');
    }

    viewDetail(order: any) {
        alert('Items:\n' + order.items.map((i: any) => `- ${i.name} (x${i.quantity})`).join('\n'));
    }
}
