import dotenv from "dotenv"
import app from "./app";
import http from "http";


dotenv.config();

const server = http.createServer(app)
const PORT = process.env.PORT || 5000;

try {
    server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
} catch (e) {
    console.log('Cannot connect to the server');
}