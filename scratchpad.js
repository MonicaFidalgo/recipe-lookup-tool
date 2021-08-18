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

  li.append(img, h3, id);
  document.querySelector("#card-container").appendChild(li);
}

likeButton.addEventListener("click", (e) => handleLike(e));
