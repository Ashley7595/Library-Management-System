import { useState } from 'react';
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
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { tokens } from '../Theme.js';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LibraryBookOutlinedIsIcon from '@mui/icons-material/LibraryBooksOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

const drawerWidth = 240;

function SideBar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation(); 
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard"); 
  const currentPath = location.pathname;

  const menuItems = [
    { text: "Dashboard", icon: <HomeOutlinedIcon />, path: "/TeacherDashboard" },
    { text: "Profile", icon: <PersonOutlinedIcon />, path: "/TeacherProfile" },
    { text: "History", icon: <LibraryBookOutlinedIsIcon />, path: "/TeacherHistory" },
    { text: "Add Student", icon: <PersonAddAltOutlinedIcon />, path: "/AddStudent" },
    { text: "Students List", icon: <ListAltOutlinedIcon />, path: "/StudentsList" },
  ];


  const handleLogout = () => {
    localStorage.removeItem("teacher");
    localStorage.removeItem("teacherId");
    navigate("/TeacherLogin");
  };

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
        {/* Sidebar Header */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent={isCollapsed ? 'center' : 'space-between'}
          p={2}
        >
          {!isCollapsed && (
            <Typography
              variant="h3"
              sx={{
                color: colors.grey[100],
                letterSpacing: "1px",
                textAlign: "center",
                width: "100%",
                display: "block"
              }}
            >
              TEACHER
            </Typography>
          )}
          <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
            <MenuOutlinedIcon sx={{ color: colors.grey[100] }} />
          </IconButton>
        </Box>

        <Divider />

        {/* Sidebar Menu */}
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              component={Link}
              to={item.path}
              selected={currentPath === item.path}  
              onClick={() => setSelected(item.text)}
              sx={{
                letterSpacing: "2px",
                color:
                  currentPath === item.path
                    ? theme.palette.mode === 'dark'
                      ? '#6870fa'
                      : colors.blueAccent[500]
                    : theme.palette.text.primary,
                backgroundColor:
                  currentPath === item.path
                    ? theme.palette.mode === 'dark'
                      ? colors.primary[600]
                      : colors.grey[700]
                    : 'transparent',
                '&:hover': {
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? colors.primary[800]
                      : colors.grey[600],
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
            sx={{
              cursor: "pointer",
              letterSpacing: "2px",
              color:
                currentPath === "/TeacherLogin"
                  ? theme.palette.mode === 'dark'
                    ? '#f44336'
                    : colors.redAccent?.[500] || "#f44336"
                  : theme.palette.text.primary,
              backgroundColor:
                currentPath === "/TeacherLogin"
                  ? theme.palette.mode === 'dark'
                    ? colors.primary[600]
                    : colors.grey[700]
                  : 'transparent',
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? colors.primary[800]
                    : colors.grey[600],
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
