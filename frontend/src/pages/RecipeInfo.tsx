// src/pages/RecipeInfo.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchRecipeById, fetchRecipes } from '../services/api';
import { Recipe } from '../types/recipe';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/RecipeInfo.css';

const RecipeInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [relatedRecipes, setRelatedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipeData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await fetchRecipeById(id);
        
        if (response.meals && Array.isArray(response.meals) && response.meals.length > 0) {
          const recipeData = response.meals[0];
          setRecipe(recipeData);
          
          // Fetch related recipes by category
          if (recipeData.strCategory) {
            const categoryResponse = await fetchRecipes('category', recipeData.strCategory);
            
            if (categoryResponse.meals && Array.isArray(categoryResponse.meals)) {
              // Filter out current recipe
              const filteredRecipes = categoryResponse.meals.filter(
                recipe => recipe.idMeal !== id
              ).slice(0, 5); // Limit to 5 related recipes
              
              setRelatedRecipes(filteredRecipes);
            }
          }
        } else {
          setError('Recipe not found');
        }
      } catch (err) {
        setError('Failed to load recipe details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeData();
  }, [id]);

  // Extract ingredients and measurements from recipe object
  const getIngredientsWithMeasures = (recipe: Recipe): {ingredient: string, measure: string}[] => {
    const ingredients: {ingredient: string, measure: string}[] = [];
    
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push({
          ingredient: ingredient,
          measure: measure || ''
        });
      }
    }
    
    return ingredients;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!recipe) return <div className="not-found">Recipe not found</div>;

  const ingredientsWithMeasures = getIngredientsWithMeasures(recipe);

  return (
    <div className="recipe-info-container">
      <div className="recipe-main-content">
        <div className="recipe-header">
          <div className="recipe-image-container">
            <img 
              src={recipe.strMealThumb} 
              alt={recipe.strMeal} 
              className="recipe-detail-image" 
            />
          </div>
          <div className="recipe-title-container">
            <h1 className="recipe-title">{recipe.strMeal}</h1>
            {recipe.strArea && (
              <Link to={`/?country=${recipe.strArea}`} className="recipe-country">
                {recipe.strArea} Cuisine
              </Link>
            )}
          </div>
        </div>
        
        <div className="recipe-body">
          <div className="recipe-ingredients-section">
            <h2 className="section-title">Ingredients</h2>
            <ul className="ingredients-list">
              {ingredientsWithMeasures.map((item, index) => (
                <li key={index} className="ingredient-item">
                  <Link to={`/?ingredient=${item.ingredient}`} className="ingredient-link">
                    {item.ingredient}
                  </Link>
                  <span className="ingredient-measure">{item.measure}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="recipe-instructions-section">
            <h2 className="section-title">Instructions</h2>
            <div className="instructions-text">
              {recipe.strInstructions?.split('\n').map((paragraph, index) => (
                paragraph.trim() ? <p key={index}>{paragraph}</p> : null
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="recipe-sidebar">
        <h2 className="sidebar-title">See More {recipe.strCategory} Recipes</h2>
        {relatedRecipes.length > 0 ? (
          <ul className="related-recipes-list">
            {relatedRecipes.map(related => (
              <li key={related.idMeal} className="related-recipe-item">
                <Link to={`/recipe/${related.idMeal}`} className="related-recipe-link">
                  <img 
                    src={related.strMealThumb} 
                    alt={related.strMeal} 
                    className="related-recipe-image" 
                  />
                  <span className="related-recipe-name">{related.strMeal}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-related-recipes">No related recipes found</p>
        )}
        
        <div className="view-all-container">
          <Link to={`/?category=${recipe.strCategory}`} className="view-all-button">
            View All {recipe.strCategory} Recipes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeInfo;