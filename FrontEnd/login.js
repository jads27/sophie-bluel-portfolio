const loginForm = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Soumission du formulaire
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    const credentials = {
        email,
        password,
    };

    if (!email || !password) {
        alert("Veuillez remplir tous les champs");
        return;
    }

    // Envoi de la demande de connexion au serveur
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Incorrect credentials");
            }
        })
        .then((data) => {
            const token = data.token; // Récupèration du jeton d'authentification depuis la réponse
            localStorage.setItem("token", token); // Stockage du jeton dans le localStorage du navigateur

            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Error:", error.message);
            alert("Erreur de connexion. Veuillez vérifier vos identifiants.");
        });
});
