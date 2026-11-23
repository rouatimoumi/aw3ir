function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Affiche le nombre de caractères saisis à côté du champ
// (en dehors de window.onload car elle est appelée depuis le HTML avec onkeyup)
function calcNbChar(id) {
  const input = document.querySelector(`#${id}`);
  // on remonte jusqu'à la ligne (.row) du champ, puis on cherche le compteur
  const countElement = input.closest(".row").querySelector("[data-count]");
  countElement.textContent = input.value.length + " car.";
}

// NOUVEAU : affiche la liste des contacts dans le tableau HTML
function displayContactList() {
  // on récupère la liste en texte depuis le localStorage, puis on la transforme en tableau JS
  const contactListString = localStorage.getItem("contactList");
  const contactList = contactListString ? JSON.parse(contactListString) : [];

  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = ""; // on vide le tableau avant de le remplir

  for (const contact of contactList) {
    const mapsUrl = "http://maps.google.com/maps?q=" + encodeURIComponent(contact.adress);

    tbody.innerHTML += `<tr>
      <td>${contact.name}</td>
      <td>${contact.firstname}</td>
      <td>${contact.date}</td>
      <td><a href="${mapsUrl}" target="_blank">${contact.adress}</a></td>
      <td><a href="mailto:${contact.mail}">${contact.mail}</a></td>
    </tr>`;
  }
}

window.onload = function () {
  console.log("DOM ready!");

  displayContactList();

  const myModal = new bootstrap.Modal(document.getElementById("myModal"));

  document.querySelector("#gps").addEventListener("click", function (event) {
    event.preventDefault();
    getLocation(); // fonction définie dans gps.js
  });

  document.querySelector("#reset").addEventListener("click", function (event) {
    event.preventDefault();
    contactStore.reset();
    displayContactList();
  });

  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // empêche le rechargement de la page
    console.log("form submitted!");

    // 1. Lire les valeurs des champs
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

    if (birthday === "") {
      errors.push("La date de naissance est obligatoire.");
    } else {
      const birthdayTimestamp = new Date(birthday).getTime();
      const nowTimestamp = Date.now();
      if (birthdayTimestamp > nowTimestamp) {
        errors.push("La date de naissance ne peut pas être dans le futur.");
      }
    }

    if (errors.length > 0) {
      document.querySelector(".modal-title").textContent = "Erreur dans le formulaire";
      document.querySelector(".modal-body").innerHTML =
        "<ul><li>" + errors.join("</li><li>") + "</li></ul>";
    } else {
      // tout est correct -> on enregistre le contact (store.js)
      contactStore.add(name, firstname, birthday, address, email);

      displayContactList();

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