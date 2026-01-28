import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SearchParams {
    tenantId: string;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    sort?: 'priceAsc' | 'priceDesc' | 'ratingDesc' | 'newest';
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient) { }

    getProducts(params: SearchParams): Observable<any[]> {
        let httpParams = new HttpParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                httpParams = httpParams.append(key, value.toString());
            }
        });

        return this.http.get<any[]>(this.apiUrl, { params: httpParams });
    }

    getProductById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createProduct(product: any): Observable<any> {
        return this.http.post(this.apiUrl, product);
    }

    updateProduct(id: string, product: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, product);
    }

    deleteProduct(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
