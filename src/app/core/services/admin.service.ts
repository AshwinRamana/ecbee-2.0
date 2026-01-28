import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = `${environment.apiUrl}/admin`;

    constructor(private http: HttpClient) { }

    // --- STATS ---
    getStats(tenantId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/stats?tenantId=${tenantId}`);
    }

    // --- TENANTS ---
    getTenants(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/tenants`);
    }

    createTenant(tenantData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/tenants`, tenantData);
    }

    updateTenant(tid: string, tenantData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/tenants/${tid}`, tenantData);
    }

    upsertTenant(tenantData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/tenants/upsert`, tenantData);
    }

    // --- ORDERS ---
    getOrders(tenantId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/orders?tenantId=${tenantId}`);
    }
}
