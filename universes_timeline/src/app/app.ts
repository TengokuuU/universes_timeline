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
  defaultBg = 'assets/misc/background_main.jpg';
  private currentLayer: 1 | 2 = 1;

  @ViewChild('timeline') timeline!: ElementRef;
  @ViewChild('timelineWrapper') timelineWrapper!: ElementRef;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Startujemy od Marvela jako domyślne
    this.switchUniverse('mcu_movies_data');
  }

  // Przełączanie uniwersum (wywoływane z burger menu)
  switchUniverse(universe: string) {
    this.dataService.getUniverseTimeline(universe).subscribe({
      next: (data: MCUItem[]) => {
        this.mcuItems = data;
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

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (this.timelineWrapper) {
      this.timelineWrapper.nativeElement.scrollLeft += event.deltaY * 0.8;
      event.preventDefault();
    }
  }

  toggleWatched(item: any, event: Event) {
    event.stopPropagation();
    item.watched = !item.watched;
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    const watchedIds = this.mcuItems
      .filter(item => item.watched)
      .map(item => item.id);
    localStorage.setItem('mcu_watched_list', JSON.stringify(watchedIds));
  }

  loadWatchedStatus() {
    const saved = localStorage.getItem('mcu_watched_list');
    if (saved) {
      const watchedIds: number[] = JSON.parse(saved);
      this.mcuItems.forEach(item => {
        if (watchedIds.includes(item.id)) {
          item.watched = true;
        }
      });
    }
  }

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