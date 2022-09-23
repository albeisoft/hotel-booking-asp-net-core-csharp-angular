import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Reservation } from './reservation'
import { Room } from './room';
import { Client } from './client';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  url = null;

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.url = baseUrl + 'api/';
  }

  getAll(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.url + 'Reservations')
  }

  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.url + 'Rooms')
  }

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.url + 'Clients')
  }

  getById(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(this.url + 'Reservations/' + id);
  }

  create(room: Reservation): Observable<Reservation> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Reservation>(this.url + 'Reservations', room, httpOptions);
  }

  update(id: string, room: Reservation): Observable<Reservation> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<Reservation>(this.url + 'Reservations/' + id, room, httpOptions);
  }

  deleteById(id: string): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<number>(this.url + 'Reservations/' + id, httpOptions);
  }

  deleteRecords(selectedRecordsToDelete: Reservation[]): Observable<string> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<string>(this.url + 'Reservations/DeleteRecords/', selectedRecordsToDelete, httpOptions);
  }
}
