import { RegistrationLeft } from "../../components/general/registrationLeft";
import { LoginForm } from "../../components/loginForm/loginForm";

export function LoginPage() {
  return (
    <div className="container py-5">
      <div className="row register-card g-0 shadow-lg border-0" style={{ borderRadius: '1rem', overflow: 'hidden' }}>

        {/* Left Side: Information */}
        <RegistrationLeft 
          question={'Don\'t have an account?'}
          action={'Sign up'}
          link={'/register'}
        />

        {/* Right Side: Interactive Form */}

        <LoginForm />
          
      </div>
    </div>
  );
}