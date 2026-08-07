import app from './app.js'
import { connectDB } from './lib/mongo.js';

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`The server is connect on port: ${PORT}`)
    })
})