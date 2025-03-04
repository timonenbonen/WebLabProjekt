import {Base64ImageString} from "./Base64ImageString";

export interface SongCardBase64 {
    personalMessage: string | null,
    guestName: string,
    spotifySongName: string,
    spotifyArtists: string[],
    spotifyId: string,
    spotifyReleaseYear: string,
    guestbookId: string,
    qr_code: Base64ImageString,
}