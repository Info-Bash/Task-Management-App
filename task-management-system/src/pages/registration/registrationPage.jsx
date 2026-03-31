import { RegistrationLeft } from '../../components/general/registrationLeft';
import './registration.css';
import { RegistrationForm } from '../../components/registrationForm/registrationForm';

export function RegistrationPage() {

  return (
    <div className="container py-5">
      <div className="row register-card g-0 shadow-lg border-0" style={{ borderRadius: '1rem', overflow: 'hidden' }}>

        {/* Left Side: Information Pane */}
        <RegistrationLeft 
          question={'Already have an account?'}
          action={'Log in'}
          link={'/login'}
        />

        {/* Right Side: Interactive Form */}
        <RegistrationForm/>

      </div>
    </div>
  );
}