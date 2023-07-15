let modal = null;

const openModal = () => {
    const target = document.querySelector(".modal");
    target.style.display = "flex";
    target.removeAttribute("aria-hidden", "false");
    target.setAttribute("aria-modal", "true");
    modal = target;
    modal.addEventListener("click", closeModal);
    modal.querySelector(".modal-close").addEventListener("click", closeModal);
    modal.querySelector(".modal-stop").addEventListener("click", stopPropagation);
};

const closeModal = () => {
    if (modal === null) return;
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".modal-close").removeEventListener("click", closeModal);
    modal.querySelector(".modal-stop").removeEventListener("click", stopPropagation);
    modal = null;
};

const stopPropagation = (e) => {
    e.stopPropagation();
};

document.querySelectorAll(".modal-open").forEach((button) => {
    button.addEventListener("click", openModal);
});
