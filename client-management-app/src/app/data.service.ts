import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = "http://localhost:3000";

  constructor(private http: HttpClient) { }

  // Clients related methods
  addClient(client: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clients`, client);
  }

  getClients(): Observable<any> {
    return this.http.get(`${this.apiUrl}/clients`);
  }

  updateClient(client: any, clientID: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/clients/${clientID}?_dependent=meetings`, client);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clients/${id}`);
  }

  // Meetings related methods
  getMeetings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/meetings?_embed=client`);
  }

  addMeeting(meeting: any): Observable<any> {
    console.log(meeting);
    return this.http.post(`${this.apiUrl}/meetings`, meeting);
  }

  updateMeeting(meeting: any, meetingID: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/meetings/${meetingID}`, meeting);
  }

  deleteMeeting(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/meetings/${id}`);
  }
}
