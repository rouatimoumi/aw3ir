window.onload = () => {
  // On attend que la page soit chargée, sinon les éléments n'existent pas encore

  // 1. Récupérer la partie de l'URL après le "?"
  const paramsString = document.location.search;
  // ex : "?name=John&firstname=Doe&birthday=2000-01-01&address=Valencia&email=john%40doe.com"

  // 2. Transformer cette chaîne en liste de paires [nom, valeur]
  const searchParams = new URLSearchParams(paramsString);

  // 3. Parcourir chaque paire
  for (const param of searchParams) {
    console.log(param); // ex : ["name", "John"]

    const elementId = param[0];    // nom du champ (= id dans action.html)
    const elementValue = param[1]; // valeur saisie
    const element = document.getElementById(elementId);

    if (element !== null) {
      // Afficher la valeur dans la page
      element.textContent = elementValue;

      // Adresse : lien vers Google Maps
      if (elementId === "address") {
        element.href = `https://www.google.com/maps/search/?api=1&query=${elementValue}`;
      }
      // Email : lien de courriel
      else if (elementId === "email") {
        element.href = `mailto:${elementValue}?subject=Hello!&body=What's up?`;
      }
    }
  }
};