import bcrypt from 'bcrypt';
import {
    createUser,
    updatePasswordHash,
    findUserByUsername,
    createGuestbook,
    findAllGuestbooksByUserId,
    updateDesign,
    findAllDesignsInDb,
    findGuestbookByGuestbookIdWithSongs,
    findGuestbookByGuestbookId
} from '../data_services/UserDataService';
import crypto from 'crypto';
import {User} from "../models/User";
import {SongCardBase64} from "../models/SongCardBase64";
import {GuestbookDetail} from "../models/GuestbookDetail";
import {Guestbook} from "../models/Guestbook";

const SALT_ROUNDS = 10;

export async function registerUser(displayname: string, username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return await createUser(displayname, username, hashedPassword);
}

export async function updatePassword(username: string, oldPassword: string, newPassword: string) {
    try {
        // Retrieve user from database
        const user = await findUserByUsername(username);
        if (!user) {
            return {success: false, message: 'User not found.'};
        }

        // Compare old password with stored hash
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return {success: false, message: 'Old password is incorrect.'};
        }
        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password in database
        const updateSuccess = await updatePasswordHash(username, hashedNewPassword);
        if (!updateSuccess) {
            return {success: false, message: 'Password update failed. Please try again.'};
        }

        return {success: true, message: 'Password updated successfully.'};
    } catch (error) {
        console.error('Error updating password:', error);
        return {success: false, message: 'An error occurred while updating the password.'};
    }
}

export async function createUserGuestbook(name: string, fk_user_id: number, fk_design_id: number) {
    if (!name || !fk_user_id || !fk_design_id) {
        return {message: 'Guestbook name, user ID, and design ID are required.'};
    }
    const share_link = crypto.randomBytes(16).toString('hex');

    const guestbook = await createGuestbook(name, fk_user_id, fk_design_id, share_link);
    if (!guestbook) {
        return {message: 'Failed to create guestbook.'};
    }

    return {message: 'Guestbook created successfully.', guestbook: guestbook};
}

export async function findUser(username: string): Promise<User | null> {
    const user = findUserByUsername(username);
    if (!user) {
        return null;
    }
    return user;
}

export async function findAllGuestbooks(userId: number): Promise<GuestbookDetail[]> {
    const guestbooks = await findAllGuestbooksByUserId(userId);

    if (!guestbooks) {
        return [];
    }

    return guestbooks;
}

export async function findAllDesigns() {
    const designs = await findAllDesignsInDb();

    if (!designs) {
        return [];
    }
    return designs;
}

export async function findSingleGuestbook(userId: number, guestbookId: number) {
    const guestbookWithSongs = await findGuestbookByGuestbookIdWithSongs(userId, guestbookId);


    if (!guestbookWithSongs) {
        return findGuestbookByGuestbookId(userId, guestbookId)
    }
    return guestbookWithSongs
}

export async function updateDesignOfGuestbook(guestbookId: number, designId: number) {
    return updateDesign(guestbookId, designId)
}