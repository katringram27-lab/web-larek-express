import mongoose from 'mongoose';

// Описываем интерфейс
export interface IImage {
  fileName: string;
  originalName: string;
}

export interface IProduct {
  title: string;
  image: IImage;
  category: string;
  description?: string;
  price?: number | null;
}

// Создаем схему MongoDB
const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Поле "title" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "title" - 2'],
    maxlength: [30, 'Максимальная длина поля "title" - 30'],
    unique: true,
  },
  image: {
    fileName: { type: String, required: [true, 'Поле "fileName" должно быть заполнено'] },
    originalName: { type: String, required: [true, 'Поле "originalName" должно быть заполнено'] },
  },
  category: {
    type: String,
    required: [true, 'Поле "category" должно быть заполнено'],
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    min: [0, 'Цена не может быть отрицательной'],
    default: null,
  },
});

// Создаем модель
export default mongoose.model<IProduct>('product', productSchema);
