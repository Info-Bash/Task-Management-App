import { AccountOptions } from "./accountOptions"
export function  RegistrationLeft ({question, action, link}) {
  return (
    <div className="col-lg-4 left-panel d-none d-lg-flex flex-column justify-content-center bg-primary text-white p-5">
      <i className="bi bi-list-task text-center mb-3" style={{ fontSize: '5rem' }}></i>
      <h3 className="fw-bold text-center">Task Management</h3>
      <p className="text-start">Manage your tasks efficiently, stay organized, and keep track of your progress in one secure place.</p>

      <div className="mt-4">
        <div className="d-flex align-items-center mb-3">
          <i className="bi bi-check2-circle fs-4 me-2"></i>
          <span>Secure account creation</span>
        </div>
        <div className="d-flex align-items-center mb-3">
          <i className="bi bi-check2-circle fs-4 me-2"></i>
          <span>Encrypted password protection</span>
        </div>
        <div className="d-flex align-items-center mb-3">
          <i className="bi bi-check2-circle fs-4 me-2"></i>
          <span>Your information stays private</span>
        </div>
      </div>

      <AccountOptions
        question={question}
        action={action}
        link={link}
      />
    </div>
  )
}