import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken } from "../index.js";
import { toggleLike } from "../api.js";

import { formatDistanceToNow } from "https://cdn.jsdelivr.net/npm/date-fns@2.29.3/esm/index.js";
import { ru } from "https://cdn.jsdelivr.net/npm/date-fns@2.29.3/esm/locale/index.js";

export function userRenderPostsPageComponent({ appEl }) {
  console.log("Актуальный список постов:", posts);

  const userPostsHtml = posts
    .map((post) => {
      const likeImage = post.isLiked
        ? "./assets/images/like-active.svg"
        : "./assets/images/like-not-active.svg";

      const lastLikerName =
        post.likes.length > 0 ? post.likes[post.likes.length - 1].name : "";
      const likeTextEl =
        post.likes.length > 1
          ? `${lastLikerName} и еще ${post.likes.length - 1}`
          : `${lastLikerName}`;

      const date = new Date(post.createdAt);
      const formattedDate = formatDistanceToNow(date, {
        addSuffix: true,
        locale: ru,
      });

      const newPost = `
      <li class="post">
        <div class="post-header" data-user-id="${post.user.id}">
          <img src="${post.user.imageUrl}" class="post-header__user-image">
          <p class="post-header__user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
        <div class="post-likes">
          <button data-post-id="${post.id}" class="like-button">
            <img src="${likeImage}">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${likeTextEl}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
            ${post.description}
        </p>
        <p class="post-date">
          ${formattedDate}
        </p>
      </li>
      `;
      return newPost;
    })
    .join("");

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${userPostsHtml}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  document.querySelectorAll(".like-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const postId = btn.dataset.postId;
      const imgEl = btn.querySelector("img");
      const isLiked = imgEl.src.includes("like-active.svg");
      const token = getToken();

      toggleLike({ postId, isLiked, token })
        .then((updatedPost) => {
          // Обновить локальный массив posts
          const postIndex = posts.findIndex((p) => p.id === postId);
          if (postIndex !== -1) {
            posts[postIndex] = updatedPost;
          }

          // Обновить UI кнопки лайка и текста
          const newLikeImage = updatedPost.isLiked
            ? "./assets/images/like-active.svg"
            : "./assets/images/like-not-active.svg";
          imgEl.src = newLikeImage;

          // Обновить текст лайков
          const postLikesTextEl = btn.nextElementSibling; // <p class="post-likes-text">
          if (postLikesTextEl) {
            const likes = updatedPost.likes;
            const lastLikerName =
              likes.length > 0 ? likes[likes.length - 1].name : "";
            const likeTextEl =
              likes.length > 1
                ? `${lastLikerName} и еще ${likes.length - 1}`
                : `${lastLikerName}`;
            postLikesTextEl.innerHTML = `Нравится: <strong>${likeTextEl}</strong>`;
          }
        })
        .catch((error) => {
          alert(error.message || "Ошибка при обновлении лайка");
        });
    });
  });
}
