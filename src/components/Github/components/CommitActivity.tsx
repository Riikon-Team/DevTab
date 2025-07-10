import React, { useMemo, useRef, useEffect } from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { blue, indigo } from '@mui/material/colors';

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CommitActivityProps {
  commitData: Record<string, number>;
  chartHeight?: number;
  fontSize?: number;
  compactMode?: boolean;
}

const CommitActivity: React.FC<CommitActivityProps> = ({
  commitData,
  chartHeight = 250,
  fontSize = 14,
  compactMode = false
}) => {
  const theme = useTheme();
  const chartRef = useRef<ChartJS<'bar'>>(null);
  
  // Xử lý dữ liệu cho biểu đồ
  const chartData = useMemo(() => {
    // Chuyển dữ liệu thành mảng và sắp xếp theo thứ tự ngày tăng dần
    const quarterData = Object.entries(commitData)
      .sort((a, b) => {
        // Định dạng dự kiến: YYYY-QN (ví dụ: 2023-Q1)
        const [yearA, quarterA] = a[0].split('-');
        const [yearB, quarterB] = b[0].split('-');
        
        return yearA === yearB
          ? quarterA.localeCompare(quarterB)
          : yearA.localeCompare(yearB);
      });
    
    // Lấy 8 quý gần nhất
    const recentQuarters = quarterData.slice(-8);
    
    return {
      quarters: recentQuarters.map(([quarter]) => quarter),
      commits: recentQuarters.map(([, count]) => count)
    };
  }, [commitData]);
  
  // Màu sắc biểu đồ
  const getChartColor = () => {
    return theme.palette.mode === 'dark' ? blue[300] : indigo[500];
  };
  
  // Chuẩn bị dữ liệu cho Chart.js
  const barChartData: ChartData<'bar'> = {
    labels: chartData.quarters,
    datasets: [
      {
        label: 'Commits',
        data: chartData.commits,
        backgroundColor: getChartColor(),
        borderColor: getChartColor(),
        borderWidth: 1,
        borderRadius: 4,
        maxBarThickness: 35,
        barPercentage: 0.7,
        hoverBackgroundColor: theme.palette.primary.main,
      }
    ]
  };
  
  // Cấu hình cho Chart.js
  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(0, 0, 0, 0.8)' 
          : 'rgba(255, 255, 255, 0.8)',
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        titleFont: {
          size: fontSize,
          weight: 'bold'
        },
        bodyFont: {
          size: fontSize,
        },
        padding: 10,
        borderColor: theme.palette.divider,
        borderWidth: 1,
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: fontSize - 1,
          },
          maxRotation: 0,
          minRotation: 0,
          padding: 8
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: fontSize - 1
          },
          padding: 8
        }
      }
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }
    },
  };
  
  // Cập nhật kích thước biểu đồ khi container thay đổi
  useEffect(() => {
    const resizeChart = () => {
      if (chartRef.current) {
        chartRef.current.resize();
      }
    };

    window.addEventListener('resize', resizeChart);
    
    return () => {
      window.removeEventListener('resize', resizeChart);
    };
  }, []);
  
  return (
    <Card sx={{ 
      background: theme.palette.mode === 'dark' 
        ? 'rgba(30, 30, 30, 0.7)' 
        : 'rgba(255, 255, 255, 0.7)',
      borderRadius: 2,
      height: '100%'
    }}>
      <CardContent sx={{ p: compactMode ? 1.5 : 2 }}>
        <Typography variant="h6" gutterBottom fontWeight="medium" sx={{ fontSize: fontSize + 2 }}>
          Commit Activity
        </Typography>
        
        <Box className="commit-chart-container" sx={{ 
          height: Math.max(chartHeight, 220),
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          mt: 1
        }}>
          {chartData.commits.length > 0 ? (
            <Bar 
              ref={chartRef}
              data={barChartData} 
              options={barChartOptions}
            />
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: fontSize - 2 }}>
              No commit activity data available
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CommitActivity;