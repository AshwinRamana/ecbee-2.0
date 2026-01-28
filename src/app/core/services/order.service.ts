import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = `${environment.apiUrl}/orders`;

    constructor(private http: HttpClient) { }

    createOrder(orderData: any): Observable<any> {
        return this.http.post(this.apiUrl, orderData);
    }

    getUserOrders(userId: string, tenantId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/user?userId=${userId}&tenantId=${tenantId}`);
    }
}
