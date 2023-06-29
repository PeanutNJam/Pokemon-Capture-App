import LoginForm from "../components/LoginForm";
import "./LoginPage.css";




const LoginPage = () => {


  return (
    <div class="main-wrapper">
      <div>
        <div class="title-wrapper">
          <img src="https://www.freepnglogos.com/uploads/pokemon-logo-png-0.png" alt="Pokemon Logo" height="250" />
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage