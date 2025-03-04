import axios from 'axios';
import { ApiResponse } from '../types/recipe';

const API_URL = 'http://localhost:4000/api';

export const fetchRecipes = async (
  filterType?: string,
  filterValue?: string
): Promise<ApiResponse> => {
  try {
    let url = `${API_URL}/recipes`;
    
    if (filterType && filterValue) {
      url += `?${filterType}=${encodeURIComponent(filterValue)}`;
    }
    
    const response = await axios.get<ApiResponse>(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw new Error('Failed to fetch recipes');
  }
};

export const fetchRecipeById = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await axios.get<ApiResponse>(`${API_URL}/recipes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching recipe by id ${id}:`, error);
    throw new Error('Failed to fetch recipe details');
  }
};