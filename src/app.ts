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
import cronRoutes from "./routes/cronRoutes"
import uvestRoutes from "./routes/uvestRoutes."
import generalRoutes from "./routes/generalRoutes"


declare module "express-serve-static-core" {
    export interface CookieOptions {
      partitioned?: boolean;
    }
}

const app  = express()

app.use(cors({
    origin:['http://localhost:3000','https://utilourapp-z36b.vercel.app',"*"],
    credentials: true
}))

app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())
app.set("trust proxy",1)


app.use('/auth',authRoutes)
app.use('/savings',savingRoutes)
app.use('/uvest',uvestRoutes)
app.use('/hooks',hookRoutes)
app.use('/user',userRoutes)
app.use('/wallet',walletRoutes)
app.use('/general',generalRoutes)
app.use('/admin',adminRoutes)
app.use('/cron',cronRoutes)


app.all('*', (req, res) => {
    return res.status(404).json({ message: 'Route not found' });
});

export default app