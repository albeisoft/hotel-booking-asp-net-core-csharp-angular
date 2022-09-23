import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from './client';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  url = null;

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.url = baseUrl + 'api/';
  }

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(this.url + 'Clients')
  }

  getById(id: string): Observable<Client> {
    return this.http.get<Client>(this.url + 'Clients/' + id);
  }

  create(client: Client): Observable<Client> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Client>(this.url + 'Clients', client, httpOptions);
  }

  update(id: string, client: Client): Observable<Client> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<Client>(this.url + 'Clients/' + id, client, httpOptions);
  }

  deleteById(id: string): Observable<number> { 
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<number>(this.url + 'Clients/' + id, httpOptions);
  }  
  
  deleteRecords(selectedRecordsToDelete: Client[]): Observable<string> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };    
    return this.http.post<string>(this.url + 'Clients/DeleteRecords/', selectedRecordsToDelete, httpOptions);
  }
}
