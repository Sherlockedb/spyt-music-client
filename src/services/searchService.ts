import apiClient from '../core/api/client';
import { SearchResults } from '../types/search';

export interface SearchParams {
  query: string;
  types?: ('track' | 'album' | 'artist' | 'playlist')[];
  limit?: number;
  offset?: number;
}

export const searchService = {
  /**
   * 搜索音乐内容
   */
  search: async ({ query, types = ['track', 'album', 'artist'], limit = 20, offset = 0 }: SearchParams): Promise<SearchResults> => {
    const typesString = types.join(',');
    const response = await apiClient.get('/search', {
      params: {
        q: query,
        type: typesString,
        limit,
        offset
      }
    });
    return response.data;
  },

  /**
   * 获取搜索建议
   */
  getSuggestions: async (query: string): Promise<string[]> => {
    const response = await apiClient.get('/search/suggestions', {
      params: { q: query }
    });
    return response.data.suggestions;
  }
};