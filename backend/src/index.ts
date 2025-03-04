import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import recipeRoutes from "./routes/recipeRoutes";

dotenv.config(); 

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/recipes", recipeRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



