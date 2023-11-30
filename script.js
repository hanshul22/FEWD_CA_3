// Function to fetch a random meal on page load
window.addEventListener('load', GRM);

function GRM() {
  // Fetch a random meal from the API
  fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Get the random meal and display it
      const randomMeal = data.meals[0];
      DM(randomMeal, 'randomMealItem');
    })
    .catch(error => {
      console.error('Error fetching random meal:', error);
    });
}

// Function to display a meal in the specified target element
function DM(meal, targetId) {
  const mealItem = document.getElementById(targetId);
  mealItem.style.display = 'block';
  const mealImage = mealItem.querySelector('img');
  const mealName = mealItem.querySelector('p');

  // Set the meal image source, alt, and name
  mealImage.src = meal.strMealThumb;
  mealImage.alt = meal.strMeal;
  mealName.textContent = meal.strMeal;

  // Add a click event listener to show ingredients when clicked
  mealItem.addEventListener('click', () => showIngredients(meal.idMeal));
}

// Function to fetch and display ingredients for a given meal ID
function showIngredients(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Extract and display ingredients in a modal
      const ingredients = Object.keys(data.meals[0])
        .filter(key => key.includes('strIngredient') && data.meals[0][key])
        .map(key => data.meals[0][key]);

      const modal = createModal(ingredients);
      const modalContainer = document.getElementById('modalContainer');
      modalContainer.innerHTML = '';
      modalContainer.appendChild(modal);
      modal.style.display = 'flex';
    })
    .catch(error => {
      console.error('Error fetching ingredients:', error);
    });
}

// Function to create a modal with ingredients
function createModal(ingredients) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn" onclick="closeModal()">&times;</span>
      <h2>Ingredients</h2>
      <ul>
        ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
      </ul>
    </div>
  `;
  return modal;
}

// Function to close the modal
function closeModal() {
  const modal = document.querySelector('.modal');
  modal.style.display = 'none';
  const modalContainer = document.getElementById('modalContainer');
  modalContainer.innerHTML = '';
}

// Event listener for the search input to fetch and display meals on 'Enter'
document.getElementById('searchInput').addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    const searchTerm = this.value.trim();
    if (searchTerm !== '') {
      // Fetch meals based on the search term
      fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchTerm}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          // Display searched meals
          displaySearchedMeals(data.meals);
        })
        .catch(error => {
          console.error('Error fetching searched meals:', error);
        });
    }
  }
});

// Function to display searched meals
function displaySearchedMeals(meals) {
  const searchedMealsSection = document.getElementById('searchedMeals');
  searchedMealsSection.innerHTML = '';

  if (meals) {
    // Display searched meals
    searchedMealsSection.style.display = '';
    searchedMealsSection.innerHTML = meals.map(meal => `
      <div class="meal-item" onclick="showIngredients('${meal.idMeal}')">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <p>${meal.strMeal}</p>
      </div>
    `).join('');
  } else {
    // Hide the section if no meals are found
    searchedMealsSection.style.display = 'none';
  }
}
