const galleryModal = document.querySelector(".modal-gallery");
const modal1 = document.querySelector("aside div:nth-child(1)");
const modal2 = document.querySelector("aside div:nth-child(2)");
const submitInput = document.getElementById("submit");
const fileInput = document.getElementById("file");
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("category");
const fileWrapper = document.querySelector(".file-wrapper");
const imgWrapper = document.querySelector(".img-wrapper");

let modal = null; // Initialisation de la variable pour la modal active

const focusableSelector = "button, input";
let focusablesElements = [];
let previouslyFocusedElement = null;

const openModal = () => {
    modal = document.querySelector(".modal");

    allWorks.forEach((work) => {
        createWorkElement(work, galleryModal);
    });

    focusablesElements = Array.from(modal.querySelectorAll(focusableSelector)); // Sélection des éléments focusables

    modal.style.display = "flex";
    modal1.style.display = "flex";
    modal2.style.display = "none";

    // Gestion de l'accessibilité
    previouslyFocusedElement = document.querySelector(":focus");
    modal.removeAttribute("aria-hidden", "false");
    modal.setAttribute("aria-modal", "true");

    // Ajout des écouteurs d'événements
    modal.addEventListener("click", closeModal);
    modal.querySelectorAll(".modal-close").forEach((element) => element.addEventListener("click", closeModal));
    modal.querySelectorAll(".modal-stop").forEach((element) => element.addEventListener("click", stopPropagation));

    // Changement entre modal1 et modal2
    modal.querySelector(".modal-2-open").addEventListener("click", () => {
        modal1.style.display = "none";
        modal2.style.display = "flex";
        // Mise en place de l'accessibilité pour modal2
        modal.setAttribute("aria-labelledby", "modal-2");
        modal.querySelectorAll(".modal-wrapper").forEach((element) => element.classList.add("no-animation"));
        focusablesElements = Array.from(modal2.querySelectorAll(focusableSelector));
        focusablesElements[0].focus();
    });

    // Retour à modal1 depuis modal2
    modal.querySelector(".modal-1-back").addEventListener("click", () => {
        modal2.style.display = "none";
        modal1.style.display = "flex";
        // Mise en place de l'accessibilité pour modal1
        modal.setAttribute("aria-labelledby", "modal-1");
        modal.querySelectorAll(".modal-wrapper").forEach((element) => element.classList.add("no-animation"));
        focusablesElements = Array.from(modal1.querySelectorAll(focusableSelector));
        modal.querySelector(".modal-2-open").focus();
        resetFileSubmit();
    });
    focusablesElements[0].focus();
};

const closeModal = () => {
    if (modal === null) return;

    // Restauration du focus précédent
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();

    // Gestion de l'accessibilité
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");

    // Retrait des écouteurs d'événements
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".modal-close").removeEventListener("click", closeModal);
    modal.querySelector(".modal-stop").removeEventListener("click", stopPropagation);
    modal.querySelectorAll(".modal-wrapper").forEach((element) => element.classList.remove("no-animation"));

    // Animation de sortie et nettoyage
    const hideModal = () => {
        modal.style.display = "none";
        modal1.style.display = "none";
        modal2.style.display = "none";
        modal.removeEventListener("animationend", hideModal);
        galleryModal.innerHTML = "";
        resetFileSubmit();
    };
    modal.addEventListener("animationend", hideModal);
};

// Arrêt de la propagation des événements
const stopPropagation = (e) => {
    e.stopPropagation();
};

// Gestion du focus au sein de la modal
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

    // Affichage de l'aperçu de l'image
    if (isFileValid) {
        const imgPreview = `<img src="${URL.createObjectURL(file)}" alt="Image preview" />`;
        imgWrapper.style.display = "flex";
        fileWrapper.style.display = "none";
        imgWrapper.innerHTML = imgPreview;
    }

    if (isFormValid) {
        submitInput.disabled = false;
    } else {
        submitInput.disabled = true;
    }
};

const resetFileSubmit = () => {
    if (modal2.style.display !== "flex") {
        imgWrapper.style.display = "none";
        fileWrapper.style.display = "block";
        titleInput.value = "";
        categorySelect.selectedIndex = 0;
        submitInput.disabled = true;
    }
};

// Ouverture de la modal depuis le bouton "edit-gallery"
document.querySelector(".edit-gallery").addEventListener("click", openModal);

// Gestion pour la touche "Escape" et la navigation dans la modal
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e);
    }
});

// Suppression d'une œuvre
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

// Ajout d'une œuvre
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

// Vérification de la validité du formulaire lors des modifications
fileInput.addEventListener("change", checkFormValidity);
titleInput.addEventListener("input", checkFormValidity);
categorySelect.addEventListener("change", checkFormValidity);

// Initialisation de la validité du formulaire lors du chargement de la page
checkFormValidity();
