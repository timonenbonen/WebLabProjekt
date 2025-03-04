export interface SongCard {
    personalMessage: string | null,
    guestName: string,
    spotifySongName: string,
    spotifyArtists: string[],
    spotifyId: string,
    spotifyReleaseYear: string,
    guestbookId: string,
    qrCode: string,
}