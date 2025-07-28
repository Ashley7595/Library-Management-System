import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../Theme";



const BarChart = ({ data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";

  const fallbackColors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#154789"
  ];

  const categoryColors = {};
  data.forEach((item, index) => {
    categoryColors[item.genre || item.category] = fallbackColors[index % fallbackColors.length];
  });

  return (
    <div
      style={{
        height: "100%",  
        width: "100%",  
        borderRadius: "8px",
        padding: "12px",
        boxSizing: "border-box",  
      }}
    >
      <ResponsiveBar
        data={data.map((item) => ({
          category: item.genre || item.category,
          Books: item.count || item.Books
        }))}
        keys={["Books"]}
        indexBy="category"
        layout="vertical"
        margin={{
          top: 50, 
          right: 50,  
          bottom: 50,
          left: 60
        }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={({ indexValue }) => categoryColors[indexValue] || "#ccc"}
        borderRadius={4}
        isInteractive={true}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Book Categories",
          legendPosition: "middle",
          legendOffset: 32,
          tickText: { fontSize: '10px' }, 
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Number of Books",
          legendPosition: "middle",
          legendOffset: -40,
          tickText: { fontSize: '10px' }, 
        }}
        theme={{
          axis: {
            domain: {
              line: { stroke: colors.grey[100] }
            },
            legend: {
              text: { fill: colors.grey[100], fontSize: '12px' }
            },
            ticks: {
              line: {
                stroke: colors.grey[100],
                strokeWidth: 1
              },
              text: { fill: colors.grey[100], fontSize: '12px' }
            }
          },
          legends: {
            text: { fill: colors.grey[100], fontSize: '12px' }
          },
          tooltip: {
            container: {
              background: isDark ? colors.primary[600] : "#fff",
              color: isDark ? colors.grey[100] : "#000",
              fontSize: 12,
              borderRadius: "4px",
              padding: "6px 8px"
            }
          }
        }}
        enableLabel={false}
        animate={true}
        legends={[]}
        responsive={true} 
        barWidth={20}
        onClick={(node) => console.log(node)}
        motionConfig="gentle" 
      />
    </div>
  );
};

export default BarChart;
