import express, { Request, Response } from 'express';
import { router as guestbook } from "./controllers/guestbook";
import userRouter from './controllers/user';
import cors from 'cors';
import {setupSwagger} from './swaggerConfig';

const app = express();
const port = process.env.PORT || 3000;

setupSwagger(app);

app.use(cors({
    origin: 'http://localhost:4200',  // ✅ Allow frontend requests
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


app.use(express.json());

app.use("/guestbook", guestbook);

app.use('/user', userRouter);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});