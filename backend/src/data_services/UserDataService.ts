import {pool} from '../db';
import {User} from "../models/User";
import {Guestbook} from "../models/Guestbook";
import {GuestbookOverview} from "../models/GuestbookOverview";
import {QueryResult} from "pg";
import {Design} from "../models/Design";
import {DesignOverview} from "../models/DesignOverview";
import {GuestbookDetail} from "../models/GuestbookDetail";
import {SongCard} from "../models/SongCard";


export async function createUser(display_name: string, username: string, passwordHash: string) {
    const result = await pool.query(
        `INSERT INTO t_user (display_name, username, password_hash)
         VALUES ($1, $2, $3)
         RETURNING pk_user_id`,
        [display_name, username, passwordHash]
    );
    const users = await mapUsers(result);
    if (users.length === 0) {
        return null;
    }
    return users ? users[0] : null;
}

export async function findUserByUsername(username: string) {
    const result = await pool.query(
        `SELECT *
         FROM t_user
         WHERE username = $1`,
        [username]
    );
    const users = await mapUsers(result);
    return users ? users[0] : null;
}

export async function updatePasswordHash(username: string, passwordHash: string) {
    const result = await pool.query(
        'UPDATE t_user SET password_hash = $2 WHERE username = $1',
        [username, passwordHash]
    );
    return result?.rowCount ? result.rowCount > 0 : false;
}

export async function updateDesign(guestbookId: number, designId: number) {
    if (!await existsDesignId(designId) || !await existsGuestbookId(guestbookId)) {
        return false;
    }
    const result = await pool.query(
        'UPDATE t_guestbook SET fk_design_id = $2 WHERE pk_guestbook_id = $1',
        [guestbookId, designId]
    );
    return result?.rowCount ? result.rowCount > 0 : false;
}

async function existsDesignId(designId: number) {
    const result = await pool.query(
        `SELECT *
         FROM t_design
         WHERE pk_design_id = $1`,
        [designId]
    );
    return result.rows.length > 0;
}

async function existsGuestbookId(guestbookId: number) {
    const result = await pool.query(
        `SELECT *
         FROM t_guestbook
         WHERE pk_guestbook_id = $1`,
        [guestbookId]
    );
    return result.rows.length > 0;
}

export async function createGuestbook(name: string, fk_user_id: number, fk_design_id: number, share_link: string): Promise<GuestbookDetail | null> {

    const query = `
        INSERT INTO t_guestbook (name, fk_user_id, fk_design_id, share_link)
        VALUES ($1, $2, $3, $4)
        RETURNING pk_guestbook_id;
    `;
    const values = [name, fk_user_id, fk_design_id, share_link];

    try {
        const result = await pool.query(query, values);
        const guestbook = await mapGuestbooks(result);
        return guestbook ? guestbook[0] : null;
    } catch (error) {
        console.error('Error creating guestbook:', error);
        return null;
    }
}

export async function findAllGuestbooksByUserId(userId: number): Promise<GuestbookDetail[] | null> {
    const query = `SELECT *
                   from t_guestbook
                   WHERE fk_user_id = $1`;
    const values = [userId];
    try {
        const result = await pool.query(query, values);
        const guestbooks = await mapGuestbooks(result)
        return guestbooks;
    } catch (error) {
        console.error('Error finding guestbooks:', error);
        return null;
    }
}

export async function findAllDesignsInDb() {
    const query = `SELECT *
                   from t_design`;
    try {
        const result = await pool.query(query);
        const designs = await mapDesigns(result)
        const overview: DesignOverview = {designs}
        return overview;
    } catch (error) {
        console.error('Error finding designs:', error);
        return {};
    }
}

export async function findGuestbookByGuestbookId(userId: number, guestbookId: number) {
    const query = `select *
                   from t_guestbook
                   WHERE fk_user_id = $1
                     and pk_guestbook_id = $2`;
    const values = [userId, guestbookId];
    try {
        const result = await pool.query(query, values);
        const guestbooks = await mapGuestbooks(result);
        return guestbooks[0];
    } catch (error) {
        console.error('Error finding guestbook:', error);
        return {success: false};
    }
}

export async function findGuestbookByGuestbookIdWithSongs(userId: number, guestbookId: number) {
    const query = `SELECT tg.pk_guestbook_id   AS guestbook_id,
                          tg.fk_design_id      AS design_id,
                          tg.fk_user_id        AS user_id,
                          tg.share_link        AS share_link,
                          tg.name              AS guestbook_name,
                          tsc.pk_song_card_id  AS song_card_id,
                          tsc.name             AS song_card_name,
                          tsc.year             AS year,
                          tsc.guest_name       AS guest_name,
                          tsc.personal_message AS personal_message,
                          tsc.spotify_id       AS spotify_id,
                          tsc.qr_code          AS qr_code,
                          array_agg(ta.name)   AS artist_names
                   FROM t_guestbook tg
                            INNER JOIN t_song_card tsc ON tg.pk_guestbook_id = tsc.fk_guestbook_id
                            INNER JOIN t_song_card_artist tsca ON tsc.pk_song_card_id = tsca.pfk_song_card_id
                            INNER JOIN t_artist ta ON tsca.pfk_artist_id = ta.pk_artist_id
                   WHERE tg.fk_user_id = $1
                     AND tg.pk_guestbook_id = $2
                   GROUP BY tg.pk_guestbook_id, tg.fk_design_id, tg.fk_user_id, tg.share_link, tg.name,
                            tsc.pk_song_card_id, tsc.name, tsc.year, tsc.guest_name, tsc.personal_message,
                            tsc.spotify_id, qr_code
                   ORDER BY tsc.pk_song_card_id`;
    const values = [userId, guestbookId];
    try {
        const result = await pool.query(query, values);
        const guestbooks = await mapGuestbookDetails(result);
        return guestbooks ? guestbooks[0] : null;
    } catch (error) {
        console.error('Error finding guestbook:', error);
        return null;
    }
}

async function mapGuestbooks(result: QueryResult<any>) {
    return result.rows.map((row: {
        pk_guestbook_id: number;
        name: string;
        fk_design_id: number;
        share_link: string
    }) => ({
        id: row.pk_guestbook_id,
        name: row.name,
        designId: row.fk_design_id,
        shareLink: row.share_link,
    })) as GuestbookDetail[];
}

async function mapGuestbookDetails(result: QueryResult<any>) {
    const songCards: SongCard[] = result.rows.map(row => ({
        personalMessage: row.personal_message ? row.personal_message : null,
        guestName: row.guest_name,
        spotifySongName: row.song_card_name,
        spotifyArtists: row.artist_names,
        spotifyId: row.spotify_id,
        spotifyReleaseYear: row.year,
        guestbookId: row.guestbook_id,
        qrCode: row.qr_code,
    }));
    return result.rows.map((row) => ({
        id: row.guestbook_id,
        name: row.guestbook_name,
        designId: row.design_id,
        shareLink: row.share_link,
        songCards: songCards
    })) as GuestbookDetail[];
}

async function mapDesigns(result: QueryResult<any>) {
    return result.rows.map((row: {
        pk_design_id: number;
        design_json: Map<string, any>
    }) => ({
        id: row.pk_design_id,
        properties: row.design_json
    })) as Design[];
}

async function mapUsers(result: QueryResult<any>) {
    return result.rows.map((row: {
        pk_user_id: number;
        username: string;
        password_hash: string;
        display_name: string
    }) => ({
        userId: row.pk_user_id,
        username: row.username,
        password: row.password_hash,
        displayName: row.display_name
    })) as User[];
}
