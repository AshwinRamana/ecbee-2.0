import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, SearchParams } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
   selector: 'app-product-management',
   standalone: true,
   imports: [CommonModule, FormsModule],
   template: `
    <div class="product-mgmt-container">
      
      <!-- HEADER ACTIONS -->
      <div class="control-bar">
         <div class="search-wrap">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Search catalog..." [(ngModel)]="searchTerm" (input)="onSearch()">
         </div>
         <button class="btn-add" (click)="openModal()">+ Add New Product</button>
      </div>

      <!-- PRODUCT TABLE -->
      <div class="table-card">
         <table class="mgmt-table">
            <thead>
               <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Actions</th>
               </tr>
            </thead>
            <tbody>
               <tr *ngFor="let p of products">
                  <td class="product-cell">
                     <img [src]="p.images[0]" class="thumb">
                     <div class="product-info">
                        <strong>{{ p.name }}</strong>
                        <span>ID: {{ p._id.slice(-6) }}</span>
                     </div>
                  </td>
                  <td><span class="cat-pill">{{ p.category }}</span></td>
                  <td><strong>{{ p.price | currency }}</strong></td>
                  <td>{{ p.stock }}</td>
                  <td>⭐ {{ p.rating }}</td>
                  <td>
                     <div class="action-btns">
                        <button class="edit" (click)="editProduct(p)">✏️</button>
                        <button class="delete" (click)="deleteProduct(p._id)">🗑️</button>
                     </div>
                  </td>
               </tr>
            </tbody>
         </table>
      </div>

      <!-- PRODUCT MODAL (Add/Edit) -->
      <div class="modal-overlay" *ngIf="showModal">
         <div class="modal-content glass">
            <header class="modal-header">
               <h3>{{ editingId ? 'Edit Product' : 'Create New Product' }}</h3>
               <button class="close-modal" (click)="closeModal()">×</button>
            </header>
            
            <form (ngSubmit)="saveProduct()" #pForm="ngForm" class="product-form">
               <div class="form-grid">
                  <div class="form-group">
                     <label>Product Name</label>
                     <input type="text" [(ngModel)]="currentProduct.name" name="pname" required>
                  </div>
                  <div class="form-group">
                     <label>Category</label>
                     <input type="text" [(ngModel)]="currentProduct.category" name="pcat" required>
                  </div>
                  <div class="form-group">
                     <label>Price</label>
                     <input type="number" [(ngModel)]="currentProduct.price" name="pprice" required>
                  </div>
                  <div class="form-group">
                     <label>Stock Quantity</label>
                     <input type="number" [(ngModel)]="currentProduct.stock" name="pstock" required>
                  </div>
                  <div class="form-group full">
                     <label>Short Description</label>
                     <textarea [(ngModel)]="currentProduct.description" name="pdesc" rows="2"></textarea>
                  </div>
                  <div class="form-group full">
                     <label>Image URL</label>
                     <input type="text" [(ngModel)]="currentProduct.images[0]" name="pimg">
                  </div>
               </div>

               <div class="modal-footer">
                  <button type="button" class="btn-cancel" (click)="closeModal()">Cancel</button>
                  <button type="submit" class="btn-save" [disabled]="!pForm.valid">
                    {{ editingId ? 'Save Changes' : 'Create Product' }}
                  </button>
               </div>
            </form>
         </div>
      </div>

    </div>
  `,
   styles: [`
    .product-mgmt-container { display: flex; flex-direction: column; gap: 30px; }
    
    .control-bar { display: flex; justify-content: space-between; align-items: center; }
    .search-wrap { position: relative; background: #fff; border-radius: 12px; padding: 0 15px; border: 1px solid #e2e8f0; width: 400px; display: flex; align-items: center; }
    .search-icon { color: #94a3b8; margin-right: 10px; }
    .search-wrap input { border: none; padding: 12px 0; outline: none; width: 100%; font-size: 14px; }
    .btn-add { background: #1e293b; color: #fff; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; }

    .table-card { background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
    .mgmt-table { width: 100%; border-collapse: collapse; }
    .mgmt-table th { text-align: left; padding: 20px; background: #f8fafc; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; }
    .mgmt-table td { padding: 20px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
    
    .product-cell { display: flex; align-items: center; gap: 15px; }
    .thumb { width: 50px; height: 50px; border-radius: 8px; object-fit: cover; background: #f1f5f9; }
    .product-info { display: flex; flex-direction: column; }
    .product-info strong { font-size: 15px; color: #1e293b; }
    .product-info span { font-size: 11px; color: #94a3b8; }

    .cat-pill { background: #f1f5f9; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; color: #475569; }
    .action-btns { display: flex; gap: 10px; }
    .action-btns button { background: none; border: 1px solid #e2e8f0; border-radius: 8px; width: 32px; height: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
    .action-btns button.edit:hover { background: #f1f5f9; }
    .action-btns button.delete:hover { border-color: #ef4444; color: #ef4444; }

    /* MODAL */
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(5px); z-index: 1000; display: flex; align-items: center; justify-content: center; }
    .modal-content { width: 600px; background: #fff; border-radius: 24px; padding: 40px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .modal-header h3 { margin: 0; font-size: 22px; font-weight: 800; }
    .close-modal { background: none; border: none; font-size: 24px; color: #94a3b8; cursor: pointer; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .form-group.full { grid-column: 1 / -1; }
    .form-group label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 700; color: #475569; }
    .form-group input, .form-group textarea { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #e2e8f0; outline: none; transition: 0.3s; box-sizing: border-box; }
    .form-group input:focus, .form-group textarea:focus { border-color: #00d2d3; }

    .modal-footer { display: flex; justify-content: flex-end; gap: 15px; margin-top: 40px; }
    .btn-cancel { background: #f1f5f9; color: #475569; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; }
    .btn-save { background: #1e293b; color: #fff; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; }
  `]
})
export class ProductManagementComponent implements OnInit {
   products: any[] = [];
   searchTerm: string = '';
   showModal: boolean = false;
   editingId: string | null = null;

