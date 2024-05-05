import dotenv from "dotenv"
import express ,{ Request } from "express"
import morgan from "morgan"
import cors from "cors"
import authRoutes from "./routes/authRoutes"
import cookieParser from "cookie-parser"
import savingRoutes from "./routes/savingsRoutes"
import hookRoutes from "./routes/webhooks"
import userRoutes from "./routes/userRoutes"
import walletRoutes from "./routes/walletRoutes"
import adminRoutes from "./routes/adminRoutes"

const app  = express()
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())

app.use('/auth',authRoutes)
app.use('/savings',savingRoutes)
app.use('/hooks',hookRoutes)
app.use('/user',userRoutes)
app.use('/wallet',walletRoutes)
app.use('/admin',adminRoutes)


app.all('*', (req, res) => {
    return res.status(404).json({ message: 'Route not found' });
});

export default app