function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

window.onload = function () {
  // Ce code s'exécute une fois la page entièrement chargée
  console.log("DOM ready!");

  // On prépare la modal Bootstrap une seule fois
  const myModal = new bootstrap.Modal(document.getElementById("myModal"));

  // On intercepte l'envoi du formulaire
  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // empêche le rechargement de la page
    console.log("form submitted!");

    // 1. Lire les valeurs des champs (trim() enlève les espaces au début et à la fin)
    const name = document.querySelector("#name").value.trim();
    const firstname = document.querySelector("#firstname").value.trim();
    const birthday = document.querySelector("#birthday").value;
    const address = document.querySelector("#address").value.trim();
    const email = document.querySelector("#email").value.trim();

    // 2. Vérifier chaque règle et noter les erreurs
    const errors = [];

    if (name.length < 5) {
      errors.push("Le nom doit contenir au moins 5 caractères.");
    }
    if (firstname.length < 5) {
      errors.push("Le prénom doit contenir au moins 5 caractères.");
    }
    if (address.length < 5) {
      errors.push("L'adresse doit contenir au moins 5 caractères.");
    }
    if (!validateEmail(email)) {
      errors.push("L'adresse email n'est pas valide.");
    }

    // Date de naissance : obligatoire et pas dans le futur
    if (birthday === "") {
      errors.push("La date de naissance est obligatoire.");
    } else {
      const birthdayTimestamp = new Date(birthday).getTime();
      const nowTimestamp = Date.now();
      if (birthdayTimestamp > nowTimestamp) {
        errors.push("La date de naissance ne peut pas être dans le futur.");
      }
    }

    // 3. Remplir la modal selon le résultat
    if (errors.length > 0) {
      document.querySelector(".modal-title").textContent = "Erreur dans le formulaire";
      document.querySelector(".modal-body").innerHTML =
        "<ul><li>" + errors.join("</li><li>") + "</li></ul>";
    } else {
      const mapsUrl = "http://maps.google.com/maps?q=" + encodeURIComponent(address);

      document.querySelector(".modal-title").textContent = "Bienvenue " + firstname + " " + name;
      document.querySelector(".modal-body").innerHTML =
        "<p>Vous êtes né(e) le " + birthday + "</p>" +
        '<p>Vous habitez <a href="' + mapsUrl + '" target="_blank">' + address + "</a></p>" +
        "<p>Email : " + email + "</p>";
    }

    // 4. Afficher la modal
    myModal.show();
  });
};