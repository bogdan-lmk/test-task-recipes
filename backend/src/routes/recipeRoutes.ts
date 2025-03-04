import { Router, Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config()

const router = Router();
const BASE_URL = process.env.MEALDB_API_URL;


// 1. Get Available Recipes
// Example: GET /api/recipes?ingredient=chicken_breast
//          GET /api/recipes?country=Canadian
//          GET /api/recipes?category=Seafood
router.get("/", async (req: Request, res: Response) => {
  try {
    const { ingredient, country, category } = req.query;

    let url = `${BASE_URL}/search.php?s=`;
    if (ingredient) {
      url = `${BASE_URL}/filter.php?i=${ingredient}`;
    } else if (country) {
      url = `${BASE_URL}/filter.php?a=${country}`;
    } else if (category) {
      url = `${BASE_URL}/filter.php?c=${category}`;
    }

    console.log("Fetching recipes from URL:", url); // Log the constructed URL
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching recipes:", error); // Log the error details
    res.status(500).json({ error: "Unable to fetch recipes" });
  }
});

// 2. Get Detailed Recipe Info
// Example: GET /api/recipes/52772  => /lookup.php?i=52772
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const url = `${BASE_URL}/lookup.php?i=${id}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch recipe details" });
  }
});

export default router;
