import { Artist } from './artist';
import { Album } from './album';

export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album?: Album;
  duration_ms: number;
  // preview_url?: string;
  // external_urls: {
  //   spotify?: string;
  // };
  // uri?: string;
  // explicit: boolean;
  popularity?: number;
}