import React from 'react';
import { Box, Card, CardContent, Typography, Divider, useTheme, Table, TableBody, TableRow, TableCell } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ForkLeftIcon from '@mui/icons-material/ForkLeft';
import CommitIcon from '@mui/icons-material/Commit';
import GitHubIcon from '@mui/icons-material/GitHub';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { amber, blue, green, purple } from '@mui/material/colors';
import { type GitHubUser } from '../../../constants/Githubv2';

interface GitHubStatsProps {
  user: GitHubUser;
  repoStarCount: Record<string, number>;
  repoCommitCount: Record<string, number>;
  fontSize?: number;
  compactMode?: boolean;
}

const GitHubStats: React.FC<GitHubStatsProps> = ({ 
  user, 
  repoStarCount, 
  repoCommitCount,
  fontSize = 14,
  compactMode = false
}) => {
  const theme = useTheme();
  
  // Tính tổng số stats
  const totalStars = Object.values(repoStarCount).reduce((sum, count) => sum + count, 0);
  const totalCommits = Object.keys(repoCommitCount).length;
  
  // Tìm repo có nhiều star nhất
  const mostStarredRepo = Object.entries(repoStarCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 1)[0];

  // Tìm repo có nhiều commit nhất
  const mostCommittedRepo = Object.entries(repoCommitCount)
    .sort((a, b) => parseInt(String(b[1])) - parseInt(String(a[1])))
    .slice(0, 1)[0];
    
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
          GitHub Statistics
        </Typography>
        
        <Table size="small" sx={{ 
          '.MuiTableCell-root': {
            borderBottom: 'none',
            py: 0.75,
            px: 1
          }
        }}>
          <TableBody>
            {/* Tổng Stars */}
            <TableRow hover sx={{ 
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.06)',
              }
            }}>
              <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StarIcon sx={{ color: amber[500], fontSize: fontSize + 4 }} />
                <Typography sx={{ fontSize: fontSize }}>Total Stars</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight="bold" sx={{ fontSize: fontSize }}>{totalStars}</Typography>
              </TableCell>
            </TableRow>
            
            {/* Repositories */}
            <TableRow hover sx={{ 
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.01)',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.06)',
              }
            }}>
              <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ForkLeftIcon sx={{ color: blue[400], fontSize: fontSize + 4 }} />
                <Typography sx={{ fontSize: fontSize }}>Repositories</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight="bold" sx={{ fontSize: fontSize }}>{totalCommits}</Typography>
              </TableCell>
            </TableRow>
            
            {/* Public Repos */}
            <TableRow hover sx={{ 
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.06)',
              }
            }}>
              <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GitHubIcon sx={{ color: green[500], fontSize: fontSize + 4 }} />
                <Typography sx={{ fontSize: fontSize }}>Public Repos</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight="bold" sx={{ fontSize: fontSize }}>{user.publicRepos}</Typography>
              </TableCell>
            </TableRow>
            
            {/* Followers */}
            <TableRow hover sx={{ 
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.01)',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.06)',
              }
            }}>
              <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VisibilityIcon sx={{ color: purple[300], fontSize: fontSize + 4 }} />
                <Typography sx={{ fontSize: fontSize }}>Followers</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight="bold" sx={{ fontSize: fontSize }}>{user.followers}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Typography variant="subtitle2" sx={{ 
          mb: 0.5, 
          fontSize: fontSize,
          fontWeight: 'medium'
        }}>
          Top Projects
        </Typography>
        
        {mostStarredRepo && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mb: 0.5,
            p: 0.75, 
            borderRadius: 1,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)'
          }}>
            <StarIcon sx={{ color: amber[500], fontSize: fontSize + 2 }} />
            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
              <Typography noWrap sx={{ fontSize: fontSize - 1 }}>
                {mostStarredRepo[0]}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: fontSize - 3 }}>
                Most starred: {mostStarredRepo[1]} ⭐
              </Typography>
            </Box>
          </Box>
        )}
        
        {mostCommittedRepo && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            p: 0.75, 
            borderRadius: 1,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)'
          }}>
            <CommitIcon sx={{ color: green[500], fontSize: fontSize + 2 }} />
            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
              <Typography noWrap sx={{ fontSize: fontSize - 1 }}>
                {mostCommittedRepo[0]}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: fontSize - 3 }}>
                Most commits: {mostCommittedRepo[1]} 🔄
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default GitHubStats;