import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from '../Theme';

function Header({ title, subtitle }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{
          mb: "5px",
          "@media (max-width: 768px)": {
            variant: "h4", 
            fontSize: "1.5rem", 
          },
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="h5"
        color={colors.greenAccent[400]}
        sx={{
          "@media (max-width: 768px)": {
            fontSize: "1rem", 
          },
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
}

export default Header;
