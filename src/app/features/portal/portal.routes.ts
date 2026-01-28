import { Routes } from '@angular/router';
import { PortalLayoutComponent } from './portal-layout.component';
import { OnboardingWizardComponent } from './onboarding-wizard.component';

export const PORTAL_ROUTES: Routes = [
    {
        path: '',
        component: PortalLayoutComponent,
        children: [
            { path: '', redirectTo: 'wizard', pathMatch: 'full' },
            {
                path: 'wizard',
                component: OnboardingWizardComponent
            }
        ]
    }
];
