import axios from 'axios';
import dotenv from 'dotenv';
import {SpotifySong} from "../models/SpotifySong";

dotenv.config();

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';



export async function getSpotifyToken(): Promise<string | null> {
    console.log('Fetching Spotify token...');
    const credentials = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
    const base64Credentials = Buffer.from(credentials).toString('base64');

    try {
        const response = await axios.post(
            SPOTIFY_AUTH_URL,
            new URLSearchParams({
                grant_type: 'client_credentials',
            }),
            {
                headers: {
                    Authorization: `Basic ${base64Credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching Spotify token:', error);
        return null;
    }
}

export async function searchSpotifySong(query: string): Promise<any[]> {
    console.log(`Searching for song: ${query}`);

    const token = await getSpotifyToken();
    if (!token) {
        console.error('Failed to obtain Spotify token.');
        return [];
    }

    try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                q: query,
                type: 'track',
                limit: 10,
            },
        });

        return response.data.tracks.items.map((item: any) => ({
            spotifyId: item.id,
            name: item.name,
            artist: item.artists.map((artist: any) => artist.name), // Now an array of strings
            releaseYear: item.album.release_date ? item.album.release_date.split('-')[0] : 'Unknown',
        } as SpotifySong));
    } catch (error) {
        console.error('Error searching Spotify:', error);
        return []; // Always return an array instead of undefined
    }

}
export async function getSongDetails(spotifySongId: string): Promise<{ name: string; artists: string[]; releaseYear: string } | null> {
    const token = await getSpotifyToken();
    if (!token) {
        throw new Error('Failed to obtain Spotify token');
    }

    try {
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${spotifySongId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const track = response.data;
        return {
            name: track.name,
            artists: track.artists.map((artist: any) => artist.name),
            releaseYear: track.album.release_date.split('-')[0], // Extract the year only
        };
    } catch (error) {
        console.error('Error fetching song details:', error);
        return null;
    }
}


