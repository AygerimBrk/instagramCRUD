const API = "http://localhost:8000/Post";

//? переменные для профиля
let nickName = document.querySelector(".nickName");
let imgProf = document.querySelector(".imgProf");
let addPost = document.querySelector(".add_post");
let modal = document.querySelector(".field");
//? переменные для инпутов
let region = document.querySelector("#region");
let imageUrl = document.querySelector("#image_url");
let countLike = document.querySelector("#likes");
let comment = document.querySelector("#comments");
let btnSend = document.querySelector(".btn_send");
//? для карточки
let postList = document.querySelector(".post_list");
// ?pagination
let paginationList = document.querySelector(".pagination-list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");
let currentPage = 1;
let pageTotalCount = 1;
// ? search
let searchInp = document.querySelector("#search");
let searchVal = "";

btnSend.addEventListener("click", async function () {
  let post = {
    region: region.value,
    imageUrl: imageUrl.value,
    countLike: countLike.value,
    comment: comment.value,
  };
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
    body: JSON.stringify(post),
  });
  region.value = "";
  imageUrl.value = "";
  countLike.value = "";
  comment.value = "";
  render();
});

async function render() {
  let res = await fetch(`${API}?q=${searchVal}&_page=${currentPage}&_limit=2`);
  let twit = await res.json();
  pagination();
  postList.innerHTML = "";
  twit.forEach((item) => {
    let newItem = document.createElement("div");
    newItem.id = item.id;
    newItem.innerHTML = `
   <div class="card m-5" style="width: 18rem;">
   <div class="d-flex flex-direction-row">
   <img src="${imgProf.src}" class="card-img" alt="...">
   <div class="textPost">
   <h5 class="card-title mb-0">${nickName.innerText}</h5>
  <p class="card-text">${item.region}</p>
  </div>
   </div>
    <img src="${item.imageUrl}" class="card-img-top" alt="...">
    <div class="card-body">
      <p class="card-text">${item.countLike} отметок "Нравится"</p>
      <p class="card-text text-secondary">Посмотреть все комментарии ${item.comment}</p>
      <button onclick ="deletePost(${item.id})" class="btn btn-danger btn-delete">Delete</button>
      <button onclick ="editPost(${item.id})" class="btn btn-warning btn-edit">Edit</button>
    </div>
  </div>
   `;

    postList.append(newItem);
  });
}
render();

async function deletePost(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  render();
}
function editPost() {
  // let id = this.id;
  // console.log(id);
  let city = region.value;
  let img = imageUrl.value;
  let comm = comment.value;
  let count = countLike.value;
  console.log(city, img, comm, count);

  if (!city || !img || !comm || !count) {
    alert("заполните все поля");
    return;
  }

  let editedPost = {
    city: regionEdit.value,
    img: imageUrlEdit.value,
    count: LikesEdit.value,
    comm: commentsEdit.value,
  };
  saveEdit(editedPost, id);
  // console.log(editedPost);
}

function saveEdit(editedPost, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(editedPost),
  }).then(() => render());
  //? закрываем модальное окно
  let modal = bootstrap.Modal.getInstance(modalEdit);
  modal.hide();
}
function pagination() {
  fetch(`${API}?q=${searchVal}`)
    .then((res) => res.json())
    .then((data) => {
      pageTotalCount = Math.ceil(data.length / 2);
      paginationList.innerHTML = "";
      for (let i = 1; i <= pageTotalCount; i++) {
        if (currentPage == i) {
          let page1 = document.createElement("li");
          page1.innerHTML = `<li class="page-item active"><a class="page-link page_number" href="#">${i}</a></li>`;
          paginationList.append(page1);
        } else {
          let page1 = document.createElement("li");
          page1.innerHTML = `<li class="page-item"><a class="page-link page_number" href="#">${i}</a></li>`;
          paginationList.append(page1);
        }
      }
      if (currentPage == 1) {
        prev.classList.add("disabled");
      } else {
        prev.classList.remove("disabled");
      }

      if (currentPage == pageTotalCount) {
        next.classList.add("disabled");
      } else {
        next.classList.remove("disabled");
      }
    });
}

prev.addEventListener("click", () => {
  if (currentPage <= 1) {
    return;
  }
  currentPage--;
  render();
});

next.addEventListener("click", () => {
  if (currentPage >= pageTotalCount) {
    return;
  }
  currentPage++;
  render();
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("page_number")) {
    currentPage = e.target.innerText;
    render();
  }
});

let regionEdit = document.querySelector("#regionEdit");
let imageUrlEdit = document.querySelector("#image_url_edit");
let LikesEdit = document.querySelector("#likesEdit");
let commentsEdit = document.querySelector("#commentsEdit");
let modalEdit = document.querySelector("#exampleModalforEdit");

searchInp.addEventListener("input", () => {
  searchVal = searchInp.value;
  render();
});
