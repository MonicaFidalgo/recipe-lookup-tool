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
      recipeData["meals"].forEach(renderOneRecipe);
    });
}

async function getFavorites() {
  console.log("inside ger");
  let likesData = [];

  await fetchFavorites().then((data) => {
    likesData.push(...data);

    displayFavorites(likesData);
  });
}

async function fetchFavorites() {
  const url = "http://localhost:3000/meals/";

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

  const id = document.createElement("span");
  id.innerText = recipe["idMeal"];
  id.className = "hidden";

  fetch("http://localhost:3000/meals")
    .then((resp) => resp.json())
    .then((meals) => setLikeCounter(meals, likeButton));

  const likeButton = document.createElement("button");
  likeButton.className = "like-btn";
  likeButton.innerText = "Like";
  likeButton.setAttribute("id", recipe["idMeal"]);
  likeButton.addEventListener("click", handleLike);

  li.append(img, h3, likeButton);
  document.querySelector("#card-container").appendChild(li);
}

function setLikeCounter(meals, likeButton) {
  console.log(likeButton);

  const likedItem = meals.find((element) => element["id"] == likeButton.id);
  console.log(meals, likedItem);

  if (typeof likedItem === "undefined") {
    likeButton.innerText = "0 likes";
  } else if (likedItem["id"] >= 1) {
    console.log(likedItem);
    likeButton?.classList.add("is-favorite");
  }
}

function handleLike(e) {
  const id = e.target.id;

  const check = e.target.classList.contains("is-favorite") ? true : false;

  if (!check) {
    const newMeal = {
      id: id,
      favorite: "isFavorite",
    };

    fetch("http://localhost:3000/meals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMeal),
    })
      .then(() => e.target.classList.add("is-favorite"))
      .then(() => getFavorites());
  } else {
    fetch(`http://localhost:3000/meals/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => e.target.classList.remove("is-favorite"))
      .then(() => getFavorites());
  }
}
