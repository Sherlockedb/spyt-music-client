import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container maxWidth={false} sx={{ flex: 1, py: 4 }}>
        <Outlet /> {/* 路由内容将渲染在这里 */}
      </Container>
    </Box>
  );
}

export default App;