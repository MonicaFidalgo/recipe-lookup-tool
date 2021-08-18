document.addEventListener("DOMContentLoaded", initialize);

function initialize(e) {
  document
    .querySelector("#categories")
    .addEventListener("change", handleDropdown);
}

function handleDropdown(e) {
  document.querySelector("#card-container").innerHTML = "";

  const category = e.target.value;

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    .then((resp) => resp.json())
    .then((recipeData) => {
      recipeData["meals"].forEach(renderOneRecipe);
    });
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

  const likeCounter = document.createElement("span");

  fetch("http://localhost:3000/meals")
    .then((resp) => resp.json())
    .then((currentLikeData) =>
      setLikeCounter(currentLikeData, id, likeCounter)
    );

  const likeButton = document.createElement("button");
  likeButton.className = "like-btn";
  likeButton.innerText = "Like";
  likeButton.addEventListener("click", (e) => handleLike(e));

  li.append(img, h3, id);
  document.querySelector("#card-container").appendChild(li);
}

function setLikeCounter(currentLikeData, id, likeCounter) {
  const likedMeal = currentLikeData.find(
    (element) => element["id"] === id.innerText
  );

  if (typeof likedMeal === "undefined") {
    likeCounter.innerText = "0 likes";
  } else if (likedMeal["likes"] === 1) {
    likeCounter.innerText = "1 like";
  } else {
    likeCounter.innerText = `${likedMeal["likes"]} likes`;
  }
}

function handleLike(e) {
  let currentLikes = parseInt(e.target.previousElementSibling.innerText);
  const id = e.target.previousElementSibling.previousElementSibling.innerText;

  if (currentLikes === 0) {
    const newMeal = {
      id: id,
      likes: 1,
    };

    fetch("http://localhost:3000/meals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMeal),
    })
      .then((resp) => resp.json())
      .then(
        () =>
          (e.target.previousElementSibling.innerText = `${
            currentLikes + 1
          } like`)
      );
  } else {
    fetch(`http://localhost:3000/meals/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likes: currentLikes + 1,
      }),
    })
      .then((resp) => resp.json())
      .then(
        () =>
          (e.target.previousElementSibling.innerText = `${
            currentLikes + 1
          } likes`)
      );
  }
}
