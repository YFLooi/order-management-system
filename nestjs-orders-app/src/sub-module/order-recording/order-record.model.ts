import { Schema, Document } from 'mongoose';
import * as mongoose from 'mongoose';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DECLINED = 'declined',
}

export interface IOrderRecordLean {
  orderId: string;
  description: string;
  status: OrderStatus;
}

export const orderRecordSchema: Schema = new Schema(
  {
    orderId: { type: String, required: true, index: true, minlength: 1 },
    description: { type: String },
    status: { type: String, enum: Object.values(OrderStatus), index: true },
  },
  { timestamps: true },
);

// * Index
orderRecordSchema.index({ orderId: 1, createdAt: 1 });

export type IOrderRecord = IOrderRecordLean & Document;

export default mongoose.model<IOrderRecord>('orderRecord', orderRecordSchema);
