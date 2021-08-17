// DOMContentLoaded event listener, call initialize
document.addEventListener("DOMContentLoaded", initialize);

//FUNCTION: Initialize
function initialize(e) {
  // Add an event listener to the dropdown
  //      "change", (e) => handleDropdown(e)
  document
    .querySelector("#categories")
    .addEventListener("change", (e) => handleDropdown(e));
}

// FUNCTION: handleDropdown(e)
function handleDropdown(e) {
  // Get the value of the dropdown selection
  // Make a fetch request to get items from the desired category
  // .then(recipeData) => recipeData["meals"].forEach(renderOneRecipe))
  const category = e.target.value;

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    .then((resp) => resp.json())
    .then((recipeData) => recipeData["meals"].forEach(renderOneRecipe));
}

// FUNCTION: renderOneRecipe(recipe)
function renderOneRecipe(recipe) {
  const li = document.createElement("li");
  li.className = "card";

  const img = document.createElement("img");
  img.className = "thumbnail";
  img.src = recipe["strMealThumb"];

  const h3 = document.createElement("h3");
  h3.innerText = recipe["strMeal"];

  const likeButton = document.createElement("button");
  likeButton.className = "like-btn";
  likeButton.innerText = "♡";

  li.append(img, h3, likeButton);
  document.querySelector("#card-container").appendChild(li);
}

// Access strMeal and strMealThumb
// Render the meal name and thumbnail image
// Add a like button
// Add an event listener to the like button ("click", (e) => handleLike(e))

//  FUNCTION: handleLike(e)
// function handleLike(e) {
//   // Access DOM element (e.target)
//   // Change class and innerText to appear "liked"
