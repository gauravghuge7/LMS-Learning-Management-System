import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import {userRouter} from './src/routes/user.routes.js';
import courseRouter from './src/routes/course.route.js';

dotenv.config({
    path: './.env'
})

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(morgan('dev'))


// app.use(cors({
//     origin: 'process.env.CORS_ORIGIN',
//     credentials: true
// }))

app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World!');
})



app.use('/user', userRouter);

app.use('/courses', courseRouter);








app.all('*', (req, res) => {
    res.status(404)
    .send('OOps this page is not found in currecullamnt')
})



export default app;