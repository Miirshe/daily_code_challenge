import express from 'express';
import cors from 'cors'
import { user_routes } from './routes/user_router.js';
import { connectDB } from './model/db_model.js';
const app = express();
app.use(express.json());
app.use(cors());
connectDB();
const port = 8000
app.use('/api', user_routes)
app.listen(port, () => {
    console.log(`listening on ${port}`);
});