export type BookmarkList = Bookmark[];

export interface Bookmark {
    id: string;
    title: string;
    url: string;
    icon?: string;
}