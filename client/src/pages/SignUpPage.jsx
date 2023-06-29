import SignUpForm from "../components/SignUpForm";
import "./SignUpPage.css";


const SignUpPage = () => {
  return (
    <>
      <div class="img-wrapper">
        <img src="https://www.freepnglogos.com/uploads/pokemon-logo-png-0.png" alt="Pokemon Logo" height="250" />
      </div>
      <div class="form-wrapper">
        <SignUpForm />
      </div>
    </>
  )
}

export default SignUpPage