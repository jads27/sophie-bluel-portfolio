const galleryModal = document.querySelector(".modal-gallery");
let modal = null;
const focusableSelector = "button, input";
let focusablesElements = [];
let previouslyFocusedElement = null;

const openModal = () => {
    modal = document.querySelector(".modal");

    allWorks.forEach((work) => {
        createWorkElement(work, galleryModal);
    });

    focusablesElements = Array.from(modal.querySelectorAll(focusableSelector));
    modal.style.display = "flex";
    previouslyFocusedElement = document.querySelector(":focus");
    focusablesElements[0].focus();
    modal.removeAttribute("aria-hidden", "false");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModal);
    modal.querySelector(".modal-close").addEventListener("click", closeModal);
    modal.querySelector(".modal-stop").addEventListener("click", stopPropagation);
};

const closeModal = () => {
    if (modal === null) return;
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".modal-close").removeEventListener("click", closeModal);
    modal.querySelector(".modal-stop").removeEventListener("click", stopPropagation);
    modal = null;
    galleryModal.innerHTML = "";
};

const stopPropagation = (e) => {
    e.stopPropagation();
};
const focusInModal = (e) => {
    e.preventDefault();
    let index = focusablesElements.findIndex((f) => f === modal.querySelector(":focus"));
    if (e.shiftKey === true) {
        index--;
    } else {
        index++;
    }
    if (index >= focusablesElements.length) {
        index = 0;
    }
    if (index < 0) {
        index = focusablesElements.length - 1;
    }
    focusablesElements[index].focus();
};

document.querySelectorAll(".modal-open").forEach((button) => {
    button.addEventListener("click", openModal);
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e);
    }
});
