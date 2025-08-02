import { Box, IconButton, InputBase } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";

function TopBar({ onSearchChange }) {
  const theme = useTheme();
  const [searchText, setSearchText] = useState('');

  const getBackgroundColor = () => {
    return theme.palette.mode === 'dark' 
      ? theme.palette.grey[700] 
      : theme.palette.grey[300];
  };

  const handleSearch = () => {
    onSearchChange(searchText.trim());
    setSearchText('');
  };

  return (
    <Box
      display="flex"
      backgroundColor={getBackgroundColor()}
      borderRadius="3px"
      sx={{ 
        width: '100%',
        maxWidth: '400px',
        boxShadow: 'none' 
      }}
    >
      <InputBase
        sx={{ 
          ml: 2, 
          flex: 1, 
          color: theme.palette.text.primary,
          '& .MuiInputBase-input': {
            padding: '8px'
          },
          '&:before, &:after': {
            display: 'none' 
          }
        }}
        placeholder="Search"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      <IconButton 
        type="button" 
        sx={{ p: 1 }} 
        onClick={handleSearch}
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
    </Box>
  );
}

export default TopBar;