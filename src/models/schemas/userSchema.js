//schema message json mongoose
import mongoose from 'mongoose';
const SchemaMongoose = mongoose.Schema;
const registerSchemaMongoose = new SchemaMongoose({
    email: { type: String, required: true },
    name: { type: String, required: true},
    age: { type: Number, required: false},
    address: {type: String, required: false},
    phone: { type: String, required: false },
    password: { type: String, required: true },
    rol: { type: String, required: true },
    createdDate: { type: String },
    updatedDate: { type: String }
});

const userSchemaMongoose = new SchemaMongoose({
    email: { type: String, required: true },
    name: { type: String, required: true},
    age: { type: Number, required: false },
    address: {type: String, required: false },
    phone: { type: String, required: true },
    createdDate: { type: String },
    updatedDate: { type: String }
});

export { registerSchemaMongoose, userSchemaMongoose };