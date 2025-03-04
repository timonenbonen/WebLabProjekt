import {Router, Request, Response} from 'express';
import {
    registerUser,
    updatePassword,
    createUserGuestbook,
    findUser,
    findAllGuestbooks,
    findSingleGuestbook,
    updateDesignOfGuestbook,
    findAllDesigns
} from '../services/UserService';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import {AuthenticatedRequest, authenticateUser} from "../middlewares/authMiddleware";

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User-related API endpoints
 */


/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Log in a user and return a JWT token
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "testuser"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       401:
 *         description: Invalid username or password
 */
authRouter.post('/login',
    async (req: Request, res: Response): Promise<void> => {
        console.log('Received request:', req.method, req.url); // ✅ Debug request method & URL
        console.log('Received headers:', req.headers); // ✅ Debug headers
        console.log('Received body:', req.body); // ✅ Check if body is received correctly
        const {username, password} = req.body;

        // Fetch user from DB
        const user = await findUser(username);
        if (!user) {
            res.status(401).json({message: 'Invalid username or password'});
            return;
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({message: 'Invalid username or password'});
            return;
        }

        // Generate JWT Token
        const token = jwt.sign({
            userId: user.userId,
            username: user.username,
            displayName: user.displayName
        }, JWT_SECRET, {expiresIn: '1h'});
        res.json({token});
    });

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayname:
 *                 type: string
 *                 example: "John Doe"
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Could not register user
 */
authRouter.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {

        const {displayname, username, password} = req.body;

        if (!displayname || !username || !password) {
            res.status(400).json({error: 'Username and password are required'});
            return
        }

        const user = await registerUser(displayname, username, password);
        if (!user) {
            res.status(500).json({message: 'Could not register user.'});
        }

        res.status(201).json({message: 'User registered successfully', userId: user?.userId});
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

/**
 * @swagger
 * /user/update:
 *   put:
 *     summary: Update the user's password
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "testuser"
 *               oldPassword:
 *                 type: string
 *                 example: "oldpassword"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword"
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Missing required fields or invalid credentials
 *       500:
 *         description: Internal server error
 */
authRouter.put('/update', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {

    try {
        const {username, oldPassword, newPassword} = req.body;

        if (!username || !oldPassword || !newPassword) {
            res.status(400).json({message: 'Username, old password, and new password are required.'});
            return
        }

        const result = await updatePassword(username, oldPassword, newPassword);

        if (result.success) {
            res.status(200).json({message: result.message});
            return
        } else {
            res.status(400).json({message: result.message});
            return
        }
    } catch (error) {
        console.error('Error in update-password route:', error);
        res.status(500).json({message: 'Internal server error'});
        return
    }


})

/**
 * @swagger
 * /user/createGuestbook:
 *   post:
 *     summary: Create a new guestbook for the authenticated user
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Wedding Guestbook"
 *               designId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Guestbook created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
authRouter.post('/createGuestbook', authenticateUser, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const {name, designId} = req.body;
        const user = req.user;
        if (!name || !designId || !user) {
            res.status(400).json({message: 'Guestbook name and design ID are required.'});
            return;
        }

        // The authenticated user ID is available in `req.user.userId`
        const userId = user.userId;

        const result = await createUserGuestbook(name, userId, designId);

        if (result.guestbook) {
            res.status(201).json({message: result.message, guestbook: result.guestbook});
            return;
        } else {
            res.status(400).json({message: result.message});
            return;
        }
    } catch (error) {
        console.error('Error in creating guestbook:', error);
        res.status(500).json({message: 'Internal server error'});
        return;
    }
});

/**
 * @swagger
 * /user/guestbookOverview:
 *   get:
 *     summary: Get all guestbooks for the authenticated user
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of guestbooks
 *       400:
 *         description: No guestbooks found
 *       500:
 *         description: Internal server error
 */
authRouter.get('/guestbookOverview', authenticateUser, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const user = req.user;
        if (!user) {
            res.status(400).json({message: 'User empty', guestbookOverview: []});
            return
        }
        const userId = user.userId;

        const guestbooks = await findAllGuestbooks(userId);

        if (!guestbooks) {
            res.status(400).json({message: 'Guestbook Overview not found.', guestbooks: []});
            return
        }
        res.status(201).json({guestbooks: guestbooks});
        return
    } catch (error) {
        res.status(500).json({message: 'Internal server error', guestbooks: []});
        return;
    }

});

/**
 * @swagger
 * /user/guestbook/{id}:
 *   get:
 *     summary: Retrieve a specific guestbook for an authenticated user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The guestbook ID to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved guestbook details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 guestbookDetails:
 *                   type: object
 *       400:
 *         description: Invalid guestbook ID or missing user authentication.
 *       404:
 *         description: Guestbook not found.
 *       500:
 *         description: Internal server error.
 */
authRouter.get('/guestbook/:id', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(400).json({message: 'User empty', guestbookDetails: []});
            return
        }
        const userId = user.userId;
        const guestbookId = req.params.id;
        const parsedGuestbookId = parseInt(guestbookId);
        if (isNaN(parsedGuestbookId)) {
            res.status(400).json({message: 'Invalid guestbook ID', guestbookDetails: []});
            return;
        }
        const result = await findSingleGuestbook(userId, parsedGuestbookId);
        if (result) {
            res.status(201).json({guestbookDetails: result});
        } else {
            res.status(400).json({message: 'Guestbook Overview not found.', guestbookDetails: []});
        }
        return;
    } catch (error) {
        console.error('Error retrieving guestbook:', error);
        res.status(500).json({message: 'Internal server error', guestbookDetails: []});
    }

})

/**
 * @swagger
 * /user/changeDesign:
 *   put:
 *     summary: Update the design of a guestbook
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guestbookId:
 *                 type: integer
 *                 example: 1
 *               designId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Successfully updated design.
 *       400:
 *         description: Missing guestbook ID or design ID, or invalid IDs.
 *       500:
 *         description: Internal server error.
 */
authRouter.put('/changeDesign', authenticateUser, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const {guestbookId, designId} = req.body;
        const user = req.user;
        if (!guestbookId || !designId || !user) {
            res.status(400).json({message: 'Guestbook ID and design ID are required.'});
            return;
        }

        const successful = await updateDesignOfGuestbook(guestbookId, designId);

        if (successful) {
            res.status(201).json({message: "Successfully updated design of guestbook."});
            return;
        } else {
            res.status(400).json({message: "Could not update design of guestbook. Invalid guestbook or design id"});
            return;
        }
    } catch (error) {
        console.error('Error in creating guestbook:', error);
        res.status(500).json({message: 'Internal server error'});
        return;
    }
});

/**
 * @swagger
 * /user/designOverview:
 *   get:
 *     summary: Retrieve all available guestbook designs
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all designs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 designOverview:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: No designs found.
 *       500:
 *         description: Internal server error.
 */
authRouter.get('/designOverview', authenticateUser, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const designs = await findAllDesigns();

        if (!designs) {
            res.status(400).json({message: 'Guestbook Overview not found.', designOverview: []});
            return
        }
        res.status(201).json({designOverview: designs});
        return
    } catch (error) {
        res.status(500).json({message: 'Internal server error', designOverview: []});
        return;
    }

});

export default authRouter;