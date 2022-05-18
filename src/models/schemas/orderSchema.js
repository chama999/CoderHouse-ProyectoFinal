//schema product json
import mongoose from 'mongoose';
import cartsSchemaMongoose from './cartSchema.js';
const Schema = mongoose.Schema;

const orderSchemaMongoose = new Schema({
    carts: {type: cartsSchemaMongoose, required: true},
    orderNumber: {type: Number, required: true, min: 0, unique: true},
    status: {type: String, required: true},
    createdDate: {type: String},
    updatedDate: {type: String}
});

export default orderSchemaMongoose;
