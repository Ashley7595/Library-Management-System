import { useEffect, useState , useLayoutEffect} from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ColorModeContext, useMode } from './Theme';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import SideBar from './Global/SideBar';
import TopBar from './Global/TopBar';

function TeacherLayout() {
  const [theme, colorMode] = useMode();
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const routesWithSearch = [
    '/TeacherDashboard',
    '/StudentsList',
  ];

  const showTopBar = routesWithSearch.includes(location.pathname);

useLayoutEffect(() => {
  setSearchQuery('');
}, [location.pathname]);

{searchQuery === "" && <Outlet />}


  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
          <SideBar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              height: '100vh',
              overflow: 'hidden',
            }}
          >
            {showTopBar && (
              <TopBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
            )}
            <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
              <Outlet context={{ searchQuery, setSearchQuery }} />
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default TeacherLayout;
