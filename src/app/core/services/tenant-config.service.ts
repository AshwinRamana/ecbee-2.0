import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TenantConfig } from '../models/tenant.model';
import { environment } from '../../../environments/environment';

/**
 * 🛰️ THE BRAIN OF MULTI-TENANCY
 * This service is responsible for identifying WHICH client is visiting
 * and fetching their specific configuration (theme, logo, features).
 */
@Injectable({
    providedIn: 'root'
})
export class TenantConfigService {
    // ReplaySubject(1) stores the configuration once fetched. 
    // This allows components that load later (like lazy-loaded checkout) 
    // to get the same config immediately.
    private configSubject = new ReplaySubject<TenantConfig>(1);

    // This is the variable that every component "listens" to.
    public config = this.configSubject.asObservable();

    constructor(private http: HttpClient) {
        // As soon as the app starts, we trigger the detection flow.
        this.loadConfig().subscribe(config => this.configSubject.next(config));
    }

    /**
     * 🔍 THE DETECTION ENGINE
     * Looks at the browser's URL (hostname) and asks the API for instructions.
     */
    private loadConfig(): Observable<TenantConfig> {
        const hostname = window.location.hostname;
        console.log(`[TenantConfig] Detecting Hostname: "${hostname}"`);

        // We send the hostname to our AWS Lambda API.
        // The API searches MongoDB for this specific domain.
        return this.http.get<TenantConfig>(`${environment.apiUrl}/config?hostname=${hostname}`).pipe(
            tap(config => console.log('[TenantConfig] ✅ API Success:', config)),
            catchError(err => {
                // 🚑 SAFETY NET
                // If the internet is down or API fails, we use a fallback 
                // so the user still sees A website instead of a blank screen.
                console.error('[TenantConfig] ❌ API Failed (Using Fallback). Reason:', err);
                return of(this.getFallbackConfig());
            })
        );
    }

    private getFallbackConfig(): TenantConfig {
        return {
            domain: 'fallback',
            tenantId: 'client1',
            theme: 'fashion',
            homeLayout: 'hero-grid',
            features: { login: true, cart: true, offers: false },
            cdnBaseUrl: 'https://d18xkwaipu1whh.cloudfront.net/test_2.0',
            name: 'Fallback Mode'
        };
    }
}
