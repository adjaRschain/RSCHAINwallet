import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { updateUserInDatabase } from "../datasforlocalstorage/addNewUser";

/*
Partout ou on appel ce hooks, changer une informations sur l'utilisateur connecté entraine immédiatement 
sa mise à jour dans la fausse base de donnée

Surveiller l'utilisateur enregistré pour mettre à jour la liste des utilisateurs
*/
export default function useWatchLoggedUserForUpdateUserList() {
  const [loggedUser, setLoggedUser] = useLocalStorage("loggedUser");

  useEffect(() => {
    if (loggedUser) updateUserInDatabase(loggedUser);
  }, [loggedUser]);
}
