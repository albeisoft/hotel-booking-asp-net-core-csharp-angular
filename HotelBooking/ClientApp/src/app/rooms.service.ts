import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from './room';
import { Category } from './category';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  url = null;

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.url = baseUrl + 'api/';
  }

  getAll(): Observable<Room[]> {
    return this.http.get<Room[]>(this.url + 'Rooms')
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url + 'Categories')
  }

  getById(id: string): Observable<Room> {
    return this.http.get<Room>(this.url + 'Rooms/' + id);
  }

  create(room: Room): Observable<Room> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Room>(this.url + 'Rooms', room, httpOptions);
  }

  update(id: string, room: Room): Observable<Room> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };    
    return this.http.put<Room>(this.url + 'Rooms/' + id, room, httpOptions);
  }

  deleteById(id: string): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<number>(this.url + 'Rooms/' + id, httpOptions);
  }

  deleteRecords(selectedRecordsToDelete: Room[]): Observable<string> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<string>(this.url + 'Rooms/DeleteRecords/', selectedRecordsToDelete, httpOptions);
  }
}

