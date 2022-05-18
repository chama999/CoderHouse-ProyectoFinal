//schema product json
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String,required: false},
    price: {type: Number,required: true},
    stock: {type: Number,required: false},
    type: {type: String, required: true},
    category: {type: String, required: true},
    imageName: {type: String},
    createdDate: {type: String},
    updatedDate: {type: String}
});

const productCartSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String,required: false},
    price: {type: Number,required: true},
    quantity: {type: Number, required: true},
    type: {type: String, required: true},
    category: {type: String, required: true},
    createdDate: {type: String},
    updatedDate: {type: String}
});

export {productSchema,productCartSchema};
