fetch("http://localhost:5678/api/works")
.then( data => data.json())
.then( jsonlistFigure => {
    for(let i = 0; i < jsonlistFigure.length; i++) {


        const figure = jsonlistFigure[i];

        // Récupération de l'élément du DOM qui accueillera les fiches
        const sectionGallery = document.querySelector(".gallery")

        // Création d'une balise dédiée aux travaux de l'architecte
        const workElement = document.createElement("figure"); 

        // Création des balises
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        const titleElement = document.createElement("figcaption");
        titleElement.src = figure.title;
        
        // On rattache la balise figure à la section Gallery
        sectionGallery.appendChild(workElement);
        // On rattacge l'image à workElement (la balise figure)
        workElement.appendChild(imageElement);
        workElement.appendChild(titleElement);

    }
}) ;