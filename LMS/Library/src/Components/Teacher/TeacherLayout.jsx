import { Outlet, useLocation } from 'react-router-dom';
import { ColorModeContext, useMode, tokens } from './Theme';
import { ThemeProvider, CssBaseline, Box, IconButton } from '@mui/material';
import SideBar from './Global/SideBar';
import TopBar from './Global/TopBar';
import { useEffect, useState } from 'react';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

function TeacherLayout() {
  const [theme, colorMode] = useMode();
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const colors = tokens(theme.palette.mode);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const routesWithSearch = [
    '/TeacherDashboard',
    '/StudentsList',
  ];
  const showSearch = routesWithSearch.includes(location.pathname);

  useEffect(() => {
    if (location.pathname === '/TeacherDashboard') {
      setSearchQuery(''); 
    }
  }, [location.pathname]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
          display: 'flex', 
          height: '100vh', 
          overflow: 'hidden',
          backgroundColor: theme.palette.background.default
        }}>
          <SideBar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              height: '100vh',
              overflow: 'hidden',
              backgroundColor: theme.palette.background.default
            }}
          >
            <Box 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center"
              p={3}
              sx={{
                backgroundColor: theme.palette.background.default,
                height: '73px',
                borderBottom: `1px solid ${theme.palette.divider}`
              }}
            >
              
              <Box sx={{ 
                flex: 1,
                maxWidth: showSearch ? '400px' : '0px',
                transition: 'max-width 0.3s ease'
              }}>
                {showSearch && (
                  <TopBar onSearchChange={handleSearchChange} />
                )}
              </Box>
              
             
              <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === 'dark' ? (
                  <DarkModeOutlinedIcon />
                ) : (
                  <LightModeOutlinedIcon />
                )}
              </IconButton>
            </Box>
            
           
            <Box sx={{ 
              flex: 1, 
              overflowY: 'auto', 
              padding: 2,
              backgroundColor: theme.palette.background.default
            }}>
              <Outlet context={{ searchQuery, setSearchQuery }} />
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default TeacherLayout;