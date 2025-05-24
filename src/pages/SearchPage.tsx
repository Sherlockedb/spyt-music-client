import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Skeleton,
  Divider,
  Alert,
  Button
} from '@mui/material';
import SearchBar from '../components/search/SearchBar';
import TrackList from '../components/tracks/TrackList';
import AlbumGrid from '../components/albums/AlbumGrid';
import ArtistGrid from '../components/artists/ArtistGrid';
import { searchService } from '../services/searchService';
import { SearchResults } from '../types/search';
import { useSearchHistory } from '../features/search/hooks/useSearchHistory';
import { useTranslation } from 'react-i18next'; // 添加国际化钩子

const SearchPage: React.FC = () => {
  const { t } = useTranslation(); // 获取翻译函数
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState(0);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToHistory } = useSearchHistory();

  // 定义搜索类型
  const tabTypes = ['all', 'tracks', 'albums', 'artists'];

  // 搜索函数
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchResults = await searchService.search({
        query: searchQuery,
        types: ['track', 'album', 'artist'],
        limit: 20
      });
      setResults(searchResults);
      addToHistory(searchQuery);
    } catch (err) {
      console.error('Search error:', err);
      setError(t('search.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  // 当查询参数变化时执行搜索
  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setResults(null);
    }
  }, [query]);

  // 处理搜索提交
  const handleSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery });
  };

  // 处理标签切换
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // 渲染搜索结果骨架屏
  const renderSkeletons = () => (
    <Box sx={{ mt: 4 }}>
      {[...Array(5)].map((_, i) => (
        <Box key={i} sx={{ display: 'flex', mb: 2 }}>
          <Skeleton variant="rectangular" width={60} height={60} sx={{ borderRadius: 1 }} />
          <Box sx={{ ml: 2, width: '100%' }}>
            <Skeleton width="70%" height={24} />
            <Skeleton width="40%" height={20} />
          </Box>
        </Box>
      ))}
    </Box>
  );

  // 渲染搜索结果
  const renderResults = () => {
    if (!results) return null;

    // 全部结果标签
    if (activeTab === 0) {
      return (
        <Box>
          {/* 曲目部分 */}
          {results.tracks && results.tracks.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{t('search.tracks')}</Typography>
                {results.tracks.length > 5 && (
                  <Button 
                    onClick={() => setActiveTab(1)} 
                    color="primary"
                  >
                    {t('search.viewAll')}
                  </Button>
                )}
              </Box>
              <TrackList tracks={results.tracks.slice(0, 5)} />
            </Box>
          )}

          {/* 专辑部分 */}
          {results.albums && results.albums.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{t('search.albums')}</Typography>
                {results.albums.length > 6 && (
                  <Button 
                    onClick={() => setActiveTab(2)} 
                    color="primary"
                  >
                    {t('search.viewAll')}
                  </Button>
                )}
              </Box>
              <AlbumGrid albums={results.albums.slice(0, 6)} />
            </Box>
          )}

          {/* 艺术家部分 */}
          {results.artists && results.artists.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{t('search.artists')}</Typography>
                {results.artists.length > 6 && (
                  <Button 
                    onClick={() => setActiveTab(3)} 
                    color="primary"
                  >
                    {t('search.viewAll')}
                  </Button>
                )}
              </Box>
              <ArtistGrid artists={results.artists.slice(0, 6)} />
            </Box>
          )}

          {/* 所有类别都没有结果 */}
          {(!results.tracks?.length && !results.albums.length && !results.artists.length) && (
            <Box sx={{ mt: 4 }}>
              <Alert severity="info">{t('search.noResultsForQuery', { query })}</Alert>
            </Box>
          )}
        </Box>
      );
    }
    
    // 曲目标签
    if (activeTab === 1) {
      return results.tracks && results.tracks.length > 0 ? (
        <Box sx={{ mt: 4 }}>
          <TrackList tracks={results.tracks} />
        </Box>
      ) : (
        <Box sx={{ mt: 4 }}>
          <Alert severity="info">{t('search.noTracksFound', { query })}</Alert>
        </Box>
      );
    }
    
    // 专辑标签
    if (activeTab === 2) {
      return results.albums && results.albums.length > 0 ? (
        <Box sx={{ mt: 4 }}>
          <AlbumGrid albums={results.albums} />
        </Box>
      ) : (
        <Box sx={{ mt: 4 }}>
          <Alert severity="info">{t('search.noAlbumsFound', { query })}</Alert>
        </Box>
      );
    }
    
    // 艺术家标签
    if (activeTab === 3) {
      return results.artists && results.artists.length > 0 ? (
        <Box sx={{ mt: 4 }}>
          <ArtistGrid artists={results.artists} />
        </Box>
      ) : (
        <Box sx={{ mt: 4 }}>
          <Alert severity="info">{t('search.noArtistsFound', { query })}</Alert>
        </Box>
      );
    }
    
    return null;
  };

  // 计算各类别的结果数量
  const getResultCounts = () => {
    if (!results) return [0, 0, 0, 0];
    
    const trackCount = results.tracks?.length || 0;
    const albumCount = results.albums?.length || 0;
    const artistCount = results.artists?.length || 0;
    const totalCount = trackCount + albumCount + artistCount;
    
    return [totalCount, trackCount, albumCount, artistCount];
  };

  const resultCounts = getResultCounts();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <SearchBar 
          fullWidth
          onSearch={handleSearch}
          initialValue={query}
          placeholder={t('search.placeholder')}
        />
      </Box>
      
      {query ? (
        <>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h1">
              "{query}" {t('search.resultsFor')}
            </Typography>
          </Box>
          
          <Tabs 
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ mb: 3 }}
          >
            <Tab label={`${t('search.all')} (${resultCounts[0]})`} />
            <Tab label={`${t('search.tracks')} (${resultCounts[1]})`} />
            <Tab label={`${t('search.albums')} (${resultCounts[2]})`} />
            <Tab label={`${t('search.artists')} (${resultCounts[3]})`} />
          </Tabs>
          
          <Divider sx={{ mb: 3 }} />
          
          {loading ? renderSkeletons() : (
            error ? <Alert severity="error">{error}</Alert> : renderResults()
          )}
        </>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            {t('search.searchYourMusic')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            {t('search.enterKeywords')}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default SearchPage;