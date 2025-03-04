export interface GuestbookEntryPersistence {
    personalMessage: string | null,
    guestName: string,
    spotifySongName: string,
    spotifyArtists: string[],
    spotifyId: string,
    spotifyReleaseYear: string,
    qrCode: string,
    guestbookId: string,

}