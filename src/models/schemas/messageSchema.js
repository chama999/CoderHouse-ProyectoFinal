import mongoose from 'mongoose';

//schema message json usando mongoose
const SchemaMongoose = mongoose.Schema;
const userSchemaMongoose = new SchemaMongoose({
    name: { type: String, required: true },
    email: { type: String, required: true }
});
const messageSchemaMongoose = new SchemaMongoose({
    user: { type: Object, required: true },
    message: { type: String, required: true },
    createdDate: { type: String},
    updatedDate: { type: String}
});

export {
    userSchemaMongoose,
    messageSchemaMongoose
}