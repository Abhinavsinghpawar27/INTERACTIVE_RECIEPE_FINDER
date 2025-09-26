// Global Variables
let ingredients = [];

// ⚠️ IMPORTANT: Replace with your actual Spoonacular API key
// Get your free API key from: https://spoonacular.com/food-api/console#Dashboard
const API_KEY = 'de2fc00b0ad14d29983cd0b8b5e9581e';

// Base URLs for Spoonacular API
const BASE_URL = 'https://api.spoonacular.com';

// ========== INGREDIENT MANAGEMENT ==========

/**
 * Adds an ingredient to the list
 */
function addIngredient() {
    const input = document.getElementById('ingredientInput');
    const ingredient = input.value.trim();
    
    if (ingredient && !ingredients.includes(ingredient.toLowerCase())) {
        ingredients.push(ingredient.toLowerCase());
        input.value = '';
        updateIngredientsDisplay();
    }
}

/**
 * Updates the visual display of ingredients
 */
function updateIngredientsDisplay() {
    const display = document.getElementById('ingredientsDisplay');
    display.innerHTML = ingredients.map(ingredient => `
        <div class="ingredient-tag">
            ${ingredient}
            <span class="remove" onclick="removeIngredient('${ingredient}')">×</span>
        </div>
    `).join('');
}

/**
 * Removes a specific ingredient from the list
 * @param {string} ingredient - The ingredient to remove
 */
function removeIngredient(ingredient) {
    ingredients = ingredients.filter(i => i !== ingredient);
    updateIngredientsDisplay();
}

/**
 * Clears all ingredients from the list
 */
function clearIngredients() {
    ingredients = [];
    updateIngredientsDisplay();
    document.getElementById('recipesSection').innerHTML = '';
}

// ========== RECIPE SEARCH ==========

/**
 * Main function to find recipes based on ingredients
 */
