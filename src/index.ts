import dotenv from "dotenv"
import connectDB from "./db";
import { app } from "./app";

dotenv.config({
  path: './.env'
})

connectDB().then(() => { 
  app.listen(process.env.PORT || 3000, () => { 
    console.log("Server is running on port ", process.env.PORT || 3000)
  })
}).catch((error) => { 
  console.log("MONGO db connection failed !!! ", error)
})