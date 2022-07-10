document.addEventListener("DOMContentLoaded", initialize);

function initialize(e) {
  handleDropdown();
  document
    .querySelector("#categories")
    .addEventListener("change", handleDropdown);
  getFavorites();
}

function handleDropdown(e) {
  document.querySelector("#card-container").innerHTML = "";

  const category = e !== undefined ? e.target.value : "Breakfast";

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    .then((resp) => resp.json())
    .then((recipeData) => {
      renderRecipes(recipeData);
    });
}

async function getFavorites() {
  let likesData = [];

  await fetchFavorites().then((data) => {
    likesData.push(...data);

    displayFavorites(likesData);
  });
}

async function fetchFavorites() {
  const url = "http://localhost:3000/favorites/";

  const response = await fetch(url);
  const data = await response.json();

  return data;
}

function displayFavorites(data) {
  const likes = document.querySelector("#likes");
  const likesData = data;
  const markup = likesData
    .map((meal) => {
      return `<h1>${meal.id}</h1>`;
    })
    .join("");

  let likesContent = (likes.innerHTML = markup);

  return likesContent;
}

function renderRecipes(recipeData) {
  const content = document.querySelector("#card-container");

  recipeData.meals.map((recipe) => {
    return (content.innerHTML += `<li class="card">
      <img class="thumbnail" src=${recipe.strMealThumb} alt="Image of prepared Breakfast Potatoes">
     <h3>${recipe.strMeal}</h3>
      <button class="like-btn" id=${recipe.idMeal}>Like</button>
    </li>`);
  });

  const btns = document.querySelectorAll(".like-btn");

  btns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      handleLike(event);
    });
  });

  fetch("http://localhost:3000/favorites")
    .then((resp) => resp.json())
    .then((meals) =>
      btns.forEach((btn) => {
        setLike(meals, btn);
      })
    );
}

function setLike(meals, likeButton) {
  const likedItem = meals.find((element) => element.id == likeButton.id);

  if (likedItem?.id >= 1) {
    likeButton?.classList.add("is-favorite");
  }
  return;
}

function handleLike(e) {
  const id = e.target.id;

  const check = e.target.classList.contains("is-favorite") ? true : false;

  if (!check) {
    const newMeal = {
      id: id,
      favorite: "isFavorite",
    };

    fetch("http://localhost:3000/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMeal),
    })
      .then(() => e.target.classList.add("is-favorite"))
      .then(() => getFavorites());
  } else {
    fetch(`http://localhost:3000/favorites/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => e.target.classList.remove("is-favorite"))
      .then(() => getFavorites());
  }
}
