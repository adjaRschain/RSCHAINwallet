import './App.css';
import AuthRouter from './Pages/Auth/AuthRouter';
import AppRouter from './Pages/App/AppRouter';
import { useLocalStorage } from 'usehooks-ts'

function App() {

  const [loggedUser, setLoggedUser] = useLocalStorage('loggedUser', undefined);

  /**Si le localstorage est vite, le user s'inscrit avec AuthRouter, sinon il se connecte avec AppRouter */
  if(loggedUser)
    return <AppRouter />

  return <AuthRouter />
}

export default App;
