import dotenv from "dotenv"
import express ,{ Request } from "express"
import morgan from "morgan"
import cors from "cors"
import authRoutes from "./routes/authRoutes"
import cookieParser from "cookie-parser"
const app  = express()
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())

app.use('/user',authRoutes)


app.all('*', (req, res) => {
    return res.status(404).json({ message: 'Route not found' });
});

export default app