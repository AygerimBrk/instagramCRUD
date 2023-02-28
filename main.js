const API = "http://localhost:8000/Post";

//? переменные для инпутов
// let profilePhoto = document.querySelector("#profile_photo_url");
let nickName = document.querySelector("#nick_name");
let region = document.querySelector("#region");
let imageUrl = document.querySelector("#image_url");
let countLike = document.querySelector("#likes");
let comment = document.querySelector("#comments");
let btnSend = document.querySelector(".btn");
//? для карточки
let postList = document.querySelector(".post_list");
// console.log(
//   profilePhoto,
//   nickName,
//   region,
//   imageUrl,
//   countLike,
//   comment,
//   btnSend,
//   postList
// );

btnSend.addEventListener("click", async function () {
  let post = {
    region: region.value,
    imageUrl: imageUrl.value,
    countLike: countLike.value,
    comment: comment.value,
  };
  //   console.log(obj);

  if (
    !post.region.trim() ||
    !post.imageUrl.trim() ||
    !post.countLike.trim() ||
    !post.comment.trim()
  ) {
    alert("complete");
    return;
  }
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });
  region.value = "";
  imageUrl.value = "";
  countLike.value = "";
  comment.value = "";
  render();
});

async function render() {
  let res = await fetch(`${API}`);
  let products = await res.json();
  // console.log(products);

  //   drawPaginationButtons();
  postList.innerHTML = "";
  products.forEach((item) => {
    let newItem = document.createElement("div");
    newItem.id = item.id;
    newItem.innerHTML = `
   <div class="card m-5" style="width: 18rem;">
   <div>
   <img src="${item.imageUrl}" class="card-img-top" alt="...">
   <div><h5 class="card-title">${nickName}</h5></div>
   <div><p class="card-text">${item.region}</p></div></div>
    <img src="${item.imageUrl}" class="card-img-top" alt="...">
    <div class="card-body">
      <p class="card-text">${item.countLike}</p>
      <p class="card-text">${item.comment}</p>
      <a href="#" id="${item.id} "class="btn btn-danger btn-delete">Delete</a>
      <a href="#" id="${item.id}" class="btn btn-warning btn-edit" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</a>
    </div>
  </div>
   `;
    postList.append(newItem);
  });
}
render();
//? слушатель событие на весь document
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-delete")) {
    console.log("delete clicked");
    let id = e.target.id;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    render();
  }
});
