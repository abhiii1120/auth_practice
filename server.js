import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { configDotenv } from "dotenv";
configDotenv()
connectDB();

app.listen(process.env.PORT,() => {
    console.log("backend running on port 3000")
})