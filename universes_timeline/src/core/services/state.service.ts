import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StateService {
  // Przechowujemy ID obejrzanych filmów w tablicy
  private watchedMovies = new BehaviorSubject<number[]>(this.loadFromStorage());
  watchedMovies$ = this.watchedMovies.asObservable();

  // Funkcja do przełączania statusu (kliknięcie w plakat)
  toggleWatched(id: number) {
    const current = this.watchedMovies.value;
    const updated = current.includes(id) 
      ? current.filter(mId => mId !== id) 
      : [...current, id];
    
    this.watchedMovies.next(updated);
    localStorage.setItem('watched_mcu', JSON.stringify(updated)); // Zapis w przeglądarce
  }

  private loadFromStorage(): number[] {
    const data = localStorage.getItem('watched_mcu');
    return data ? JSON.parse(data) : [];
  }
}