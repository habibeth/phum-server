import cors from 'cors';
import express, { Application, NextFunction, Request, Response, response } from 'express';
import cookieParser from 'cookie-parser';
import { StudentRoutes } from './app/modules/student/student.route';
import { UserRoutes } from './app/modules/user/user.route';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import { notFound } from './app/middleware/notFound';
import router from './app/routes';

const app: Application = express();

//parser
app.use(express.json());
app.use(cookieParser())
app.use(cors({ origin: ['http://localhost:5173'] }));

app.use("/api/v1", router);

const test = async (req: Request, res: Response) => {
  // const a = 10;
  // res.send("Hello World!");
  // Promise.reject()
}

// app.get('/', test)

app.use(globalErrorHandler);

//not found 
app.use(notFound)

export default app;
