import { inject } from '@angular/core';
import { CanMatchFn, Route, UrlSegment } from '@angular/router';
import { TenantConfigService } from '../services/tenant-config.service';
import { map } from 'rxjs/operators';
import { TenantConfig } from '../models/tenant.model';

export const featureGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
    const configService = inject(TenantConfigService);
    const featureName = route.data?.['feature'] as keyof TenantConfig['features'];

    if (!featureName) return true;

    return configService.config.pipe(
        map(config => {
            const isEnabled = config.features[featureName];
            if (!isEnabled) {
                console.warn(`Feature ${featureName} is disabled for this tenant.`);
            }
            return isEnabled;
        })
    );
};
