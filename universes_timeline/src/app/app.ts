import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MCUItem } from './models/mcu-item.model';
import { DataService } from '../core/services/data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  mcuItems: MCUItem[] = [];
  isMenuOpen = false;
  currentTheme = 'theme-marvel';
  defaultBg = 'assets/misc/background_main.jpg';
  private currentLayer: 1 | 2 = 1;

  @ViewChild('timeline') timeline!: ElementRef;
  @ViewChild('timelineWrapper') timelineWrapper!: ElementRef;

  constructor(private dataService: DataService) {}



//bazowo marvel się wyświetla
  ngOnInit() {
    this.switchUniverse('mcu_movies_data');
  }

//zmienianie uniwersum z menu
  switchUniverse(universe: string) {
    this.dataService.getUniverseTimeline(universe).subscribe({
      next: (data: MCUItem[]) => {
        this.mcuItems = data;
        if (universe.includes('starwars')) {
          this.currentTheme = 'theme-starwars';
        } else if (universe.includes('fnaf')) {
          this.currentTheme = 'theme-fnaf';
        } else {
          this.currentTheme = 'theme-marvel';
        }

        this.loadWatchedStatus();
        this.isMenuOpen = false;
        
        if (this.timelineWrapper) {
          this.timelineWrapper.nativeElement.scrollLeft = 0;
        }
        console.log(`Uniwersum zmienione na: ${universe}`);
      },
      error: (err) => console.error('Błąd ładowania danych uniwersum:', err)
    });
  }
//otwieranie i zamykanie menu
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
//horyzontalne scrollowanie
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (this.timelineWrapper) {
      this.timelineWrapper.nativeElement.scrollLeft += event.deltaY * 0.8;
      event.preventDefault();
    }
  }
  toggleFullDetails(item: MCUItem) {
    const detailsElement = document.querySelector('.full-details') as HTMLElement;
    if (detailsElement) {
      const isVisible = detailsElement.style.display === 'block';
      if (isVisible) {
        detailsElement.style.display = 'none';
      } else {
        detailsElement.style.display = 'block';
        // Tutaj możesz dodać kod do wypełnienia szczegółów filmu/serialu, np.:
        // detailsElement.querySelector('.logo-film')!.setAttribute('src', item.poster_url);
        // detailsElement.querySelector('.director')!.textContent = `Reżyser: ${item.rezyser}`;
        // detailsElement.querySelector('.runtime')!.textContent = `Czas trwania: ${item.czas_trwania} min`;
        // detailsElement.querySelector('.rating')!.textContent = `Ocena: ${item.ocena}`;
      }
    }
  }

//zaznaczanie jako obejrzane/ograne
  toggleWatched(item: any, event: Event) {
    event.stopPropagation();
    item.watched = !item.watched;
    this.saveToLocalStorage();
  }
  toggleFave(item: any, event: Event)
  {
    event.stopPropagation();
    item.fave = !item.fave;
    this.saveToLocalStorage();
  }
//zapis do local storage
  saveToLocalStorage() {
    const faveIds = this.mcuItems
      .filter(item => item.fave)
      .map(item => item.id);
    localStorage.setItem('mcu_fave_list', JSON.stringify(faveIds));
    const watchedIds = this.mcuItems
      .filter(item => item.watched)
      .map(item => item.id);
    localStorage.setItem('mcu_watched_list', JSON.stringify(watchedIds));
  }
//załadowanie zapisu z local storage
  loadWatchedStatus() {
    const saved = localStorage.getItem('mcu_watched_list');
    const saved_fv = localStorage.getItem('mcu_fave_list');
    if (saved_fv) {
      const faveIds: number[] = JSON.parse(saved_fv);
      this.mcuItems.forEach(item => {
        if (faveIds.includes(item.id)) {
          item.fave = true;
        }
      });
    }
    if (saved) {
      const watchedIds: number[] = JSON.parse(saved);
      this.mcuItems.forEach(item => {
        if (watchedIds.includes(item.id)) {
          item.watched = true;
        }
      });
    }
  }
//zmiana tła na hover
  setHoverBg(item: any | null) {
    const track = this.timeline?.nativeElement;
    if (!track) return;

    const newBg = (item && item.scena_ikoniczna_url) ? item.scena_ikoniczna_url : this.defaultBg;
    const currentBg = this.currentLayer === 1 
      ? getComputedStyle(track).getPropertyValue('--bg-layer-1').trim()
      : getComputedStyle(track).getPropertyValue('--bg-layer-2').trim();

    if (currentBg.includes(newBg)) return;

    if (this.currentLayer === 1) {
      track.style.setProperty('--bg-layer-2', `url('${newBg}')`);
      track.classList.add('fade-to-layer-2');
      this.currentLayer = 2;
    } else {
      track.style.setProperty('--bg-layer-1', `url('${newBg}')`);
      track.classList.remove('fade-to-layer-2');
      this.currentLayer = 1;
    }
  }
}