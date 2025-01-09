//Ajouter un nouvel utilisateur dans le local storage
export const addNewUser = (newUser) => {
    const stringData = localStorage.getItem("userList") || "[]";
    let currentList = JSON.parse(stringData);

    currentList.push({ ...newUser, id: currentList.length + 1 });
    
    localStorage.setItem("userList", JSON.stringify(currentList));
}

export const updateUserInDatabase = (user) => {
    const stringData = localStorage.getItem("userlist") || "[]";
    let currentList = JSON.parse(stringData);
    
    //On fait une boucle sur toute les données en transformant l'utilisateur à modifier quand on le trouve
    const newList = currentList.map((userItem) => {
        //Quand on trouve le même utilisateur
        if (userItem.id === user.id) {
            //On retourne les données modifiés
            return user;
        }
    
        //Sinon on retourne les données normales de l'utilisateur
        return userItem;
    });
  
    localStorage.setItem("userlist", JSON.stringify(newList));
 };
  