import mongoose from "mongoose";

export async function connectDB() {
    try {
        await mongoose.connect('mongodb+srv://miirshe:miirshe123@cluster.9rwb442.mongodb.net/daily_blogs', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log('connected to database successfully');
        }).catch((error) => {
            console.log('error', error.message);
        })
    } catch (error) {
        console.log(`error : ${error.message}`);
    }
}