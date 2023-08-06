const galleryModal = document.querySelector(".modal-gallery");
let modal = null;
const focusableSelector = "button, input";
let focusablesElements = [];
let previouslyFocusedElement = null;
const modal1 = document.querySelector("aside div:nth-child(1)");
const modal2 = document.querySelector("aside div:nth-child(2)");
const submitInput = document.getElementById("submit");
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("category");
const fileInput = document.getElementById("file");

const openModal = () => {
    modal = document.querySelector(".modal");

    allWorks.forEach((work) => {
        createWorkElement(work, galleryModal);
    });

    focusablesElements = Array.from(modal.querySelectorAll(focusableSelector));
    modal.style.display = "flex";
    modal1.style.display = "flex";
    modal2.style.display = "none";
    previouslyFocusedElement = document.querySelector(":focus");
    modal.removeAttribute("aria-hidden", "false");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModal);
    modal.querySelectorAll(".modal-close").forEach((element) => element.addEventListener("click", closeModal));
    modal.querySelectorAll(".modal-stop").forEach((element) => element.addEventListener("click", stopPropagation));
    modal.querySelector(".modal2-open").addEventListener("click", () => {
        modal1.style.display = "none";
        modal2.style.display = "flex";
        modal.setAttribute("aria-labelledby", "modal2");
        modal.querySelectorAll(".modal-wrapper").forEach((element) => element.classList.add("no-animation"));
        focusablesElements = Array.from(modal2.querySelectorAll(focusableSelector));
        focusablesElements[0].focus();
    });
    modal.querySelector(".modal1-back").addEventListener("click", () => {
        modal2.style.display = "none";
        modal1.style.display = "flex";
        modal.setAttribute("aria-labelledby", "modal1");
        modal.querySelectorAll(".modal-wrapper").forEach((element) => element.classList.add("no-animation"));
        focusablesElements = Array.from(modal1.querySelectorAll(focusableSelector));
        modal.querySelector(".modal2-open").focus();
    });
    focusablesElements[0].focus();
};

const closeModal = () => {
    if (modal === null) return;
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".modal-close").removeEventListener("click", closeModal);
    modal.querySelector(".modal-stop").removeEventListener("click", stopPropagation);
    modal.querySelectorAll(".modal-wrapper").forEach((element) => element.classList.remove("no-animation"));
    const hideModal = () => {
        modal.style.display = "none";
        modal1.style.display = "none";
        modal2.style.display = "none";
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

const checkFormValidity = () => {
    const file = fileInput.files[0];
    const title = titleInput.value;
    const category = categorySelect.value;

    const isFileValid = file && file.size <= 4 * 1024 * 1024;
    const isTitleValid = title !== "";
    const isCategoryValid = category !== "";

    const isFormValid = isTitleValid && isCategoryValid && isFileValid;

    if (isFormValid) {
        submitInput.disabled = false;
    } else {
        submitInput.disabled = true;
    }
};

document.querySelector(".edit-gallery").addEventListener("click", openModal);

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

submitInput.addEventListener("click", () => {
    const file = fileInput.files[0];
    const title = titleInput.value;
    const category = parseInt(categorySelect.value);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", category);

    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error occured when adding the element");
            }
        })
        .then((data) => {
            allWorks.push(data);
            createWorkElement(data, galleryModal);
            createWorkElement(data, gallerySection);
        })
        .catch((error) => {
            console.error("Error:", error.message);
            alert("Erreur lors de l'ajout de l'élément");
        });
});

fileInput.addEventListener("change", checkFormValidity);
titleInput.addEventListener("input", checkFormValidity);
categorySelect.addEventListener("change", checkFormValidity);

checkFormValidity();
