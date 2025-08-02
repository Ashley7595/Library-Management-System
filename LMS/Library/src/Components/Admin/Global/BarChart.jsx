import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../Theme";
import { useMediaQuery } from "@mui/material";

const BarChart = ({ data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery('(min-width:900px)');

  const fallbackColors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#154789"
  ];

  const categoryColors = {};
  data.forEach((item, index) => {
    categoryColors[item.genre || item.category] = fallbackColors[index % fallbackColors.length];
  });

  const renderLabel = (label) => {
    if (isDesktop) {
      const words = label.split(' ');
      
      if (words.length > 1) {
        const midPoint = Math.ceil(words.length / 2);
        const line1 = words.slice(0, midPoint).join(' ');
        const line2 = words.slice(midPoint).join(' ');
        
        return (
          <>
            <tspan 
              x={0} 
              dy={0}
              style={{
                fontSize: "14px",
                fill: colors.grey[100]
              }}
            >
              {line1}
            </tspan>
            <tspan 
              x={0} 
              dy="1.2em"
              style={{
                fontSize: "14px",
                fill: colors.grey[100]
              }}
            >
              {line2}
            </tspan>
          </>
        );
      }
      

      return label;
    }
    return label;
  };


  const getLabelFontSize = () => {
    if (isMobile) return "10px";
    if (isTablet) return "12px";
    return "14px";
  };

  return (
    <div style={{
      height: "100%",
      width: "100%",
      borderRadius: "8px",
      padding: "12px",
      boxSizing: "border-box",
      overflow: "hidden",
    }}>
      <ResponsiveBar
        data={data.map((item) => ({
          category: item.genre || item.category,
          Books: item.count || item.Books
        }))}
        keys={["Books"]}
        indexBy="category"
        layout="vertical"
        margin={{
          top: 0,
          right: isMobile ? 30 : isTablet ? 50 : 60,
          bottom: isDesktop ? 150 : isMobile ? 100 : 120,
          left: isMobile ? 60 : isTablet ? 70 : 90
        }}
        padding={0.5}
        innerPadding={6}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={({ indexValue }) => categoryColors[indexValue] || "#ccc"}
        borderRadius={4}
        isInteractive={true}
        axisBottom={{
          tickSize: 0,
          tickPadding: isDesktop ? 35 : isMobile ? 20 : 25,
          tickRotation: isMobile ? -45 : isTablet ? -30 : 0,
          legend: "Book Categories",
          legendPosition: "middle",
          legendOffset: isDesktop ? 70 : isMobile ? 50 : 60,
          renderTick: (tick) => (
            <g transform={`translate(${tick.x},${tick.y + (isDesktop ? 25 : isMobile ? 10 : 12)})`}>
              <text
                textAnchor={isMobile || isTablet ? "end" : "middle"}
                dominantBaseline={isDesktop ? "hanging" : "central"}
                transform={isMobile || isTablet ? `rotate(${isMobile ? -45 : -30}, 0, 0)` : ""}
                style={{
                  fill: colors.grey[100],
                  fontWeight: 400,
                  fontSize: getLabelFontSize(),
                }}
              >
                {isDesktop ? renderLabel(tick.value) : tick.value}
              </text>
            </g>
          )
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: isMobile ? 15 : 25,
          tickRotation: 0,
          legend: "Number of Books",
          legendPosition: "middle",
          legendOffset: isMobile ? -50 : -60,
        }}
        theme={{
          tooltip: {
            container: {
              background: isDark ? colors.primary[900] : "#ffffff", 
              color: isDark ? colors.grey[100] : "#000000", 
              fontSize: '14px',
              borderRadius: '4px',
              boxShadow: '0 3px 9px rgba(0, 0, 0, 0.15)',
              padding: '12px',
              border: isDark ? 'none' : '1px solid #e0e0e0' 
            },
          },
          axis: {
            domain: {
              line: { 
                stroke: colors.grey[100],
                strokeWidth: 2
              }
            },
            legend: {
              text: { 
                fill: colors.grey[100], 
                fontSize: isMobile ? "12px" : isTablet ? "14px" : "16px",
                fontWeight: 600 
              }
            }
          },
          grid: {
            line: {
              stroke: colors.grey[800],
              strokeWidth: 0.5,
              strokeDasharray: "4 4"
            }
          }
        }}
        enableLabel={false}
        animate={true}
        motionConfig="gentle"
        role="application"
      />
    </div>
  );
};

export default BarChart;