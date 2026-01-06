export interface MCUItem {
  id: number;
  tytul: string;
  typ: 'Film' | 'Serial' | 'Short';
  saga: 'Infinity' | 'Multiverse';
  chronologia_index: number;
  data_premiery: string;
  opis_krotki: string;
  poster_url: string;
  link_disney_plus: string;
  scena_ikoniczna_url: string;
  watched?: boolean;
}