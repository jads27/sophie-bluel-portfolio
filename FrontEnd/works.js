const gallerySection = document.querySelector(".gallery");
const filtersSection = document.querySelector(".filters");
let allWorks = [];

fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((data) => {
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

        data.forEach((category) => {
            const filterButtons = document.createElement("button");
            filterButtons.innerText = category.name;
            filtersSection.appendChild(filterButtons);

            filterButtons.addEventListener("click", () => {
                const categoryButtons = document.querySelectorAll(".filters .active");
                categoryButtons.forEach((button) => button.classList.remove("active"));
                filterButtons.classList.add("active");
                filterWorks(category.id);
            });
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
        const filteredWorks = allWorks.filter((work) => work.categoryId === categoryId);
        filteredWorks.forEach((work) => {
            createWorkElement(work, gallerySection);
        });
    }
};

const createWorkElement = (work, container) => {
    const workElement = document.createElement("figure");
    if (container === galleryModal) {
        workElement.innerHTML = `<img src="${work.imageUrl}" /><button>éditer</button>`;
    } else {
        workElement.innerHTML = `<img src="${work.imageUrl}" /><figcaption>${work.title}</figcaption>`;
    }
    container.appendChild(workElement);
};
