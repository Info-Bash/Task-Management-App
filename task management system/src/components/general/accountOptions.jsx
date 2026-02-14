import { Link } from "react-router-dom";

export function AccountOptions({question, action, link}) {
  return (
    <>
      <hr className="my-4 border-light opacity-25" />
      <small className="mb-2 text-center d-block">{question}</small> 
      <Link 
        to={link} 
        className="btn btn-outline-light rounded-pill px-4"
      >
        {action}
      </Link>
    </>
  );
}