async function findRecipes() {
    if (ingredients.length === 0) {
        showError('Please add at least one ingredient to search for recipes.');
        return;
    }

    showLoading(true);
    hideError();

    // Check if API key is configured
    if (!API_KEY || API_KEY === 'YOUR_SPOONACULAR_API_KEY') {
        setTimeout(() => {
            showDemoRecipes();
            showLoading(false);
        }, 1500);
        return;
    }

    try {
        const ingredientsString = ingredients.join(',+');
        const url = `${BASE_URL}/recipes/findByIngredients?ingredients=${ingredientsString}&number=12&ranking=1&ignorePantry=true&apiKey=${API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid API key. Please check your Spoonacular API key.');
            } else if (response.status === 402) {
                throw new Error('API quota exceeded. Please check your Spoonacular account.');
            } else {
                throw new Error(`API Error: ${response.status}`);
            }
        }

        const recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        showError(error.message || 'Failed to fetch recipes. Please check your internet connection and API key.');
    } finally {
        showLoading(false);
    }
}

/**
 * Displays the list of recipes in the grid
 * @param {Array} recipes - Array of recipe objects
 */
function displayRecipes(recipes) {
    const recipesSection = document.getElementById('recipesSection');
    
    if (recipes.length === 0) {
        recipesSection.innerHTML = `
            <div class="no-results">
                <h3>No recipes found</h3>
                <p>Try different ingredients or add more to your list</p>
            </div>
        `;
        return;
    }

    recipesSection.innerHTML = recipes.map(recipe => `
        <div class="recipe-card">
            <img src="${recipe.image || 'https://via.placeholder.com/400x200?text=Recipe+Image'}" 
                 alt="${recipe.title}" 
                 class="recipe-image" 
                 onerror="this.src='https://via.placeholder.com/400x200?text=Recipe+Image'">
            <div class="recipe-content">
                <h3 class="recipe-title">${recipe.title}</h3>
                <div class="recipe-stats">
                    <div class="recipe-stat">
                        <span>⏱️</span>
                        <span>${recipe.readyInMinutes || 'N/A'} min</span>
                    </div>
                    <div class="recipe-stat">
                        <span>👥</span>
                        <span>${recipe.servings || 'N/A'} servings</span>
                    </div>
                    <div class="recipe-stat">
                        <span>❤️</span>
                        <span>${recipe.aggregateLikes || 0} likes</span>
                    </div>
                </div>
                <div class="recipe-ingredients">
                    <h4>Ingredients Status:</h4>
                    <div class="used-ingredients">
                        ✅ Used: ${recipe.usedIngredientCount || 0} ingredients
                    </div>
                    <div class="missing-ingredients">
                        ❌ Missing: ${recipe.missedIngredientCount || 0} ingredients
                    </div>
                </div>
                <button class="view-recipe-btn" onclick="viewRecipe(${recipe.id})">
                    View Full Recipe
                </button>
            </div>
        </div>
    `).join('');
}

// ========== DEMO RECIPES (for testing without API key) ==========

/**
 * Shows demo recipes when API key is not configured
 */
function showDemoRecipes() {
    const demoRecipes = [
        {
            id: 1,
            title: "Chicken Stir Fry with Vegetables",
            image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=200&fit=crop",
            readyInMinutes: 25,
            servings: 4,
            aggregateLikes: 147,
            usedIngredientCount: Math.min(ingredients.length, 3),
            missedIngredientCount: Math.max(0, 3 - ingredients.length)
        },
        {
            id: 2,
            title: "Tomato Basil Pasta",
            image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=200&fit=crop",
            readyInMinutes: 20,
            servings: 3,
            aggregateLikes: 89,
            usedIngredientCount: Math.min(ingredients.length, 2),
            missedIngredientCount: Math.max(0, 4 - ingredients.length)
        },
        {
            id: 3,
            title: "Rice Bowl with Vegetables",
            image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=200&fit=crop",
            readyInMinutes: 30,
            servings: 2,
            aggregateLikes: 203,
            usedIngredientCount: Math.min(ingredients.length, 4),
            missedIngredientCount: Math.max(0, 2 - ingredients.length)
        },
        {
            id: 4,
            title: "Garlic Butter Shrimp",
            image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=200&fit=crop",
            readyInMinutes: 15,
            servings: 4,
            aggregateLikes: 312,
            usedIngredientCount: Math.min(ingredients.length, 2),
            missedIngredientCount: Math.max(0, 3 - ingredients.length)
        }
    ];

    displayRecipes(demoRecipes);
}

// ========== INDIVIDUAL RECIPE VIEWING ==========

/**
 * Views detailed information for a specific recipe
 * @param {number} recipeId - The ID of the recipe to view
 */
async function viewRecipe(recipeId) {
    // Check if API key is configured
    if (!API_KEY || API_KEY === 'YOUR_SPOONACULAR_API_KEY') {
        showDemoRecipeDetails(recipeId);
        return;
    }

    showLoading(true);
    
    try {
        const url = `${BASE_URL}/recipes/${recipeId}/information?includeNutrition=true&apiKey=${API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch recipe details');
        }

        const recipeDetails = await response.json();
        showRecipeModal(recipeDetails);
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        showError('Failed to fetch recipe details. Please try again.');
    } finally {
        showLoading(false);
    }
}

/**
 * Shows demo recipe details when API key is not configured
 * @param {number} recipeId - The ID of the demo recipe
 */