   currentProduct: any = this.resetProductData();

   constructor(private productService: ProductService, private authService: AuthService) { }

   ngOnInit(): void {
      this.loadProducts();
   }

   loadProducts() {
      const user = this.authService.getCurrentUserValue();
      this.productService.getProducts({ tenantId: user.tenantId, search: this.searchTerm }).subscribe(data => {
         this.products = data;
      });
   }

   onSearch() {
      this.loadProducts();
   }

   openModal() {
      this.editingId = null;
      this.currentProduct = this.resetProductData();
      this.showModal = true;
   }

   editProduct(p: any) {
      this.editingId = p._id;
      this.currentProduct = JSON.parse(JSON.stringify(p)); // Deep clone
      this.showModal = true;
   }

   closeModal() {
      this.showModal = false;
   }

   saveProduct() {
      // Ensure images is definitely an array if user didn't touch it
      if (!Array.isArray(this.currentProduct.images)) {
         this.currentProduct.images = [this.currentProduct.images || ''];
      }

      if (this.editingId) {
         this.productService.updateProduct(this.editingId, this.currentProduct).subscribe({
            next: () => {
               alert('Product updated successfully!');
               this.closeModal();
               this.loadProducts();
            },
            error: (err) => alert('Update failed: ' + err.message)
         });
      } else {
         this.productService.createProduct(this.currentProduct).subscribe({
            next: () => {
               alert('Product created successfully!');
               this.closeModal();
               this.loadProducts();
            },
            error: (err) => alert('Creation failed: ' + err.message)
         });
      }
   }

   deleteProduct(id: string) {
      if (confirm('Are you sure you want to delete this product?')) {
         this.productService.deleteProduct(id).subscribe(() => {
            this.loadProducts();
         });
      }
   }

   resetProductData() {
      return {
         name: '',
         category: '',
         price: 0,
         stock: 0,
         description: '',
         images: [''],
         rating: 5,
         tenantId: this.authService.getCurrentUserValue().tenantId
      };
   }
}
