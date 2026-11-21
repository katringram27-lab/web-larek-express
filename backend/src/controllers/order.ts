import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

interface IOrder {
  payment: 'card' | 'online';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      payment,
      email,
      phone,
      address,
      total,
      items,
    } = req.body as IOrder;

    if (
      !payment
      || !email
      || !phone
      || !address
      || typeof total !== 'number'
      || !Number.isFinite(total)
      || total < 0
      || !Array.isArray(items)
      || items.length === 0
    ) {
      next(new BadRequestError('Все поля заказа обязательны'));
      return;
    }

    if (
      !['card', 'online'].includes(payment)
      || typeof email !== 'string'
        || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      next(new BadRequestError('Некорректный способ оплаты или email'));
      return;
    }

    if (typeof phone !== 'string') {
      next(new BadRequestError('Некорректный номер телефона'));
      return;
    }

    const phoneDigits = phone.replace(/\D/g, '');

    if (
      !/^\+?[0-9\s()-]+$/.test(phone)
  || phoneDigits.length < 10
  || phoneDigits.length > 15
    ) {
      next(new BadRequestError('Некорректный номер телефона'));
      return;
    }

    if (!items.every((id) => typeof id === 'string' && mongoose.Types.ObjectId.isValid(id))) {
      next(new BadRequestError('Некорректный ID товара'));
      return;
    }

    const products = await Product.find({
      _id: { $in: items },
    });

    if (products.length !== new Set(items).size) {
      next(new BadRequestError('Некоторые товары не найдены'));
      return;
    }

    if (products.some((product) => product.price === null || product.price === undefined)) {
      next(new BadRequestError('У некоторых товаров отсутствует цена'));
      return;
    }

    const calculatedTotal = items.reduce((sum, itemId) => {
      const product = products.find(
        (item) => item._id.toString() === itemId,
      );
      return sum + (product?.price ?? 0);
    }, 0);

    if (calculatedTotal !== total) {
      next(new BadRequestError('Сумма заказа не совпадает со стоимостью товаров'));
      return;
    }

    res.status(200).json({
      id: randomUUID(),
      total: calculatedTotal,
    });
  } catch (err) {
    next(err);
  }
};
export default createOrder;
