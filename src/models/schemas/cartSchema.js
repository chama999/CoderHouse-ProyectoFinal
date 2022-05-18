//schema product json
import mongoose from 'mongoose';
import { productCartSchema } from './productSchema.js';
import { userSchemaMongoose } from './userSchema.js';
const Schema = mongoose.Schema;

const cartsSchemaMongoose = new Schema({
    user: {type: userSchemaMongoose, required: true},
    product: [{type: productCartSchema,required: true}],
    total: {type: Number, required: true, min: 0},
    createdDate: {type: String},
    updatedDate: {type: String}
});

export default cartsSchemaMongoose;
