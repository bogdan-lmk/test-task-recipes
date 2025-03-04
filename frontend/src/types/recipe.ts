export interface Recipe {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strCategory?: string;
    strArea?: string;
    strInstructions?: string;
    strTags?: string;
    strYoutube?: string;
    [key: string]: string | undefined;
  }
  
  export interface ApiResponse {
    meals: Recipe[] | null;
  }