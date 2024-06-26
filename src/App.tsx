import './App.css'
import { useAppSelector } from './app/hooks'
import { selectAccessToken, selectUser } from './features/user/userSlice'
import './index.css';
import './App.css';


function App() {
  const user = useAppSelector(selectUser);
  const accessToken = useAppSelector(selectAccessToken);


  return (
    <>

      <p>Id Token: {user?.idToken}</p>
      <p>Access Token: {accessToken}</p>
    </>
  )
}

export default App