import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-onboarding-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="wizard-container">
      <!-- PROGRESS HEADER -->
      <div class="wizard-header">
        <div class="step-indicator" [class.active]="currentStep >= 1" [class.completed]="currentStep > 1">
          <div class="circle">1</div>
          <span>Plan & Identity</span>
        </div>
        <div class="line" [class.active]="currentStep > 1"></div>
        <div class="step-indicator" [class.active]="currentStep >= 2" [class.completed]="currentStep > 2">
          <div class="circle">2</div>
          <span>Design Studio</span>
        </div>
        <div class="line" [class.active]="currentStep > 2"></div>
        <div class="step-indicator" [class.active]="currentStep >= 3" [class.completed]="currentStep > 3">
          <div class="circle">3</div>
          <span>Review & Deploy</span>
        </div>
      </div>

      <!-- STEP CONTENT -->
      <div class="wizard-content card">
        
        <!-- STEP 1: IDENTITY & PLAN -->
        <div *ngIf="currentStep === 1" class="step-pane animate-in">
          <div class="pane-header">
            <h2>Let's build your brand</h2>
            <p>Tell us about your business and choose a growth plan.</p>
          </div>
          
          <div class="form-grid">
            <div class="input-group">
              <label>Business Name</label>
              <input type="text" [(ngModel)]="data.name" placeholder="e.g. Skyline Electronics">
            </div>
            <div class="input-group">
              <label>Target Domain</label>
              <div class="url-input">
                <input type="text" [(ngModel)]="data.domain" placeholder="client4">
                <span class="suffix">.ecbee.net</span>
              </div>
            </div>
          </div>

          <div class="plans-toggle">
            <button [class.active]="billingCycle === 'monthly'" (click)="billingCycle = 'monthly'">Monthly</button>
            <button [class.active]="billingCycle === 'annual'" (click)="billingCycle = 'annual'">
              Annual <span class="discount">Save 20%</span>
            </button>
          </div>

          <div class="plans-grid">
            <div class="plan-card" [class.selected]="data.package === 'starter'" (click)="data.package = 'starter'">
              <div class="plan-header">
                <h3>Starter</h3>
                <div class="price">
                  <span class="currency">$</span>
                  <span class="amount">{{ billingCycle === 'monthly' ? '29' : '23' }}</span>
                  <span class="period">/mo</span>
                </div>
              </div>
              <ul class="features">
                <li>✅ 100 Products</li>
                <li>✅ Standard Analytics</li>
                <li>✅ Community Support</li>
              </ul>
            </div>

            <div class="plan-card featured" [class.selected]="data.package === 'pro'" (click)="data.package = 'pro'">
              <div class="tag">Most Popular</div>
              <div class="plan-header">
                <h3>Pro</h3>
                <div class="price">
                  <span class="currency">$</span>
                  <span class="amount">{{ billingCycle === 'monthly' ? '79' : '63' }}</span>
                  <span class="period">/mo</span>
                </div>
              </div>
              <ul class="features">
                <li>✅ Unlimited Products</li>
                <li>✅ Advanced SEO</li>
                <li>✅ Priority 24/7 Support</li>
              </ul>
            </div>

            <div class="plan-card" [class.selected]="data.package === 'enterprise'" (click)="data.package = 'enterprise'">
              <div class="plan-header">
                <h3>Enterprise</h3>
                <div class="price">Custom</div>
              </div>
              <ul class="features">
                <li>✅ Dedicated Manager</li>
                <li>✅ Custom Integrations</li>
                <li>✅ SLA Guarantee</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- STEP 2: DESIGN STUDIO -->
        <div *ngIf="currentStep === 2" class="step-pane animate-in">
           <div class="design-studio">
             <div class="controls">
                <h2>Design Studio</h2>
                <p>Customize your brand identity and modular layouts.</p>
                
                <div class="design-grid">
                  <div class="design-group">
                    <label class="group-title">Brand Assets</label>
                    <div class="control-section">
                      <label>Primary Colors</label>
                      <div class="color-pickers">
                        <div class="picker">
                          <span>Primary</span>
                          <input type="color" [(ngModel)]="data.branding.primaryColor">
                        </div>
                        <div class="picker">
                          <span>Secondary</span>
                          <input type="color" [(ngModel)]="data.branding.secondaryColor">
                        </div>
                      </div>
                    </div>
                    <div class="control-section">
                      <label>Logo URL</label>
                      <input type="text" [(ngModel)]="data.branding.logo" placeholder="https://.../logo.png" class="asset-input">
                    </div>
                    <div class="control-section">
                      <label>Banner URL</label>
                      <input type="text" [(ngModel)]="data.uiSettings.bannerUrl" placeholder="https://.../banner.jpg" class="asset-input">
                    </div>
                  </div>

                  <div class="design-group">
                    <label class="group-title">Core Layouts</label>
                    <div class="control-section">
                      <label>Home Page</label>
                      <select [(ngModel)]="data.uiSettings.homeTemplate">
                        <option value="hero-grid">Immersive Hero (V1)</option>
                        <option value="minimal">Minimal Grid (V2)</option>
                        <option value="marketplace">Modern Marketplace (V3)</option>
                      </select>
                    </div>
                    <div class="control-section">
                      <label>Product Template</label>
                      <select [(ngModel)]="data.uiSettings.productTemplate">
                        <option value="fashion">Fashion (Size Chips)</option>
                        <option value="electronics">Tech (Detailed Specs)</option>
                        <option value="grocery">Grocery (Weight/Unit focus)</option>
                        <option value="restaurant">Menu (Ingredients/Long Desc)</option>
                      </select>
                    </div>
                    <div class="control-section">
                      <label>Variant Type (Option Label)</label>
                      <select [(ngModel)]="data.uiSettings.variantLabel">
                        <option value="Size">Fashion: Size</option>
                        <option value="Color">Fashion: Color</option>
                        <option value="Model">Tech: Model / Version</option>
                        <option value="Power">Tech: Power Variant</option>
                        <option value="Weight">Grocery: Weight</option>
                        <option value="Portion">Restaurant: Portion Size</option>
                      </select>
                    </div>
                  </div>

                  <div class="design-group">
                    <label class="group-title">Shopping Experience</label>
                    <div class="control-section">
                      <label>Cart Style</label>
                      <select [(ngModel)]="data.uiSettings.cartTemplate">
                        <option value="drawer">Slide-out Drawer</option>
                        <option value="overlay">Glass Overlay</option>
                        <option value="classic">Dedicated Page</option>
                      </select>
                    </div>
                    <div class="control-section">
                      <label>Checkout Flow</label>
                      <select [(ngModel)]="data.uiSettings.checkoutTemplate">
                        <option value="standard">Multi-step Pro</option>
                        <option value="one-page">Express One-Page</option>
                      </select>
                    </div>
                  </div>

                  <div class="design-group">
                    <label class="group-title">User Account</label>
                    <div class="control-section">
                      <label>Login Experience</label>
                      <select [(ngModel)]="data.uiSettings.loginTemplate">
                        <option value="minimal">Minimalist Card</option>
                        <option value="glass">Retro Glassmorphism</option>
                        <option value="split">Modern Split-Screen</option>
                      </select>
                    </div>
                  </div>
                </div>
             </div>

             <div class="preview-frame">
               <div class="frame-header">
                 <div class="dots"><span></span><span></span><span></span></div>
                 <div class="address">{{ data.domain || 'client4' }}.ecbee.net</div>
               </div>
               <div class="live-preview" [style.--p]="data.branding.primaryColor" [style.--s]="data.branding.secondaryColor">
                  <div class="mock-nav" [style.background]="'var(--p)'">
                    <img *ngIf="data.branding.logo" [src]="data.branding.logo" class="mock-logo">
                  </div>
                  
                  <!-- Dynamic Mock Content based on Home Template -->
                  <div class="mock-content" [ngSwitch]="data.uiSettings.homeTemplate">
                    <div *ngSwitchCase="'hero-grid'" class="hero-v1">
                      <div class="mock-hero-xl" [style.backgroundImage]="'url(' + (data.uiSettings.bannerUrl || '') + ')'" [style.backgroundSize]="'cover'">
                        <div class="mock-text-lg"></div>
                        <div class="mock-btn-lg" [style.background]="'var(--s)'"></div>
                      </div>
                    </div>
                    <div *ngSwitchCase="'minimal'" class="hero-v2">
                      <div class="mock-grid-tight">
                        <div class="item-sm"></div><div class="item-sm"></div><div class="item-sm"></div>
                      </div>
                    </div>
                    <div *ngSwitchDefault class="hero-v3">
                      <div class="mock-banner-wide" [style.border-color]="'var(--p)'" [style.backgroundImage]="'url(' + (data.uiSettings.bannerUrl || '') + ')'" [style.backgroundSize]="'cover'"></div>
                      <div class="mock-grid-wide">
                        <div class="box"></div><div class="box"></div>
                      </div>
                    </div>
                  </div>

                  <div class="preview-overlay">
                    <span class="badge" [style.background]="'var(--p)'">LIVE PREVIEW</span>
                  </div>
               </div>
             </div>
           </div>
        </div>

        <!-- STEP 3: REVIEW -->
        <div *ngIf="currentStep === 3" class="step-pane animate-in final-step">
          <div class="success-icon">✨</div>
          <h2>Ready for Launch?</h2>
          <p>Your storefront is configured and ready to be deployed to <strong>{{ data.domain }}.ecbee.net</strong></p>
          
          <div class="summary-box">
             <div class="sum-row"><span>Plan</span><strong>{{ data.package }} ({{ billingCycle }})</strong></div>
             <div class="sum-row"><span>Theme</span><strong>{{ data.uiSettings.homeTemplate }}</strong></div>
             <div class="sum-row"><span>Colors</span>
                <div class="swatch-pair">
                  <div [style.background]="data.branding.primaryColor"></div>
                  <div [style.background]="data.branding.secondaryColor"></div>
                </div>
             </div>
          </div>
        </div>

      </div>

      <!-- FOOTER ACTIONS -->
      <div class="wizard-footer">
        <button class="btn-back" *ngIf="currentStep > 1" (click)="currentStep = currentStep - 1">Back</button>
        <div class="spacer"></div>
        <button class="btn-next" (click)="next()">
          {{ currentStep === 3 ? 'Go Live 🚀' : 'Continue' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .wizard-container { max-width: 1100px; margin: 0 auto; }
    
    .wizard-header { display: flex; align-items: center; justify-content: center; margin-bottom: 40px; padding: 0 40px; }
    .step-indicator { display: flex; flex-direction: column; align-items: center; gap: 8px; color: #94a3b8; font-size: 0.85rem; font-weight: 600; width: 120px; }
    .step-indicator.active { color: #3b82f6; }
    .step-indicator.completed .circle { background: #22c55e; color: white; border-color: #22c55e; }
    .circle { width: 32px; height: 32px; border-radius: 50%; border: 2px solid #e2e8f0; display: flex; align-items: center; justify-content: center; background: white; transition: 0.3s; }
    .step-indicator.active .circle { border-color: #3b82f6; color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
    .line { flex: 1; height: 2px; background: #e2e8f0; margin-bottom: 24px; max-width: 100px; }
    .line.active { background: #3b82f6; }

    .card { background: white; border-radius: 24px; padding: 48px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.03); min-height: 500px; }
    
    .pane-header { margin-bottom: 40px; }
    .pane-header h2 { font-size: 2rem; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.025em; }
    .pane-header p { color: #64748b; font-size: 1.1rem; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 50px; }
    .input-group { display: flex; flex-direction: column; gap: 10px; }
    .input-group label { font-size: 0.9rem; font-weight: 700; color: #1e293b; }
    .input-group input { padding: 14px 18px; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 1rem; outline: none; transition: 0.2s; }
    .input-group input:focus { border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
    
    .url-input { position: relative; display: flex; align-items: center; }
    .url-input input { flex: 1; padding-right: 100px; }
    .url-input .suffix { position: absolute; right: 18px; color: #94a3b8; font-weight: 600; font-size: 0.9rem; }

    .plans-toggle { display: flex; background: #f1f5f9; padding: 4px; border-radius: 12px; width: fit-content; margin: 0 auto 30px; }
    .plans-toggle button { border: none; padding: 10px 24px; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 0.9rem; transition: 0.2s; background: transparent; color: #64748b; }
    .plans-toggle button.active { background: white; color: #1e293b; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .discount { background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-left: 4px; }

    .plans-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .plan-card { padding: 30px; border-radius: 20px; border: 2px solid #f1f5f9; cursor: pointer; transition: 0.3s; position: relative; }
    .plan-card:hover { transform: translateY(-4px); border-color: #e2e8f0; }
    .plan-card.selected { border-color: #3b82f6; background: #eff6ff; }
    .plan-card.featured { border-color: #3b82f6; border-width: 2px; }
    .plan-card .tag { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #3b82f6; color: white; padding: 4px 12px; border-radius: 999px; font-size: 0.7rem; font-weight: 800; }
    .plan-header h3 { margin: 0; font-size: 1.3rem; margin-bottom: 15px; }
    .price { font-size: 2rem; font-weight: 800; margin-bottom: 25px; }
    .price .currency { font-size: 1rem; vertical-align: top; margin-top: 8px; display: inline-block; }
    .price .period { font-size: 0.9rem; color: #94a3b8; font-weight: 500; }
    .features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; font-size: 0.9rem; color: #475569; }

    /* DESIGN STUDIO */
    .design-studio { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .design-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; overflow-y: auto; max-height: 500px; padding-right: 15px; }
    .design-group { background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #e2e8f0; }
    .group-title { display: block; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; }
    .control-section { margin-bottom: 20px; }
    .control-section label { display: block; font-weight: 700; font-size: 0.85rem; margin-bottom: 12px; color: #1e293b; }
    .asset-input { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.8rem; }
    .mock-logo { height: 24px; margin: 8px; border-radius: 4px; }
    .color-pickers { display: flex; gap: 24px; }
    .picker { display: flex; flex-direction: column; gap: 8px; align-items: center; }
    .picker span { font-size: 0.75rem; color: #64748b; font-weight: 600; }
    input[type="color"] { width: 60px; height: 60px; border-radius: 12px; border: none; cursor: pointer; background: none; }
    select { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 600; outline: none; }

    .preview-frame { background: #1e293b; border-radius: 16px; padding: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
    .frame-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; padding: 0 8px; }
    .dots { display: flex; gap: 6px; }
    .dots span { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.2); }
    .address { color: rgba(255,255,255,0.4); font-size: 0.75rem; font-family: monospace; }
    .live-preview { background: white; border-radius: 8px; height: 400px; position: relative; overflow: hidden; padding: 0; display: flex; flex-direction: column; }
    .mock-nav { height: 40px; width: 100%; flex-shrink: 0; }
    .mock-content { flex: 1; padding: 20px; display: flex; flex-direction: column; gap: 20px; }
    
    .hero-v1 .mock-hero-xl { height: 160px; background: #f1f5f9; border-radius: 12px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 16px; }
    .mock-text-lg { width: 160px; height: 12px; background: #e2e8f0; border-radius: 6px; }
    .mock-btn-lg { width: 100px; height: 40px; border-radius: 8px; }
    
    .hero-v2 .mock-grid-tight { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .item-sm { height: 100px; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; }
    
    .hero-v3 .mock-banner-wide { height: 80px; border: 2px dashed #cbd5e1; border-radius: 12px; margin-bottom: 20px; }
    .mock-grid-wide { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .mock-grid-wide .box { height: 120px; background: #f1f5f9; border-radius: 12px; }

    .preview-overlay { position: absolute; top: 50px; right: 10px; }
    .badge { color: white; padding: 4px 10px; border-radius: 6px; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.05em; }
    .preview-label { position: absolute; bottom: 20px; width: 100%; text-align: center; color: #94a3b8; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }

    /* FINAL STEP */
    .final-step { text-align: center; padding: 60px 0; }
    .success-icon { font-size: 4rem; margin-bottom: 24px; }
    .summary-box { max-width: 400px; margin: 40px auto; background: #f8fafc; border-radius: 16px; padding: 24px; border: 1px solid #f1f5f9; }
    .sum-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 0.95rem; }
    .sum-row:last-child { border: none; }
    .sum-row span { color: #64748b; }
    .swatch-pair { display: flex; gap: 8px; }
    .swatch-pair div { width: 24px; height: 24px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.1); }

    .wizard-footer { display: flex; align-items: center; margin-top: 40px; }
    .btn-next { background: #3b82f6; color: white; border: none; padding: 16px 48px; border-radius: 12px; font-weight: 800; font-size: 1.1rem; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4); }
    .btn-next:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5); }
    .btn-back { background: transparent; color: #64748b; border: none; font-weight: 700; cursor: pointer; font-size: 1rem; }
    .spacer { flex: 1; }

    .animate-in { animation: slideUp 0.5s ease-out; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class OnboardingWizardComponent {
  currentStep = 1;
  billingCycle: 'monthly' | 'annual' = 'monthly';

  data = {
    name: '',
    domain: 'client4',
    package: 'pro',
    branding: {
      primaryColor: '#3b82f6',
      secondaryColor: '#1e293b',
      logo: ''
    },
    uiSettings: {
      homeTemplate: 'hero-grid',
      loginTemplate: 'glass',
      cartTemplate: 'drawer',
      productTemplate: 'standard',
      checkoutTemplate: 'standard',
      bannerUrl: '',
      variantLabel: 'Size'
    }
  };

  constructor(private adminService: AdminService, private router: Router) { }

  next() {
    if (this.currentStep < 3) {
      this.currentStep++;
    } else {
      this.deploy();
    }
  }

  deploy() {
    if (!this.data.name || !this.data.domain) {
      alert('⚠️ Please provide a Business Name and Domain.');
      this.currentStep = 1;
      return;
    }

    const tenantPayload = {
      tenantId: this.data.domain,
      domain: `${this.data.domain}.ecbee.net`,
      name: this.data.name,
      package: this.data.package,
      billingCycle: this.billingCycle,
      branding: this.data.branding,
      uiSettings: this.data.uiSettings,
      cdnBaseUrl: 'https://d18xkwaipu1whh.cloudfront.net/test_2.0',
      features: { login: true, cart: true, offers: true }
    };

    console.log('🚀 Deploying...', tenantPayload);
    this.adminService.upsertTenant(tenantPayload).subscribe({
      next: () => {
        alert('🎉 Congratulations! Your store is live.');
        // Redirecting to the home page of the new tenant link
        window.location.href = `http://${this.data.domain}.ecbee.net:4200/home`;
      },
      error: (err) => {
        console.error('🚀 Deployment error:', err);
        alert('Deployment failed: ' + (err.error?.message || err.message));
      }
    });
  }
}
