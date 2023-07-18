const gallerySection = document.querySelector(".gallery");
const filtersSection = document.querySelector(".filters");
let allWorks = [];
const editorBarElement = document.querySelector(".editor-bar");
const loginNav = document.querySelector(".login");
const openModalElement = document.querySelectorAll(".modal-open");
let token = null;

const isTokenPresent = () => {
    return localStorage.getItem("token");
};

fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((data) => {
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

fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
        allWorks = data;
        filterWorks("all");
    });

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

if (isTokenPresent()) {
    token = localStorage.getItem("token");
    editorBarElement.classList.remove("unauthenticated");
    loginNav.innerText = "logout";

    openModalElement.forEach((element) => element.classList.remove("unauthenticated"));
    modal.classList.remove("unauthenticated");

    loginNav.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token", token);
        location.reload();
    });
    filtersSection.style.display = "none";
}
