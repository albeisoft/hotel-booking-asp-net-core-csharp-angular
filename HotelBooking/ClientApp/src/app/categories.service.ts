import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  // url ='https://localhost:5001/api/'
  url = null;

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.url = baseUrl + 'api/';
  }
  /*
  getCategories() {
    return this.http.get(this.url + 'Categories');
  }
  */
  getAllCategories(): Observable<Category[]> {    
    return this.http.get<Category[]>(this.url + 'Categories')
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(this.url + 'Categories/' + id);
  }

  createCategory(category: Category): Observable<Category> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Category>(this.url + 'Categories', category, httpOptions);
  }

  updateCategory(id: string, category: Category): Observable<Category> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<Category>(this.url + 'Categories/' + id, category, httpOptions);
  }

  deleteCategoryById(id: string): Observable<number> { 
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<number>(this.url + 'Categories/' + id, httpOptions);
  }  
  
  deleteRecords(selectedRecordsToDelete: Category[]): Observable<string> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };    
    return this.http.post<string>(this.url + 'Categories/DeleteRecords/', selectedRecordsToDelete, httpOptions);
  }
}
