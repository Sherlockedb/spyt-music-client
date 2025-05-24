import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  Popper,
  Grow,
  ClickAwayListener
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon, History as HistoryIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSearchHistory } from '../../features/search/hooks/useSearchHistory';

interface SearchBarProps {
  fullWidth?: boolean;
  onSearch?: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  showHistory?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  fullWidth = false, 
  onSearch,
  placeholder = '搜索歌曲、专辑、艺术家...',
  initialValue = '',
  showHistory = true
}) => {
  const [query, setQuery] = useState(initialValue);
  const [showHistoryList, setShowHistoryList] = useState(false);
  const navigate = useNavigate();
  const { searchHistory, addToHistory, clearHistory } = useSearchHistory();
  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  // 当初始值变化时更新query
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      // 默认行为：导航到搜索页面
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
    
    // 添加到搜索历史
    addToHistory(searchQuery);
    setShowHistoryList(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleHistoryItemClick = (item: string) => {
    setQuery(item);
    handleSearch(item);
  };

  return (
    <Box ref={anchorRef} sx={{ width: fullWidth ? '100%' : 'auto', position: 'relative' }}>
      <form onSubmit={handleSubmit}>
        <TextField
          inputRef={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => showHistory && setShowHistoryList(true)}
          placeholder={placeholder}
          fullWidth={fullWidth}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: query ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear search"
                  onClick={handleClear}
                  edge="end"
                  size="small"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
            sx: { borderRadius: 8 }
          }}
        />
      </form>

      {/* 搜索历史下拉框 */}
      <Popper
        open={showHistoryList && showHistory && searchHistory.length > 0}
        anchorEl={anchorRef.current}
        transition
        placement="bottom-start"
        style={{ width: anchorRef.current?.clientWidth, zIndex: 1300 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={200}>
            <Paper elevation={3}>
              <ClickAwayListener onClickAway={() => setShowHistoryList(false)}>
                <div>
                  <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <HistoryIcon fontSize="small" sx={{ mr: 0.5 }} />
                      搜索历史
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="primary" 
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        clearHistory();
                        setShowHistoryList(false);
                      }}
                    >
                      清除
                    </Typography>
                  </Box>
                  <List sx={{ pt: 0, maxHeight: 300, overflow: 'auto' }}>
                    {searchHistory.map((item, index) => (
                      <ListItem key={`${item}-${index}`} disablePadding>
                        <ListItemButton onClick={() => handleHistoryItemClick(item)} dense>
                          <ListItemText 
                            primary={item} 
                            primaryTypographyProps={{ 
                              noWrap: true,
                              sx: { maxWidth: '100%' }
                            }} 
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </div>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
};

export default SearchBar;