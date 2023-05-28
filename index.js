import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnection from './mongodb/dbConnection.js';
import router from './routes/userRoutes.js'
import bodyParser from 'body-parser';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use('/api/postApi', postRoutes);
app.use('/api', router);
app.get('/', async(req,res)=>{
    res.send('Server is running fine')
})

dbConnection(process.env.MONGO_DB_URL)
app.listen(process.env.PORT, ()=>{
    console.log(`Server is running in port ${process.env.PORT}`)
})