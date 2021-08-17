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
  document.querySelector("#card-container").innerHTML = "";

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
  img.alt = `Image of prepared ${recipe["strMeal"]}`;

  const h3 = document.createElement("h3");
  h3.innerText = recipe["strMeal"];
  if (h3.innerText.length > 48) {
    h3.className = "overflowText";
  }

  const likeCounter = document.createElement("span");
  likeCounter.innerText = "0 likes";

  const likeButton = document.createElement("button");
  likeButton.className = "like-btn";
  likeButton.innerText = "Like";
  likeButton.addEventListener("click", (e) => handleLike(e));

  li.append(img, h3, likeCounter, likeButton);
  document.querySelector("#card-container").appendChild(li);
}

//  FUNCTION: handleLike(e)
function handleLike(e) {
  console.log(e);
  // Figure out which recipe was liked
  //
  // if (e.target.innerText === "♡") {
  //   e.target.innerText = "♥";
  // } else {
  //   e.target.innerText = "♡";
  // }
}
