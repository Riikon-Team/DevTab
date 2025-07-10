import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Badge,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Pagination,
  Tooltip,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Menu,
  MenuItem,
  FormControl,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import SortIcon from '@mui/icons-material/Sort';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isAfter, isBefore, parseISO, isValid } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNotesSettings } from '../../hooks/useSettings';
import { type NoteItem } from '../../constants/NoteTypes';
import './Notes.css';

const NOTE_COLORS = [
  '#ffffff', // trắng
  '#f28b82', // đỏ
  '#fbbc04', // vàng
  '#fff475', // vàng nhạt
  '#ccff90', // xanh lá cây
  '#a7ffeb', // xanh lơ
  '#cbf0f8', // xanh da trời
  '#aecbfa', // xanh dương
  '#d7aefb', // tím
  '#fdcfe8', // hồng
];

const Notes: React.FC = () => {
  const theme = useTheme();
  const { notesSettings, updateNotesSettings } = useNotesSettings();
  
  // Đảm bảo settings có giá trị mặc định
  const settings = {
    enable: notesSettings?.enable ?? true,
    backgroundTransparent: notesSettings?.backgroundTransparent ?? true,
    blur: notesSettings?.blur ?? 10,
    fontSize: notesSettings?.fontSize ?? 14,
    expandedView: notesSettings?.expandedView ?? false,
    showDeadline: notesSettings?.showDeadline ?? true,
    sortBy: notesSettings?.sortBy ?? 'createdAt',
    sortDirection: notesSettings?.sortDirection ?? 'desc',
  };

  // State
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Partial<NoteItem> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [anchorElSort, setAnchorElSort] = useState<null | HTMLElement>(null);
  
  const notesPerPage = settings.expandedView ? 4 : 8;

  const sortedNotes = [...notes].sort((a, b) => {
    if (settings.sortBy === 'createdAt') {
      return settings.sortDirection === 'asc' 
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (settings.sortBy === 'deadline') {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return settings.sortDirection === 'asc' ? 1 : -1;
      if (!b.deadline) return settings.sortDirection === 'asc' ? -1 : 1;
      
      return settings.sortDirection === 'asc'
        ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        : new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
    } else { 
      return settings.sortDirection === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
  });
  
  const pinnedNotes = sortedNotes.filter(note => note.pinned);
  const unpinnedNotes = sortedNotes.filter(note => !note.pinned);
  const displayNotes = [...pinnedNotes, ...unpinnedNotes];
  
  const paginatedNotes = displayNotes.slice(
    (page - 1) * notesPerPage,
    page * notesPerPage
  );

  // Tổng số trang
  const totalPages = Math.ceil(displayNotes.length / notesPerPage);

  useEffect(() => {
    const loadNotes = () => {
      try {
        setLoading(true);
        const savedNotes = localStorage.getItem('notes');
        if (savedNotes) {
          setNotes(JSON.parse(savedNotes));
        }
        setError(null);
      } catch (err) {
        console.error('Error loading notes:', err);
        setError('Cannot load notes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes]);

  const handleExpandView = () => {
    updateNotesSettings({ expandedView: !settings.expandedView });
    
    setPage(1);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElSort(event.currentTarget);
  };

  const handleSortClose = () => {
    setAnchorElSort(null);
  };

  const handleSort = (sortBy: 'createdAt' | 'deadline' | 'title', sortDirection: 'asc' | 'desc') => {
    updateNotesSettings({ sortBy, sortDirection });
    handleSortClose();
  };

  const handleOpenDialog = (note: NoteItem | null = null) => {
    if (note) {
      setCurrentNote({ ...note });
      setIsEditing(true);
    } else {
      setCurrentNote({
        title: '',
        content: '',
        color: NOTE_COLORS[0],
        tags: [],
      });
      setIsEditing(false);
    }
    setDialogOpen(true);
  };

  // Đóng dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentNote(null);
  };

  const handleSaveNote = () => {
    if (!currentNote || (!currentNote.title && !currentNote.content)) {
      return;
    }

    const now = new Date().toISOString();

    if (isEditing && currentNote.id) {
      setNotes(notes.map(note => 
        note.id === currentNote.id 
          ? { 
              ...note, 
              ...currentNote, 
              updatedAt: now 
            } 
          : note
      ));
    } else {
      const newNote: NoteItem = {
        id: Date.now().toString(),
        title: currentNote.title || '',
        content: currentNote.content || '',
        createdAt: now,
        updatedAt: now,
        deadline: currentNote.deadline || undefined,
        completed: false,
        color: currentNote.color || NOTE_COLORS[0],
        tags: currentNote.tags || [],
        pinned: currentNote.pinned || false
      };
      setNotes([newNote, ...notes]);
    }

    handleCloseDialog();
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, completed: !note.completed } 
        : note
    ));
  };

  const handleTogglePin = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, pinned: !note.pinned } 
        : note
    ));
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return 'Ngày không hợp lệ';
      return format(date, 'dd/MM/yyyy', { locale: vi });
    } catch (e) {
      return 'Ngày không hợp lệ';
    }
  };

  const isOverdue = (dateString?: string) => {
    if (!dateString) return false;
    try {
      const deadline = parseISO(dateString);
      return isValid(deadline) && isBefore(deadline, new Date()) && !isAfter(deadline, new Date());
    } catch (e) {
      return false;
    }
  };

  if (!settings.enable) {
    return null;
  }

  const getContrastText = (bgColor: string) => {
    const isLightColor = ['#ffffff', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa', '#fdcfe8'].includes(bgColor);
    return isLightColor ? 'rgba(0, 0, 0, 0.87)' : '#ffffff';
  };

  return (
    <Box
      className="notes-container"
      sx={{
        padding: 2,
        borderRadius: 2,
        backgroundColor: settings.backgroundTransparent ? 'transparent' : theme.palette.background.paper,
        backdropFilter: settings.backgroundTransparent ? `blur(${settings.blur}px)` : 'none',
        width: '100%',
        maxWidth: '100%',
        boxShadow: 1,
        position: 'relative',
        fontSize: settings.fontSize,
        height: settings.expandedView ? '80vh' : '30vh',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontSize: settings.fontSize + 4 }}>
          Notes & Tasks
        </Typography>

        <Box>
          <Tooltip title={settings.expandedView ? "Hide" : "Show"} placement="top">
            <IconButton size="small" onClick={handleExpandView}>
              {settings.expandedView ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Sort by" placement="top">
            <IconButton size="small" onClick={handleSortClick}>
              <SortIcon />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorElSort}
            open={Boolean(anchorElSort)}
            onClose={handleSortClose}
          >
            <MenuItem onClick={() => handleSort('createdAt', 'desc')}>
              <Typography variant="body2" sx={{ 
                fontSize: settings.fontSize - 2, 
                fontWeight: settings.sortBy === 'createdAt' && settings.sortDirection === 'desc' ? 'bold' : 'normal' 
              }}>
                Last created first
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => handleSort('createdAt', 'asc')}>
              <Typography variant="body2" sx={{ 
                fontSize: settings.fontSize - 2, 
                fontWeight: settings.sortBy === 'createdAt' && settings.sortDirection === 'asc' ? 'bold' : 'normal' 
              }}>
                First created first
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => handleSort('title', 'asc')}>
              <Typography variant="body2" sx={{ 
                fontSize: settings.fontSize - 2, 
                fontWeight: settings.sortBy === 'title' && settings.sortDirection === 'asc' ? 'bold' : 'normal' 
              }}>
                Title (A-Z)
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => handleSort('title', 'desc')}>
              <Typography variant="body2" sx={{ 
                fontSize: settings.fontSize - 2, 
                fontWeight: settings.sortBy === 'title' && settings.sortDirection === 'desc' ? 'bold' : 'normal' 
              }}>
                Tiêu đề (Z-A)
              </Typography>
            </MenuItem>
            {settings.showDeadline && (
              <>
                <MenuItem onClick={() => handleSort('deadline', 'asc')}>
                  <Typography variant="body2" sx={{ 
                    fontSize: settings.fontSize - 2, 
                    fontWeight: settings.sortBy === 'deadline' && settings.sortDirection === 'asc' ? 'bold' : 'normal' 
                  }}>
                    Deadline
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => handleSort('deadline', 'desc')}>
                  <Typography variant="body2" sx={{ 
                    fontSize: settings.fontSize - 2, 
                    fontWeight: settings.sortBy === 'deadline' && settings.sortDirection === 'desc' ? 'bold' : 'normal' 
                  }}>
                    Deadline (reverse)
                  </Typography>
                </MenuItem>
              </>
            )}
          </Menu>
        </Box>
      </Box>

      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Empty state */}
      {!loading && notes.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: settings.fontSize }}>
            No notes yet. Add your first note!
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ mt: 2, fontSize: settings.fontSize - 1 }}
          >
            Add new note
          </Button>
        </Box>
      )}

      {/* Notes grid */}
      {!loading && notes.length > 0 && (
        <>
          <Grid container spacing={2} sx={{ mb: 2, overflowY: 'auto', height: '50vh' }}>
            {paginatedNotes.map((note) => (
              <Grid item key={note.id} xs={12} sm={settings.expandedView ? 12 : 6} md={settings.expandedView ? 12 : 6} lg={settings.expandedView ? 12 : 3}>
                <Card 
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    backgroundColor: note.color || '#ffffff',
                    color: getContrastText(note.color || '#ffffff'),
                    boxShadow: note.pinned ? '0 3px 10px rgba(0,0,0,0.2)' : '0 1px 5px rgba(0,0,0,0.05)',
                    border: note.pinned ? `1px solid ${theme.palette.primary.main}` : 'none',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                    },
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  {/* Pin indicator */}
                  <Box sx={{ position: 'absolute', top: 4, right: 4 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleTogglePin(note.id)}
                      sx={{ color: getContrastText(note.color || '#ffffff') }}
                    >
                      {note.pinned ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
                    </IconButton>
                  </Box>
                  
                  <CardContent sx={{ 
                    p: settings.expandedView ? 2 : 1.5,
                    pb: settings.expandedView ? 2 : 1,
                    pt: settings.expandedView ? 2 : 3,  // Space for pin icon
                    flex: '1 0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    {/* Complete toggle for expanded view */}
                    {settings.expandedView && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleToggleComplete(note.id)}
                          sx={{ color: note.completed ? theme.palette.success.main : getContrastText(note.color || '#ffffff') }}
                        >
                          {note.completed ? <CheckCircleIcon fontSize="small" /> : <RadioButtonUncheckedIcon fontSize="small" />}
                        </IconButton>
                        <Typography variant="body2" sx={{ 
                          ml: 0.5, 
                          fontSize: settings.fontSize - 2,
                          textDecoration: note.completed ? 'line-through' : 'none',
                          opacity: note.completed ? 0.7 : 1
                        }}>
                          {note.completed ? 'Completed' : 'Not completed'}
                        </Typography>
                      </Box>
                    )}
                    
                    {/* Title */}
                    <Typography variant="subtitle1" sx={{ 
                      fontSize: settings.fontSize,
                      fontWeight: 'medium',
                      mb: 0.5,
                      textDecoration: note.completed ? 'line-through' : 'none',
                      opacity: note.completed ? 0.7 : 1
                    }}>
                      {note.title || 'No title'}
                    </Typography>
                    
                    {/* Content - limited for non-expanded view */}
                    <Typography variant="body2" sx={{ 
                      fontSize: settings.fontSize - 1,
                      mb: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: settings.expandedView ? 10 : 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      opacity: note.completed ? 0.7 : 1,
                      textDecoration: note.completed ? 'line-through' : 'none',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}>
                      {note.content}
                    </Typography>
                    
                    {/* Footer with metadata */}
                    <Box sx={{ mt: 'auto', fontSize: settings.fontSize - 3 }}>
                      {/* Tags */}
                      {settings.expandedView && note.tags && note.tags.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                          {note.tags.map((tag, index) => (
                            <Chip 
                              key={index} 
                              label={tag} 
                              size="small" 
                              sx={{ 
                                fontSize: settings.fontSize - 4,
                                height: 20,
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                color: getContrastText(note.color || '#ffffff'),
                              }} 
                            />
                          ))}
                        </Box>
                      )}
                      
                      {/* Dates and actions */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Box>
                          {/* Created date */}
                          <Typography variant="caption" color={getContrastText(note.color || '#ffffff')} sx={{ fontSize: settings.fontSize - 3 }}>
                            {formatDate(note.createdAt)}
                          </Typography>
                          
                          {/* Deadline */}
                          {settings.showDeadline && note.deadline && (
                            <Box component="span" sx={{ display: 'block' }}>
                              <Badge 
                                color="error" 
                                variant="dot" 
                                invisible={!isOverdue(note.deadline)}
                                sx={{ mr: 0.5 }}
                              >
                                <Typography variant="caption" color={getContrastText(note.color || '#ffffff')} sx={{ 
                                  fontSize: settings.fontSize - 3,
                                  fontWeight: isOverdue(note.deadline) ? 'bold' : 'normal'
                                }}>
                                  Deadline: {formatDate(note.deadline)}
                                </Typography>
                              </Badge>
                            </Box>
                          )}
                        </Box>
                        
                        {/* Action buttons */}
                        <Box>
                          {settings.expandedView && (
                            <>
                              <IconButton 
                                size="small" 
                                onClick={() => handleOpenDialog(note)}
                                sx={{ color: getContrastText(note.color || '#ffffff') }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                onClick={() => handleDeleteNote(note.id)}
                                sx={{ color: getContrastText(note.color || '#ffffff') }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </>
                          )}
                          {!settings.expandedView && (
                            <IconButton 
                              size="small" 
                              onClick={() => handleToggleComplete(note.id)}
                              sx={{ color: note.completed ? theme.palette.success.main : getContrastText(note.color || '#ffffff') }}
                            >
                              {note.completed ? <CheckCircleIcon fontSize="small" /> : <RadioButtonUncheckedIcon fontSize="small" />}
                            </IconButton>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                  
                  {/* Bottom actions for non-expanded view */}
                  {!settings.expandedView && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 0.5 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog(note)}
                        sx={{ color: getContrastText(note.color || '#ffffff') }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteNote(note.id)}
                        sx={{ color: theme.palette.error.main }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination 
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size="small"
              />
            </Box>
          )}
        </>
      )}

      {/* Floating Action Button */}
      <Fab 
        color="primary" 
        aria-label="add" 
        size="medium"
        onClick={() => handleOpenDialog()}
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>
      
      {/* Add/Edit Note Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
          }
        }}
      >
        <DialogTitle sx={{ fontSize: settings.fontSize + 2 }}>
          {isEditing ? 'Edit Note' : 'Add New Note'}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ backgroundColor: theme.palette.background.default, p: 2, borderRadius: 1, mb: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              value={currentNote?.title || ''}
              onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
              sx={{ mb: 2, fontSize: settings.fontSize }}
              InputProps={{
                style: { fontSize: settings.fontSize }
              }}
              InputLabelProps={{
                style: { fontSize: settings.fontSize }
              }}
            />
            
            <TextField
              margin="dense"
              id="content"
              label="Content"
              multiline
              rows={5}
              fullWidth
              variant="standard"
              value={currentNote?.content || ''}
              onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
              sx={{ mb: 2, fontSize: settings.fontSize }}
              InputProps={{
                style: { fontSize: settings.fontSize }
              }}
              InputLabelProps={{
                style: { fontSize: settings.fontSize }
              }}
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
              <DatePicker
                label="Deadline (optional)"
                value={currentNote?.deadline ? new Date(currentNote.deadline) : null}
                onChange={(date) => {
                  if (date) {
                    setCurrentNote({ ...currentNote, deadline: date.toISOString() });
                  } else {
                    const updatedNote = { ...currentNote };
                    delete updatedNote.deadline;
                    setCurrentNote(updatedNote);
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    InputProps: {
                      style: { fontSize: settings.fontSize }
                    },
                    InputLabelProps: {
                      style: { fontSize: settings.fontSize }
                    }
                  }
                }}
              />
            </LocalizationProvider>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontSize: settings.fontSize - 1 }}>
              Màu sắc
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {NOTE_COLORS.map((color) => (
                <Box
                  key={color}
                  onClick={() => setCurrentNote({ ...currentNote, color })}
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: color,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    border: color === currentNote?.color ? `2px solid ${theme.palette.primary.main}` : '1px solid #ccc',
                    '&:hover': {
                      transform: 'scale(1.2)',
                    },
                    transition: 'transform 0.2s ease',
                  }}
                />
              ))}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <FormControl variant="outlined" fullWidth size="small">
              <TextField
                label="Tags (press Enter to add)"
                variant="outlined"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                    const newTag = (e.target as HTMLInputElement).value.trim();
                    if (currentNote?.tags?.includes(newTag)) return;
                    
                    setCurrentNote({
                      ...currentNote,
                      tags: [...(currentNote?.tags || []), newTag]
                    });
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
                size="small"
                InputProps={{
                  style: { fontSize: settings.fontSize - 1 }
                }}
                InputLabelProps={{
                  style: { fontSize: settings.fontSize - 1 }
                }}
              />
            </FormControl>
          </Box>
          
          {currentNote?.tags && currentNote.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {currentNote.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  onDelete={() => {
                    setCurrentNote({
                      ...currentNote,
                      tags: currentNote.tags?.filter((_, i) => i !== index)
                    });
                  }}
                  sx={{ fontSize: settings.fontSize - 4 }}
                />
              ))}
            </Box>
          )}
          
          <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Typography sx={{ fontSize: settings.fontSize - 1, mr: 1 }}>
              Pin this note:
            </Typography>
            <IconButton
              onClick={() => setCurrentNote({ ...currentNote, pinned: !currentNote?.pinned })}
              color={currentNote?.pinned ? 'primary' : 'default'}
            >
              {currentNote?.pinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
            </IconButton>
          </FormControl>
          
          {isEditing && (
            <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mt: 1 }}>
              <Typography sx={{ fontSize: settings.fontSize - 1, mr: 1 }}>
                Mark as complete:
              </Typography>
              <IconButton
                onClick={() => setCurrentNote({ ...currentNote, completed: !currentNote?.completed })}
                color={currentNote?.completed ? 'success' : 'default'}
              >
                {currentNote?.completed ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
              </IconButton>
            </FormControl>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={handleCloseDialog}
            sx={{ fontSize: settings.fontSize - 1 }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSaveNote}
            variant="contained"
            sx={{ fontSize: settings.fontSize - 1 }}
          >
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notes;