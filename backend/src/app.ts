import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import productRouter from './routes/product';
import orderRouter from './routes/order';
import errorHandler from './middlewares/error-handler';
import NotFoundError from './errors/not-found-error';
import { errors } from './middlewares/validation';
import { requestLogger, errorLogger } from './middlewares/logger';

const app = express();

app.use(requestLogger);
app.use(cors());
app.use(express.json());
app.use(
  express.static(path.join(__dirname, '../public')),
);
app.use('/product', productRouter);
app.use('/order', orderRouter);
app.use((_req, _res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

const startServer = async () => {
  try {
    await mongoose.connect(
      'mongodb://127.0.0.1:27017/weblarek',
    );
    // eslint-disable-next-line no-console
    console.log('MongoDB connected');

    app.listen(3000, () => {
    // eslint-disable-next-line no-console
      console.log('Server listening on port 3000');
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error:', err);
  }
};

startServer();
