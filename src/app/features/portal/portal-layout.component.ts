import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-portal-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="portal-root">
      <nav class="portal-nav">
        <div class="nav-content">
          <div class="brand">
            <span class="logo-icon">🚀</span>
            <span class="brand-name">ecBee <span class="portal-tag">Portal</span></span>
          </div>
          <div class="nav-links">
            <a routerLink="/portal/dashboard" routerLinkActive="active">Dashboard</a>
            <a routerLink="/portal/billing" routerLinkActive="active">Billing</a>
            <button class="btn-support">Support</button>
          </div>
        </div>
      </nav>

      <main class="portal-main">
        <router-outlet></router-outlet>
      </main>

      <footer class="portal-footer">
        <p>&copy; 2026 ecBee Enterprise Solutions. Built for Scale.</p>
      </footer>
    </div>
  `,
    styles: [`
    .portal-root {
      min-height: 100vh;
      background: #f8fafc;
      color: #1e293b;
      font-family: 'Inter', system-ui, sans-serif;
      display: flex;
      flex-direction: column;
    }

    .portal-nav {
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      padding: 1rem 2rem;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }

    .nav-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.025em;
    }

    .portal-tag {
      background: #eff6ff;
      color: #3b82f6;
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 9999px;
      vertical-align: middle;
      font-weight: 600;
      margin-left: 4px;
    }

    .nav-links {
      display: flex;
      gap: 32px;
      align-items: center;
    }

    .nav-links a {
      text-decoration: none;
      color: #64748b;
      font-weight: 500;
      font-size: 0.95rem;
      transition: color 0.2s;
    }

    .nav-links a.active {
      color: #3b82f6;
    }

    .btn-support {
      background: #1e293b;
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-support:hover {
      background: #334155;
    }

    .portal-main {
      flex: 1;
      padding: 40px 20px;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }

    .portal-footer {
      padding: 2rem;
      text-align: center;
      color: #94a3b8;
      font-size: 0.875rem;
      border-top: 1px solid #e2e8f0;
      background: white;
    }
  `]
})
export class PortalLayoutComponent { }
