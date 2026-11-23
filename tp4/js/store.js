var contactStore = (function () {
  // variable privée : la liste est lue depuis le localStorage au démarrage
  let contactListString = localStorage.getItem("contactList");
  let contactList = contactListString ? JSON.parse(contactListString) : [];

  // on expose seulement ces 3 fonctions, la liste reste cachée à l'intérieur
  return {
    add: function (_name, _firstname, _date, _address, _mail) {
      const contact = {
        name: _name,
        firstname: _firstname,
        date: _date,
        adress: _address,
        mail: _mail,
      };
      // ajout du contact à la liste
      contactList.push(contact);

      // sauvegarde de la liste dans le localStorage (en texte JSON)
      localStorage.setItem("contactList", JSON.stringify(contactList));

      return contactList;
    },

    reset: function () {
      localStorage.removeItem("contactList");
      contactList = []; // CORRECTION : on vide aussi la liste en mémoire
      return contactList;
    },

    getList: function () {
      return contactList;
    },
  };
})();