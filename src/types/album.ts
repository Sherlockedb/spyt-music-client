import { Artist } from './artist';

export interface Album {
  id: string;
  name: string;
  artists: Artist[];
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  release_date?: string;
  total_tracks?: number;
  album_type?: 'album' | 'single' | 'compilation';
  external_urls: {
    spotify?: string;
  };
}