function showDemoRecipeDetails(recipeId) {
    const demoRecipeDetails = {
        1: {
            title: "Chicken Stir Fry with Vegetables",
            readyInMinutes: 25,
            servings: 4,
            pricePerServing: 3.47,
            summary: "A delicious and healthy chicken stir fry packed with fresh vegetables and Asian flavors. This quick and easy recipe is perfect for busy weeknights.",
            extendedIngredients: [
                { original: "2 chicken breasts, sliced thin" },
                { original: "2 tablespoons vegetable oil" },
                { original: "1 bell pepper, sliced" },
                { original: "1 medium onion, sliced" },
                { original: "2 cloves garlic, minced" },
                { original: "2 tablespoons soy sauce" },
                { original: "1 tablespoon oyster sauce" },
                { original: "1 teaspoon sesame oil" },
                { original: "2 green onions, chopped" }
            ],
            analyzedInstructions: [{
                steps: [
                    { number: 1, step: "Heat vegetable oil in a large wok or skillet over high heat." },
                    { number: 2, step: "Add sliced chicken and cook until golden brown and cooked through, about 5-6 minutes." },
                    { number: 3, step: "Add minced garlic and cook for 30 seconds until fragrant." },
                    { number: 4, step: "Add bell pepper and onion, stir-fry for 3-4 minutes until tender-crisp." },
                    { number: 5, step: "Mix in soy sauce, oyster sauce, and sesame oil. Toss everything together." },
                    { number: 6, step: "Cook for 1-2 more minutes until sauce coats the ingredients." },
                    { number: 7, step: "Garnish with green onions and serve hot over steamed rice." }
                ]
            }],
            nutrition: {
                nutrients: [
                    { name: "Calories", amount: 285, unit: "kcal" },
                    { name: "Protein", amount: 28, unit: "g" },
                    { name: "Fat", amount: 12, unit: "g" },
                    { name: "Carbohydrates", amount: 15, unit: "g" }
                ]
            }
        },
        2: {
            title: "Tomato Basil Pasta",
            readyInMinutes: 20,
            servings: 3,
            pricePerServing: 2.15,
            summary: "A classic Italian pasta dish featuring fresh tomatoes, aromatic basil, and garlic. Simple ingredients come together to create a flavorful and satisfying meal.",
            extendedIngredients: [
                { original: "12 oz pasta (penne or spaghetti)" },
                { original: "4 large ripe tomatoes, diced" },
                { original: "3 cloves garlic, minced" },
                { original: "1/4 cup fresh basil leaves, chopped" },
                { original: "3 tablespoons extra virgin olive oil" },
                { original: "1/2 cup parmesan cheese, grated" },
                { original: "Salt and black pepper to taste" },
                { original: "Red pepper flakes (optional)" }
            ],
            analyzedInstructions: [{
                steps: [
                    { number: 1, step: "Bring a large pot of salted water to boil and cook pasta according to package instructions until al dente." },
                    { number: 2, step: "Meanwhile, heat olive oil in a large pan over medium heat." },
                    { number: 3, step: "Add minced garlic and cook until fragrant, about 1 minute." },
                    { number: 4, step: "Add diced tomatoes and cook for 5-7 minutes until they break down and become saucy." },
                    { number: 5, step: "Season with salt, pepper, and red pepper flakes if using." },
                    { number: 6, step: "Drain pasta, reserving 1/2 cup pasta water." },
                    { number: 7, step: "Add pasta to the tomato mixture and toss with fresh basil and parmesan cheese." },
                    { number: 8, step: "Add pasta water if needed to create a silky sauce. Serve immediately." }
                ]
            }],
            nutrition: {
                nutrients: [
                    { name: "Calories", amount: 420, unit: "kcal" },
                    { name: "Protein", amount: 15, unit: "g" },
                    { name: "Fat", amount: 14, unit: "g" },
                    { name: "Carbohydrates", amount: 62, unit: "g" }
                ]
            }
        },
        3: {
            title: "Rice Bowl with Vegetables",
            readyInMinutes: 30,
            servings: 2,
            pricePerServing: 2.80,
            summary: "A nutritious and colorful rice bowl loaded with fresh vegetables and Asian-inspired flavors. Perfect for a healthy lunch or dinner.",
            extendedIngredients: [
                { original: "1 cup jasmine rice" },
                { original: "2 cups mixed vegetables (broccoli, carrots, snap peas)" },
                { original: "2 tablespoons sesame oil" },
                { original: "2 tablespoons soy sauce" },
                { original: "1 tablespoon rice vinegar" },
                { original: "1 teaspoon fresh ginger, minced" },
                { original: "2 green onions, sliced" },
                { original: "1 tablespoon sesame seeds" },
                { original: "1 tablespoon honey" }
            ],
            analyzedInstructions: [{
                steps: [
                    { number: 1, step: "Cook jasmine rice according to package instructions." },
                    { number: 2, step: "Steam or stir-fry mixed vegetables until tender-crisp, about 5-6 minutes." },
                    { number: 3, step: "In a small bowl, whisk together sesame oil, soy sauce, rice vinegar, ginger, and honey." },
                    { number: 4, step: "Divide cooked rice between two bowls." },
                    { number: 5, step: "Top each bowl with the cooked vegetables." },
                    { number: 6, step: "Drizzle with the sauce and garnish with green onions and sesame seeds." },
                    { number: 7, step: "Serve immediately while warm." }
                ]
            }],
            nutrition: {
                nutrients: [
                    { name: "Calories", amount: 380, unit: "kcal" },
                    { name: "Protein", amount: 8, unit: "g" },
                    { name: "Fat", amount: 16, unit: "g" },
                    { name: "Carbohydrates", amount: 58, unit: "g" }
                ]
            }
        },
        4: {
            title: "Garlic Butter Shrimp",
            readyInMinutes: 15,
            servings: 4,
            pricePerServing: 4.25,
            summary: "Quick and flavorful garlic butter shrimp that's ready in just 15 minutes. Perfect served over pasta, rice, or with crusty bread.",
            extendedIngredients: [
                { original: "1 lb large shrimp, peeled and deveined" },
                { original: "4 tablespoons butter" },
                { original: "4 cloves garlic, minced" },
                { original: "1/4 cup white wine (optional)" },
                { original: "2 tablespoons lemon juice" },
                { original: "2 tablespoons fresh parsley, chopped" },
                { original: "1/2 teaspoon red pepper flakes" },
                { original: "Salt and pepper to taste" }
            ],
            analyzedInstructions: [{
                steps: [
                    { number: 1, step: "Pat shrimp dry and season with salt and pepper." },
                    { number: 2, step: "Heat butter in a large skillet over medium-high heat." },
                    { number: 3, step: "Add garlic and red pepper flakes, cook for 30 seconds until fragrant." },
                    { number: 4, step: "Add shrimp and cook for 2-3 minutes per side until pink and cooked through." },
                    { number: 5, step: "Add white wine if using and lemon juice, cook for 1 minute." },
                    { number: 6, step: "Remove from heat and stir in fresh parsley." },
                    { number: 7, step: "Serve immediately while hot." }
                ]
            }],
            nutrition: {
                nutrients: [
                    { name: "Calories", amount: 195, unit: "kcal" },
                    { name: "Protein", amount: 23, unit: "g" },
                    { name: "Fat", amount: 9, unit: "g" },
                    { name: "Carbohydrates", amount: 3, unit: "g" }
                ]
            }
        }
    };

    const recipe = demoRecipeDetails[recipeId];
    if (recipe) {
        showRecipeModal(recipe);
    } else {
        showError('Recipe details not found.');
    }
}

