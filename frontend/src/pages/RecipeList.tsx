// src/pages/RecipeList.tsx
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchRecipes } from '../services/api';
import { Recipe } from '../types/recipe';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/RecipeList.css';

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  
  const ingredient = searchParams.get('ingredient');
  const country = searchParams.get('country');
  const category = searchParams.get('category');

  useEffect(() => {
    const getRecipes = async () => {
      try {
        setLoading(true);
        let filterType: string | undefined;
        let filterValue: string | undefined;
        
        if (ingredient) {
          filterType = 'ingredient';
          filterValue = ingredient;
        } else if (country) {
          filterType = 'country';
          filterValue = country;
        } else if (category) {
          filterType = 'category';
          filterValue = category;
        }
        
        const response = await fetchRecipes(filterType, filterValue);
        setRecipes(response.meals as Recipe[]);
        setError(null);
      } catch (err) {
        setError('Failed to load recipes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    getRecipes();
  }, [ingredient, country, category]);

  const getTitle = () => {
    if (ingredient) return `Recipes with ${ingredient}`;
    if (country) return `${country} Cuisine`;
    if (category) return `${category} Recipes`;
    return 'All Recipes';
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (recipes.length === 0) return <div className="no-recipes">No recipes found</div>;

  return (
    <div className="recipe-list-container">
      <h1 className="page-title">{getTitle()}</h1>
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <Link to={`/recipe/${recipe.idMeal}`} key={recipe.idMeal} className="recipe-card">
            <div className="recipe-image-container">
              <img 
                src={recipe.strMealThumb} 
                alt={recipe.strMeal} 
                className="recipe-image" 
              />
            </div>
            <div className="recipe-card-content">
              <h3 className="recipe-card-title">{recipe.strMeal}</h3>
              {recipe.strCategory && <p className="recipe-card-category">{recipe.strCategory}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;