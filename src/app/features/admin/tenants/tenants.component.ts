import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';

@Component({
    selector: 'app-client-onboarding',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="onboarding-container">
      <div class="form-card">
         <h3>🚀 Onboard New Client</h3>
         <p class="subtitle">Deploy a new storefront instance in seconds.</p>

         <form (ngSubmit)="onSubmit()" #tenantForm="ngForm" class="onboarding-form">
            <div class="form-grid">
               <div class="form-group">
                  <label>Client Name</label>
                  <input type="text" [(ngModel)]="tenant.name" name="name" placeholder="e.g. Luxe Boutique" required>
               </div>
               <div class="form-group">
                  <label>Domain / Hostname</label>
                  <input type="text" [(ngModel)]="tenant.domain" name="domain" placeholder="e.g. luxe.ecbee.net" required>
               </div>
               <div class="form-group">
                  <label>Tenant ID (Unique)</label>
                  <input type="text" [(ngModel)]="tenant.tenantId" name="tenantId" placeholder="e.g. T009" required>
               </div>
               <div class="form-group">
                  <label>Template / Theme</label>
                  <select [(ngModel)]="tenant.theme" name="theme" (change)="onThemeChange()">
                     <option value="fashion">Fashion (Drawer Cart)</option>
                     <option value="electronics">Electronics (Overlay Cart)</option>
                     <option value="grocery">Grocery (Classic Page)</option>
                     <option value="restaurant">Restaurant (Menu Layout)</option>
                  </select>
               </div>
            </div>

            <div class="preview-section" [ngClass]="tenant.theme">
               <h4>Live Theme Preview</h4>
               <div class="preview-card">
                  <div class="preview-header">
                     <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
                  </div>
                  <div class="preview-content">
                     <strong>{{ tenant.name || 'Brand Name' }}</strong>
                     <p>Selected Layout: {{ tenant.uiSettings.homeLayout }}</p>
                     <div class="preview-theme-bar" [style.background]="getThemeColor()"></div>
                  </div>
               </div>
            </div>

            <div class="form-actions">
               <button type="button" class="btn-secondary" (click)="resetForm()">Reset</button>
               <button type="submit" class="btn-primary" [disabled]="!tenantForm.valid || loading">
                  {{ loading ? 'Deploying...' : 'Deploy Client Site' }}
               </button>
            </div>
         </form>
      </div>

      <div class="tenants-list-card">
         <h3>Active Clients</h3>
         <div class="tenant-table-wrapper">
            <table class="tenant-table">
               <thead>
                  <tr>
                     <th>ID</th>
                     <th>Name</th>
                     <th>Domain</th>
                     <th>Theme</th>
                     <th>Status</th>
                  </tr>
               </thead>
               <tbody>
                  <tr *ngFor="let t of activeTenants">
                     <td>{{ t.tenantId }}</td>
                     <td><strong>{{ t.name }}</strong></td>
                     <td>{{ t.domain }}</td>
                     <td><span class="theme-tag">{{ t.theme }}</span></td>
                     <td><span class="status-active">Live</span></td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  `,
    styles: [`
    .onboarding-container { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    @media (max-width: 1200px) { .onboarding-container { grid-template-columns: 1fr; } }

    .form-card, .tenants-list-card { background: #fff; padding: 40px; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
    h3 { margin: 0 0 10px 0; font-size: 24px; font-weight: 800; }
    .subtitle { color: #64748b; margin-bottom: 30px; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
    .form-group { display: flex; flex-direction: column; gap: 8px; }
    .form-group label { font-size: 13px; font-weight: 700; color: #475569; }
    .form-group input, .form-group select { padding: 12px 16px; border-radius: 12px; border: 1px solid #e2e8f0; outline: none; transition: 0.3s; }
    .form-group input:focus { border-color: #00d2d3; box-shadow: 0 0 0 4px rgba(0, 210, 211, 0.1); }

    .preview-section { margin-top: 30px; padding-top: 30px; border-top: 1px solid #f1f5f9; }
    .preview-card { background: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; margin-top: 15px; overflow: hidden; }
    .preview-header { padding: 10px 15px; background: #e2e8f0; display: flex; gap: 6px; }
    .dot { width: 8px; height: 8px; border-radius: 50%; }
    .dot.red { background: #ff5f56; }
    .dot.yellow { background: #ffbd2e; }
    .dot.green { background: #27c93f; }
    .preview-content { padding: 25px; }
    .preview-theme-bar { height: 8px; border-radius: 4px; margin-top: 15px; width: 60px; }

    .form-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 40px; }
    .btn-primary { background: #1a1c1e; color: #fff; border: none; padding: 14px 30px; border-radius: 12px; font-weight: 700; cursor: pointer; }
    .btn-secondary { background: #f1f5f9; color: #475569; border: none; padding: 14px 30px; border-radius: 12px; font-weight: 700; cursor: pointer; }

    .tenant-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .tenant-table th { text-align: left; padding: 15px; color: #64748b; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; }
    .tenant-table td { padding: 18px 15px; border-bottom: 1px solid #f8fafc; font-size: 14px; }
    .theme-tag { background: #f1f5f9; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .status-active { color: #22c55e; font-weight: 800; font-size: 12px; }
  `]
})
export class ClientOnboardingComponent implements OnInit {
    tenant: any = {
        name: '',
        domain: '',
        tenantId: '',
        theme: 'fashion',
        cdnBaseUrl: 'https://d18xkwaipu1whh.cloudfront.net/test_2.0',
        uiSettings: { loginTemplate: 'glass', cartTemplate: 'drawer', homeLayout: 'hero-grid' },
        features: { login: true, cart: true, offers: true }
    };

    activeTenants: any[] = [];
    loading: boolean = false;

    constructor(private adminService: AdminService) { }

    ngOnInit(): void {
        this.loadTenants();
    }

    loadTenants() {
        this.adminService.getTenants().subscribe(data => this.activeTenants = data);
    }

    onThemeChange() {
        switch (this.tenant.theme) {
            case 'fashion':
                this.tenant.uiSettings = { loginTemplate: 'glass', cartTemplate: 'drawer', homeLayout: 'hero-grid' };
                break;
            case 'electronics':
                this.tenant.uiSettings = { loginTemplate: 'split', cartTemplate: 'overlay', homeLayout: 'category-nav' };
                break;
            case 'grocery':
                this.tenant.uiSettings = { loginTemplate: 'minimal', cartTemplate: 'classic', homeLayout: 'minimal' };
                break;
            case 'restaurant':
                this.tenant.uiSettings = { loginTemplate: 'glass', cartTemplate: 'overlay', homeLayout: 'menu' };
                break;
        }
    }

    getThemeColor() {
        switch (this.tenant.theme) {
            case 'fashion': return '#000000';
            case 'electronics': return '#00d2d3';
            case 'grocery': return '#2ecc71';
            case 'restaurant': return '#e67e22';
            default: return '#1a1c1e';
        }
    }

    onSubmit() {
        this.loading = true;
        this.adminService.createTenant(this.tenant).subscribe({
            next: () => {
                this.loading = false;
                this.resetForm();
                this.loadTenants();
                alert('Client Site Deployed Successfully!');
            },
            error: (err) => {
                this.loading = false;
                alert('Error: ' + err.message);
            }
        });
    }

    resetForm() {
        this.tenant = {
            name: '',
            domain: '',
            tenantId: '',
            theme: 'fashion',
            cdnBaseUrl: 'https://d18xkwaipu1whh.cloudfront.net/test_2.0',
            uiSettings: { loginTemplate: 'glass', cartTemplate: 'drawer', homeLayout: 'hero-grid' },
            features: { login: true, cart: true, offers: true }
        };
    }
}