// ========== MODAL MANAGEMENT ==========

/**
 * Shows the recipe modal with detailed information
 * @param {Object} recipe - The recipe object with detailed information
 */
function showRecipeModal(recipe) {
    document.getElementById('modalTitle').textContent = recipe.title;
    document.getElementById('modalTime').textContent = recipe.readyInMinutes || 'N/A';
    document.getElementById('modalServings').textContent = recipe.servings || 'N/A';
    document.getElementById('modalPrice').textContent = recipe.pricePerServing 
        ? `${recipe.pricePerServing.toFixed(2)}` 
        : 'N/A';
    
    // Clean HTML from summary and display
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = recipe.summary || 'No description available.';
    document.getElementById('recipeSummary').textContent = tempDiv.textContent || tempDiv.innerText;

    // Display ingredients
    const ingredientsHtml = recipe.extendedIngredients.map(ingredient => 
        `<div class="ingredient-item">• ${ingredient.original}</div>`
    ).join('');
    document.getElementById('modalIngredients').innerHTML = ingredientsHtml;

    // Display instructions
    let instructionsHtml = '';
    if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
        const steps = recipe.analyzedInstructions[0].steps;
        instructionsHtml = steps.map(step => 
            `<div class="instruction-step">
                <div class="step-number">${step.number}</div>
                <div class="step-text">${step.step}</div>
            </div>`
        ).join('');
    } else {
        instructionsHtml = '<p>Instructions not available for this recipe.</p>';
    }
    document.getElementById('modalInstructions').innerHTML = instructionsHtml;

    // Display nutrition information
    let nutritionHtml = '';
    if (recipe.nutrition && recipe.nutrition.nutrients) {
        const mainNutrients = recipe.nutrition.nutrients.filter(n => 
            ['Calories', 'Protein', 'Fat', 'Carbohydrates'].includes(n.name)
        );
        
        nutritionHtml = `<div class="nutrition-grid">` + 
            mainNutrients.map(nutrient => 
                `<div class="nutrition-item">
                    <div class="nutrition-value">${nutrient.amount}</div>
                    <div class="nutrition-label">${nutrient.name} ${nutrient.unit}</div>
                </div>`
            ).join('') + `</div>`;
    } else {
        nutritionHtml = '<p>Nutrition information not available.</p>';
    }
    document.getElementById('modalNutrition').innerHTML = nutritionHtml;

    document.getElementById('recipeModal').style.display = 'block';
}

