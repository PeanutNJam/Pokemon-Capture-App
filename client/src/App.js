import { Route, Routes } from "react-router-dom";
import { useContext } from "react";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import AuthContext from "./Store/auth-context";
import './App.css';

function App() {

  const authCtx = useContext(AuthContext);

  const isLoggedin = authCtx.isLoggedIn;


  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />}>
          
          <Route path="register" element={<SignUpPage />} />
        </Route>
        <Route path="signup" element={<SignUpPage />} />
        <Route path="home" element={<HomePage />} />
        {isLoggedin && <Route path="catch" element={<GamePage />} />}
        {!isLoggedin && <Route path="catch" element={<LoginPage />} />}
      </Routes>
    </>
  );
}

export default App;
