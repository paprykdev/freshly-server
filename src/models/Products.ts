import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "../types";

export interface IProductDocument extends Omit<IProduct, "_id">, Document {}

const productsSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  minimalTonnage: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

export default mongoose.model<IProductDocument>("Product", productsSchema);
