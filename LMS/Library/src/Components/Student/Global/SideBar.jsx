import { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { tokens } from '../Theme.js';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import GroupIconOutlinedIcon from '@mui/icons-material/Group';
import LibraryBookOutlinedIsIcon from '@mui/icons-material/LibraryBooksOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const drawerWidth = 240;

function SideBar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); 
  const [isCollapsed, setIsCollapsed] = useState(isSmallScreen); 
  const [selected, setSelected] = useState("Dashboard");

  const handleLogout = () => {
    localStorage.removeItem('admin');  
    navigate("/StudentLogin"); 
  };

  const menuItems = [
    { text: "Dashboard", icon: <HomeOutlinedIcon />, path: "/StudentDashboard" },
    { text: "Profile", icon: <PeopleOutlinedIcon />, path: "/StudentProfile" },
    { text: "History", icon: <GroupIconOutlinedIcon />, path: "/StudentHistory" },
  ];

  useEffect(() => {
    setIsCollapsed(isSmallScreen);
  }, [isSmallScreen]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        open={!isCollapsed}
        sx={{
          width: isCollapsed ? 60 : drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isCollapsed ? 60 : drawerWidth,
            boxSizing: 'border-box',
            backgroundColor:
              theme.palette.mode === 'dark'
                ? colors.primary[500]
                : colors.grey[900],
            color:
              theme.palette.mode === 'dark'
                ? colors.grey[100]
                : colors.grey[900],
            transition: 'width 0.3s',
          },
        }}
      >
        <Box display="flex" alignItems="center" justifyContent={isCollapsed ? 'center' : 'space-between'} p={2}>
          {!isCollapsed && (
            <Typography variant="h3" sx={{ color: colors.grey[100], letterSpacing: "1px", textAlign: "center", width: "100%", display: "block" }}>
              STUDENT
            </Typography>
          )}
          <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
            <MenuOutlinedIcon sx={{ color: colors.grey[100] }} />
          </IconButton>
        </Box>

        <Divider />

        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              component={Link}
              to={item.path}
              selected={selected === item.text}
              onClick={() => setSelected(item.text)}
              sx={{
                letterSpacing: "2px",
                color: selected === item.text ? theme.palette.mode === 'dark' ? '#6870fa' : colors.blueAccent[500] : theme.palette.text.primary,
                backgroundColor: selected === item.text ? theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[700] : 'transparent',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? colors.primary[800] : colors.grey[600],
                },
              }}
            >
              <ListItemIcon sx={{ color: colors.grey[100], minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary={item.text} />}
            </ListItem>
          ))}

          <ListItem
            key="Logout"
            onClick={handleLogout}  
            selected={selected === "Logout"}
            sx={{
              cursor: "pointer",
              letterSpacing: "2px",
              color: selected === "Logout" ? theme.palette.mode === 'dark' ? '#f44336' : colors.redAccent?.[500] || "#f44336" : theme.palette.text.primary,
              backgroundColor: selected === "Logout" ? theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[700] : 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? colors.primary[800] : colors.grey[600],
              },
            }}
          >
            <ListItemIcon sx={{ color: colors.grey[100], minWidth: 40 }}>
              <LogoutOutlinedIcon />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Logout" />}
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}

export default SideBar;