/**
 * Closes the recipe modal
 */
function closeModal() {
    document.getElementById('recipeModal').style.display = 'none';
}

// ========== UTILITY FUNCTIONS ==========

/**
 * Shows or hides the loading spinner
 * @param {boolean} show - Whether to show or hide the loading spinner
 */
function showLoading(show) {
    document.getElementById('loadingSection').style.display = show ? 'block' : 'none';
}

/**
 * Shows an error message
 * @param {string} message - The error message to display
 */
function showError(message) {
    const errorSection = document.getElementById('errorSection');
    errorSection.innerHTML = `<div class="error-message">${message}</div>`;
    errorSection.style.display = 'block';
}

/**
 * Hides any error messages
 */
function hideError() {
    document.getElementById('errorSection').style.display = 'none';
}

// ========== EVENT LISTENERS ==========

/**
 * Initialize event listeners when the page loads
 */
document.addEventListener('DOMContentLoaded', function() {
    // Allow adding ingredients with Enter key
    document.getElementById('ingredientInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addIngredient();
        }
    });

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        const modal = document.getElementById('recipeModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// ========== API INTEGRATION HELPERS ==========

/**
 * Check if the API key is properly configured
 * @returns {boolean} True if API key is configured
 */
function isApiKeyConfigured() {
    return API_KEY && API_KEY !== 'YOUR_SPOONACULAR_API_KEY';
}

/**
 * Handle API rate limiting and errors
 * @param {Response} response - The fetch response object
 * @returns {Promise} The parsed JSON response
 */
async function handleApiResponse(response) {
    if (!response.ok) {
        switch (response.status) {
            case 401:
                throw new Error('Invalid API key. Please check your Spoonacular API key.');
            case 402:
                throw new Error('API quota exceeded. Please upgrade your Spoonacular plan.');
            case 403:
                throw new Error('API access forbidden. Please check your API key permissions.');
            case 429:
                throw new Error('Too many requests. Please wait a moment and try again.');
            default:
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
    }
    return response.json();
}

// ========== INITIALIZATION ==========

/**
 * Initialize the application
 */
function initApp() {
    console.log('Recipe Finder initialized!');
    
    if (!isApiKeyConfigured()) {
        console.warn('⚠️ API key not configured. Using demo mode.');
        console.log('To use real recipes, get your free API key from: https://spoonacular.com/food-api/console#Dashboard');
    } else {
        console.log('✅ API key configured. Ready to fetch real recipes!');
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initApp);