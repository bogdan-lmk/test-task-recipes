"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
const BASE_URL = process.env.MEALDB_API_URL; // Updated to use the correct environment variable
console.log("Base URL for API:", BASE_URL); // Log the base URL
// 1. Get Available Recipes
// Example: GET /api/recipes?ingredient=chicken_breast
//          GET /api/recipes?country=Canadian
//          GET /api/recipes?category=Seafood
router.get("/", async (req, res) => {
    try {
        const { ingredient, country, category } = req.query;
        let url = `${BASE_URL}/search.php?s=`;
        if (ingredient) {
            url = `${BASE_URL}/filter.php?i=${ingredient}`;
        }
        else if (country) {
            url = `${BASE_URL}/filter.php?a=${country}`;
        }
        else if (category) {
            url = `${BASE_URL}/filter.php?c=${category}`;
        }
        console.log("Fetching recipes from URL:", url); // Log the constructed URL
        const response = await axios_1.default.get(url);
        // The data format from theMealDB is { meals: [...] } or null if no result
        res.json(response.data);
    }
    catch (error) {
        console.error("Error fetching recipes:", error); // Log the error details
        res.status(500).json({ error: "Unable to fetch recipes" });
    }
});
// 2. Get Detailed Recipe Info
// Example: GET /api/recipes/52772  => /lookup.php?i=52772
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const url = `${BASE_URL}/lookup.php?i=${id}`;
        const response = await axios_1.default.get(url);
        res.json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: "Unable to fetch recipe details" });
    }
});
exports.default = router;
