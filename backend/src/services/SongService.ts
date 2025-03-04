import express, {Request, Response} from 'express';
import {GuestbookEntryPersistence} from '../models/GuestbookEntryPersistence';
import {GuestbookEntryPresentation} from '../models/GuestbookEntryPresentation';
import {SpotifySong} from '../models/SpotifySong';
import { Router } from "express";
import {addGuestbookEntryToDB, getGuestbookByShareLinkFromDB} from '../data_services/SongDataService'
import multer from 'multer';
import {getSongDetails, searchSpotifySong}  from '../clients/spotify';
import QRCode from 'qrcode';

const service = Router();
export async function searchSong(query: string) {
    return await searchSpotifySong(query);
}

export async function addSongToGuestbook(entry: GuestbookEntryPresentation) {
    // ✅ Add business logic here (e.g., duplicate checks, transformations)
    const songDetails = await getSongDetails(entry.spotifySongId);
    if (!songDetails) {
        throw new Error('Failed to retrieve Spotify song details');
    }

    const spotifyLink = `https://open.spotify.com/track/${entry.spotifySongId}`;

    const qrCodeBuffer = await QRCode.toDataURL(spotifyLink);  //todo> base64

    const guestbookEntry: GuestbookEntryPersistence ={
        guestbookId: entry.guestbookId,
        personalMessage: entry.personalMessage,
        guestName: entry.guestName,
        spotifyArtists: songDetails.artists,
        spotifyId: entry.spotifySongId,
        spotifyReleaseYear: songDetails.releaseYear,
        spotifySongName: songDetails.name,
        qrCode: qrCodeBuffer

    }
    // ✅ Call Data Service for persistence
    return await addGuestbookEntryToDB(guestbookEntry);
}
export async function getGuestbookByShareLink(shareLink: string) {
    return await getGuestbookByShareLinkFromDB(shareLink);
}