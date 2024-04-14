import dotenv from "dotenv"
import express ,{ Request } from "express"
import morgan from "morgan"
import cors from "cors"
import authRoutes from "./routes/authRoutes"
import cookieParser from "cookie-parser"
import savingRoutes from "./routes/savingsRoutes"
import hookRoutes from "./routes/webhooks"

const app  = express()
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())

app.use('/user',authRoutes)
app.use('/saving',savingRoutes)
app.use('/hooks',hookRoutes)


app.all('*', (req, res) => {
    return res.status(404).json({ message: 'Route not found' });
});

export default app