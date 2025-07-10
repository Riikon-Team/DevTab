export interface NoteItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  completed?: boolean;
  tags?: string[];
  color?: string;
  pinned?: boolean;
}