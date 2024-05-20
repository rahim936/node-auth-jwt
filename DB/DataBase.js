import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config()

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const hostname = process.env.HOSTNAME; 
const db_port = process.env.DB_PORT;
const db_name = process.env.DB_NAME;
const auth_source = process.env.AUTH_SOURCE;

const MONGO_URI =  `mongodb://${username}:${password}@${hostname}:${db_port}/${db_name}?authSource=${auth_source}`

mongoose.set('strictQuery', false)
mongoose.set('bufferTimeoutMS', 10_000)

const ConnectDB = async () => {
    await mongoose.connect(MONGO_URI)
}

export default ConnectDB