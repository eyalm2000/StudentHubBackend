import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import config from './config';
// import mainRouter from './routes';
// import errorMiddleware from './middleware/errorMiddleware'; 

const app: Express = express();
const port = config.port;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/api', mainRouter);

if (config.nodeEnv === 'development') {
    app.get('/', (req: Request, res: Response) => {
        res.send('SchoolHub Backend API is running...');
    });
}

// app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});