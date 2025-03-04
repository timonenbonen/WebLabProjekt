import {pool} from '../db';
import {GuestbookEntryPersistence} from '../models/GuestbookEntryPersistence';

export async function addGuestbookEntryToDB(entry: GuestbookEntryPersistence) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await client.query(
            `INSERT INTO t_song_card (name, spotify_id, year, qr_code, personal_message, guest_name, fk_guestbook_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING pk_song_card_id`,
            [
                entry.spotifySongName,
                entry.spotifyId,
                entry.spotifyReleaseYear,
                entry.qrCode,
                entry.personalMessage,
                entry.guestName,
                entry.guestbookId
            ]
        );

        const songCardId = result.rows[0].pk_song_card_id;
        for (const artist of entry.spotifyArtists) {
            const result = await client.query(
                `INSERT INTO t_artist (name)
                 VALUES ($1)
                 RETURNING pk_artist_id`,
                [
                    artist
                ]
            );
            const artistId = result.rows[0].pk_artist_id;

            await client.query(
                `INSERT INTO t_song_card_artist (pfk_song_card_id, pfk_artist_id)
                 VALUES ($1, $2)`,
                [
                    songCardId, artistId
                ]
            );
        }

        await client.query('COMMIT')
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error adding guestbook entry:', error);
    } finally {
        client.release();
    }
}
export async function getGuestbookByShareLinkFromDB(shareLink: string) {
    const query = `SELECT pk_guestbook_id AS id, name, fk_user_id AS userId, fk_design_id AS designId, share_link AS shareLink 
                   FROM t_guestbook
                   WHERE share_link = $1;`;
    const values = [shareLink];

    try {
        const result = await pool.query(query, values);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Database Error:', error);
        return null;
    }
}

