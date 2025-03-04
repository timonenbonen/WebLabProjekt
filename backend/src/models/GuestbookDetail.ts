import {SongCard} from "./SongCard";

export interface GuestbookDetail {
    id: number,
    name: string,
    designId: number,
    shareLink: string,
    songCards: SongCard[]
}