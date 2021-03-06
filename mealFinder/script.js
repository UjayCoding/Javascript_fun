const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal');
  const API_URL = "https://www.themealdb.com/api/json/v1/1/categories.php";

  // Get initial movies
getAPIs(API_URL)

async function getAPIs(url) {
    const res = await fetch(url)
    const data = await res.json()
    // console.log(data.categories)
    displayAPIs(data.categories)
}

function displayAPIs(items) {
    mealsEl.innerHTML = ''

    items.forEach((item) => {
        const { strCategoryThumb, strCategory, strCategoryDescription } = item

        const apiEl = document.createElement('div')
        // movieEl.classList.add('movie')

        apiEl.innerHTML = `
          <div class = "meal">
            <h1>${strCategory}</h1>
           <img src="${strCategoryThumb}" alt="${strCategory}" />
           <div class = "hide">
           <p>${strCategoryDescription}</p>
                
           </div>
              
           </div>
          `;
        
        mealsEl.appendChild(apiEl)
    })
}
  

// Search meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  // Clear single meal
  single_mealEl.innerHTML = '';

  // Get search term
  const term = search.value;

  // Check for empty
  if (term.trim()) {
    
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${term}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>This is not a meal category. Try again!<p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              meal => `
            <div class="meal2">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>

            </div>
          `
            )
            .join('');
        }
      });
    // Clear search text
    search.value = '';
  } else {
    alert('Please enter a search term');
  }
}

// Fetch meal by ID
// function getMealById(mealID) {
//   fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
//     .then(res => res.json())
//     .then(data => {
//       const meal = data.meals[0];

//       addMealToDOM(meal);
//     });
// }

// Fetch random meal from API
function getRandomMeal() {
  // Clear meals and heading
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

// Event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

