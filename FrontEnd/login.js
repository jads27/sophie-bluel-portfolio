const loginForm = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

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
            const token = data.token;
            localStorage.setItem("token", token);

            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Error:", error.message);
            alert("Erreur de connexion. Veuillez vérifier vos identifiants.");
        });
});
