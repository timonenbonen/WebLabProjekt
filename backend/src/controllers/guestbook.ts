import express, {Router, Request, Response} from 'express';
import {searchSpotifySong, } from '../clients/spotify';
import multer from 'multer';
import {GuestbookEntryPresentation} from "../models/GuestbookEntryPresentation";
import {searchSong, addSongToGuestbook, getGuestbookByShareLink} from '../services/SongService';

const router = Router();
const upload = multer();

/**
 * @swagger
 * tags:
 *   name: Guestbook
 *   description: Guestbook-related API endpoints
 */


/**
 * @swagger
 * /guestbook/search:
 *   get:
 *     summary: Search for a song on Spotify
 *     tags: [Guestbook]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: The search term for finding songs on Spotify.
 *     responses:
 *       200:
 *         description: A list of matching songs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   spotifySongId:
 *                     type: string
 *                     example: "3n3Ppam7vgaVa1iaRUc9Lp"
 *                   songName:
 *                     type: string
 *                     example: "Bohemian Rhapsody"
 *                   artist:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Queen"]
 *       400:
 *         description: Missing query parameter.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/search', async (req: Request, res: Response): Promise<void> => {
    try {
        const query = req.query.query as string;

        if (!query) {
            res.status(400).json({error: 'Query parameter is required'});
            return;
        }

        const results = await searchSong(query);
        res.json(results);
    } catch (error) {
        console.error('Spotify API Error:', error); // Log full error
        res.status(500).json({error: 'Internal Server Error', details: error});
    }
});

/**
 * @swagger
 * /guestbook/add:
 *   post:
 *     summary: Add a song to a guestbook
 *     tags: [Guestbook]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guestName:
 *                 type: string
 *                 example: "John Doe"
 *               spotifySongId:
 *                 type: string
 *                 example: "3n3Ppam7vgaVa1iaRUc9Lp"
 *               guestbookId:
 *                 type: string
 *                 example: "1"
 *               personalMessage:
 *                 type: string
 *                 example: "This song reminds me of our wedding!"
 *     responses:
 *       201:
 *         description: Song successfully added to the guestbook.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/add', async (req: Request, res: Response): Promise<void> => {
    try {
        const { guestName, spotifySongId, guestbookId, personalMessage } = req.body;

        if (!guestName || !spotifySongId || !guestbookId) {
            res.status(400).json({ error: 'Missing required fields' });
            return
        }
        const guestbookEntry: GuestbookEntryPresentation = {
            personalMessage,
            guestName,
            spotifySongId,
            guestbookId
        }
        const result = await addSongToGuestbook(guestbookEntry);

        res.status(201).json({ message: 'Song added to guestbook', entry: result });
        return
    } catch (error) {
        console.error('Guestbook POST Error:', error);
        res.status(500).json({ error: 'Internal server error' });
        return
    }
});

/**
 * @swagger
 * /guestbook/by-share-link/{shareLink}:
 *   get:
 *     summary: Retrieve a guestbook by share link
 *     tags: [Guestbook]
 *     parameters:
 *       - in: path
 *         name: shareLink
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique share link for the guestbook.
 *     responses:
 *       200:
 *         description: The guestbook information.
 *       400:
 *         description: Share link is required.
 *       404:
 *         description: Guestbook not found.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/by-share-link/:shareLink', async (req: Request, res: Response) => {
    try {
        const { shareLink } = req.params;
        if (!shareLink) {
            res.status(400).json({ message: 'Share link is required' });
            return;
        }

        const guestbook = await getGuestbookByShareLink(shareLink);
        if (!guestbook) {
            res.status(404).json({ message: 'Guestbook not found' });
            return;
        }

        res.status(200).json(guestbook);
    } catch (error) {
        console.error('Error fetching guestbook:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export { router };