import { renderHeaderComponent } from "./header-component.js";
import { sanitizeInput } from "./sanitize-input.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    // @TODO: Реализовать страницу добавления поста

    let imageUrl = "";

    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container"></div>
        <label>
          Опишите фотографию:
          <textarea class="input textarea" rows="4"></textarea>
        </label>
        <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    const uploadImageContainer = appEl.querySelector(".upload-image-container");

    renderUploadImageComponent({
      element: uploadImageContainer,
      onImageUrlChange: (newImageUrl) => {
        imageUrl = newImageUrl;
      },
    });

    document.getElementById("add-button").addEventListener("click", () => {
      const description = sanitizeInput(appEl.querySelector(".textarea").value);

      if (imageUrl) {
        onAddPostClick({
          description: description,
          imageUrl: imageUrl,
        });
      } else {
        alert("Пожалуйста, загрузите изображение.");
      }
    });
  };

  render();

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });
}
