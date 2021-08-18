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

  const id = document.createElement("span");
  id.innerText = recipe["idMeal"];
  id.className = "hidden";

  const likeCounter = document.createElement("span");

  // Get the current info in db.json and pass it to handleData
  fetch("http://localhost:3000/meals")
    .then((resp) => resp.json())
    .then((data) => handleData(data, id, likeCounter));

  const likeButton = document.createElement("button");
  likeButton.className = "like-btn";
  likeButton.innerText = "Like";
  likeButton.addEventListener("click", (e) => handleLike(e));

  li.append(img, h3, id, likeCounter, likeButton);
  document.querySelector("#card-container").appendChild(li);
}

function handleData(data, id, likeCounter) {
  // Iterate through the data to see if the current item's ID is in there
  // use .find?
  const likedMeal = data.find((element) => element["id"] === id.innerText);

  // Based on the value of likedMeal, set the innerText of likeCounter
  // If it doesn't exist in the DB, set likeCounter.innertText to "0 likes"
  // Else if there's 1 like, set likeCounter.innerText to `${meal["likes"] like`
  // Else, set likeCounter.innerText to `${meal["likes"] likes`
  if (typeof likedMeal === "undefined") {
    likeCounter.innerText = "0 likes";
  } else if (likedMeal["likes"] === 1) {
    likeCounter.innerText = "1 like";
  } else {
    likeCounter.innerText = `${likedMeal["likes"]} likes`;
  }
}

//  FUNCTION: handleLike(e)
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
