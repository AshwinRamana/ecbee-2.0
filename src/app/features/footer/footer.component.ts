import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantConfigService } from '../../core/services/tenant-config.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer [ngClass]="(tenantService.config | async)?.theme">
      <div class="footer-content">
        <p>&copy; 2024 {{ (tenantService.config | async)?.name }}. Powered by EcBee Multi-Tenant Engine.</p>
        <p class="small">Images served via Cloudfront CDN</p>
      </div>
    </footer>
  `,
  styles: [`
    footer {
      padding: 2rem;
      text-align: center;
      background: #f8f9fa;
      margin-top: auto;
      border-top: 1px solid #eaeaea;
    }
    .fashion { background: var(--primary-color); color: rgba(255,255,255,0.6); }
    .electronics { background: var(--primary-color); color: #8892b0; }
  `]
})
export class FooterComponent {
  constructor(public tenantService: TenantConfigService) { }
}
