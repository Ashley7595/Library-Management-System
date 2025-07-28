import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../Theme";

const StatBox = ({ title, subtitle, icon }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      width="100%"
      p={{ xs: "12px", sm: "20px" }}
      borderRadius="10px"
      boxShadow={`0 4px 20px ${theme.palette.mode === 'dark' ? '#00000044' : '#cccccc'}`}
      bgcolor={theme.palette.mode === "dark" ? colors.primary[600] : "#ffffff"}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      sx={{
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: `0 6px 25px ${theme.palette.mode === 'dark' ? '#00000066' : '#aaa'}`
        },
        "@media (max-width: 768px)": {
          p: "12px", 
        },
        
        typography: {
          h4: {
            fontSize: { xs: "1.25rem", sm: "2rem", md: "2.25rem" }, 
          },
          h6: {
            fontSize: { xs: "0.875rem", sm: "1.25rem", md: "1.5rem" }, 
          },
        },
      }}
    >
      <Box display="flex" alignItems="center" gap={{ xs: "8px", sm: "12px" }} mb={{ xs: 1, sm: 2 }}>
        {icon}
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: colors.grey[100] }}
        >
          {title}
        </Typography>
      </Box>

      <Typography
        variant="h6"
        fontWeight="medium"
        sx={{ color: colors.greenAccent[500] }}
        letterSpacing="1px"
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default StatBox;
