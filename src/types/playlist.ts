import { User } from './user';
import { Track } from './track';

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  owner?: User;
  public?: boolean;
  collaborative?: boolean;
  images?: Array<{
    url: string;
    height?: number;
    width?: number;
  }>;
  tracks?: {
    total: number;
    items?: Array<{
      track: Track;
      added_at?: string;
    }>;
  };
  external_urls: {
    spotify?: string;
  };
}