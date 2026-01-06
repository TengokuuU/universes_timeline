import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MCUItem } from '../../app/models/mcu-item.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}

  // Pobiera domyślny timeline (Marvel)
  getTimeline(): Observable<MCUItem[]> {
    return this.http.get<MCUItem[]>('assets/data/mcu-data.json');
  }

  // Pobiera dowolne uniwersum na żądanie
  getUniverseTimeline(universe: string): Observable<MCUItem[]> {
    return this.http.get<MCUItem[]>(`assets/data/${universe}.json`);
  }
}