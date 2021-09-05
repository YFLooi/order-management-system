import mongoose, { Schema, Document } from "mongoose";
import { StatusCodes } from "http-status-codes";

// export interface ICarDataLean {
//   vehicleMake: string;
//   vehicleModel: string;
//   bodyType?: string;
//   engineCC?: number;
//   transmission: VehicleTransmission;
//   insurerModelMap?: { [insuranceProvider: string]: any };
// }

export interface IOrderRecordLean {}

const orderRecordSchema: Schema = new Schema({
  vehicleMake: { type: String, required: true, index: true, minlength: 1 },
  vehicleModel: { type: String, required: true, index: true, minlength: 1 },
  bodyType: { type: String, minlength: 1 },
  engineCC: { type: Number },
  transmission: { type: String, minlength: 1 },
  insurerModelMap: { type: Object },
});

// * Index
orderRecordSchema.index({ vehicleMake: 1, vehicleModel: 1 });

export type IOrderRecord = IOrderRecordLean & Document;

interface OrderRecordModelInterface extends mongoose.Model<IOrderRecord> {}

export default mongoose.model<IOrderRecord, OrderRecordModelInterface>(
  "orderRecord",
  orderRecordSchema
);
