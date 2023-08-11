const gallerySection = document.querySelector(".gallery");
const filtersSection = document.querySelector(".filters");

// Stockage des données
let allWorks = []; // Tableau pour stocker toutes les œuvres
let token = null; // Stocke le token d'authentification

const isTokenPresent = () => {
    return localStorage.getItem("token");
};

const filterWorks = (categoryId) => {
    gallerySection.innerHTML = "";

    if (categoryId === "all") {
        allWorks.forEach((work) => {
            createWorkElement(work, gallerySection);
        });
    } else {
        if (!isTokenPresent()) {
            const filteredWorks = allWorks.filter((work) => work.categoryId === categoryId);
            filteredWorks.forEach((work) => {
                createWorkElement(work, gallerySection);
            });
        }
    }
};

const createWorkElement = (work, container) => {
    const workElement = document.createElement("figure");
    if (container === galleryModal) {
        workElement.innerHTML = `<img src="${work.imageUrl}" /><button class="trash-btn"><i class="fa-solid fa-trash-can"></i></button><button class="edit-btn">éditer</button>`;
    } else {
        workElement.innerHTML = `<img src="${work.imageUrl}" /><figcaption>${work.title}</figcaption>`;
    }
    container.appendChild(workElement);
};

// Récupération des catégories à partir de l'API
fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((data) => {
        // Ajout d'un bouton de filtre "Tous"
        if (!isTokenPresent()) {
            const allFilterButton = document.createElement("button");
            allFilterButton.innerText = "Tous";
            allFilterButton.classList.add("active");
            filtersSection.appendChild(allFilterButton);

            allFilterButton.addEventListener("click", () => {
                const categoryButtons = document.querySelectorAll(".filters .active");
                categoryButtons.forEach((button) => button.classList.remove("active"));
                allFilterButton.classList.add("active");
                filterWorks("all");
            });
        }
        // Ajout des boutons de filtre pour chaque catégorie
        data.forEach((category) => {
            if (!isTokenPresent()) {
                const filterButtons = document.createElement("button");
                filterButtons.innerText = category.name;
                filtersSection.appendChild(filterButtons);
                filterButtons.addEventListener("click", () => {
                    const categoryButtons = document.querySelectorAll(".filters .active");
                    categoryButtons.forEach((button) => button.classList.remove("active"));
                    filterButtons.classList.add("active");
                    filterWorks(category.id);
                });
            }
        });
    });

// Récupération des travaux à partir de l'API
fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
        allWorks = data;
        filterWorks("all");
    });

// Gestion de l'authentification
if (isTokenPresent()) {
    // Mise à jour de l'interface et ajout d'un événement de déconnexion
    const unauthenticatedElements = document.querySelectorAll(".unauthenticated");
    const loginNav = document.querySelector(".login");

    token = localStorage.getItem("token");

    unauthenticatedElements.forEach((element) => {
        element.classList.remove("unauthenticated");
    });

    loginNav.innerText = "logout";
    loginNav.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token", token);
        location.reload();
    });

    // Masque la section de filtrage pour les utilisateurs authentifiés
    filtersSection.style.display = "none";
}
