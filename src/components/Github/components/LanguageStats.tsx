import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { Box, Card, CardContent, Typography, useTheme, Tab, Tabs } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { deepPurple, blue, amber, green, pink, orange, cyan } from '@mui/material/colors';

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface LanguageStatsProps {
  langData: {
    repoCount: Record<string, number>;
    starCount: Record<string, number>;
    commitCount: Record<string, number>;
  };
  excludedLanguages: string[];
  chartHeight?: number;
  fontSize?: number;
  compactMode?: boolean;
}

const LanguageStats: React.FC<LanguageStatsProps> = ({ 
  langData, 
  excludedLanguages,
  chartHeight = 250,
  fontSize = 14,
  compactMode = false
}) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const chartRef = useRef<ChartJS<'doughnut'>>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  // Xử lý dữ liệu cho biểu đồ
  const processChartData = useCallback((data: Record<string, number>) => {
    const filteredData = Object.entries(data)
      .filter(([lang]) => !excludedLanguages.includes(lang));
    
    filteredData.sort((a, b) => b[1] - a[1]);
    
    // Giới hạn số lượng ngôn ngữ hiển thị để tránh nhãn chồng lên nhau
    const maxLanguages = compactMode ? 5 : 7;
    const topLanguages = filteredData.slice(0, maxLanguages);
    
    return {
      labels: topLanguages.map(([lang]) => lang),
      values: topLanguages.map(([, count]) => count),
    };
  }, [excludedLanguages, compactMode]);
  
  // Chọn màu sắc biểu đồ theo theme
  const getChartColors = () => {
    if (theme.palette.mode === 'dark') {
      return [
        deepPurple[300], blue[300], amber[300], green[300], 
        pink[300], orange[300], cyan[300]
      ];
    }
    return [
      deepPurple[500], blue[500], amber[500], green[500], 
      pink[500], orange[500], cyan[500]
    ];
  };
  
  // Tính toán dữ liệu cho các tab
  const repoData = useMemo(() => processChartData(langData.repoCount), 
    [processChartData, langData.repoCount]);
    
  const starData = useMemo(() => processChartData(langData.starCount), 
    [processChartData, langData.starCount]);
    
  const commitData = useMemo(() => processChartData(langData.commitCount), 
    [processChartData, langData.commitCount]);
  
  const activeData = [repoData, starData, commitData][tabValue];
  
  // Chuẩn bị dữ liệu cho Chart.js
  const chartData: ChartData<'doughnut'> = {
    labels: activeData.labels,
    datasets: [
      {
        data: activeData.values,
        backgroundColor: getChartColors(),
        borderColor: theme.palette.mode === 'dark' 
          ? 'rgba(0, 0, 0, 0.3)' 
          : 'rgba(255, 255, 255, 0.7)',
        borderWidth: 1,
        hoverOffset: 4
      }
    ]
  };
  
  // Cấu hình cho Chart.js
  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          padding: 10,
          font: {
            size: fontSize,
            weight: 500,
          },
          color: theme.palette.text.primary,
        },
        display: true,
        align: 'center',
      },
      tooltip: {
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(0, 0, 0, 0.8)' 
          : 'rgba(255, 255, 255, 0.8)',
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 10,
        boxWidth: 10,
        boxHeight: 10,
        boxPadding: 3,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw as number;
            const dataset = context.dataset;
            const total = dataset.data.reduce((acc: number, data: number) => acc + data, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
    layout: {
      padding: {
        top: 10,
        bottom: 20
      }
    }
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
      height: '100%',
    }}>
      <CardContent sx={{ 
        p: compactMode ? 1.5 : 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        <Typography variant="h6" gutterBottom fontWeight="medium" sx={{ fontSize: fontSize + 2 }}>
          Language Statistics
        </Typography>
        
        <Tabs 
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          aria-label="language statistics tabs"
          variant="fullWidth"
          sx={{ 
            mb: compactMode ? 1 : 2,
            minHeight: compactMode ? 32 : 48,
            '& .MuiTab-root': {
              minHeight: compactMode ? 32 : 48,
              fontSize: fontSize - 2,
              py: 0.5
            }
          }}
        >
          <Tab label="Repos" />
          <Tab label="Stars" />
          <Tab label="Commits" />
        </Tabs>
        
        <Box 
          ref={chartContainerRef}
          className="language-chart-container" 
          sx={{ 
            height: Math.max(chartHeight, 260),
            width: '100%',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            flexGrow: 1,
            position: 'relative'
          }}
        >
          {activeData.values.length > 0 ? (
            <Doughnut 
              ref={chartRef}
              data={chartData} 
              options={chartOptions}
            />
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: fontSize - 2 }}>
              No language data available after applying filters
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default LanguageStats;