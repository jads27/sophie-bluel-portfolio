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
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".modal-close").removeEventListener("click", closeModal);
    modal.querySelector(".modal-stop").removeEventListener("click", stopPropagation);
    const hideModal = () => {
        modal.style.display = "none";
        modal.removeEventListener("animationend", hideModal);
        modal = null;
        galleryModal.innerHTML = "";
    };
    modal.addEventListener("animationend", hideModal);
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

galleryModal.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-trash-can")) {
        const figure = e.target.closest("figure");
        const figureIndex = Array.from(figure.parentElement.children).indexOf(figure);
        const workId = allWorks[figureIndex].id;
        fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (response.ok) {
                    const updatedWorks = allWorks.filter((work) => work.id !== workId);
                    allWorks = updatedWorks;
                    galleryModal.innerHTML = "";
                    gallerySection.innerHTML = "";
                    updatedWorks.forEach((work) => {
                        createWorkElement(work, galleryModal);
                        createWorkElement(work, gallerySection);
                    });
                } else {
                    throw new Error("Error occurred while deleting the element");
                }
            })
            .catch((error) => {
                console.error("Error:", error.message);
                alert("Erreur lors de la suppression de l'élément");
            });
    }
});
