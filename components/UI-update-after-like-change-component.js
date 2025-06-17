export function updatePostInUI(post) {
  const postEl = document.querySelector(`.post[data-post-id="${post.id}"]`);
  if (!postEl) return;

  const likesCountEl = postEl.querySelector(".post-likes-text strong");
  likesCountEl.textContent = post.likes;

  const likeBtnImg = postEl.querySelector(".like-button img");

  if (post.isLiked) {
    likeBtnImg.src = "./assets/images/like-active.svg";
  } else {
    likeBtnImg.src = "./assets/images/like-not-active.svg";
  }
}
