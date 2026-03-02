import maleProfilePic from '../../assets/icons/male-profile-image.png';
import femaleProfilePic from '../../assets/icons/female-profile-image.png';
import othersProfilePic from '../../assets/icons/other-profile-image.png';

function PageHeader( { storedUser, setShowSidebar, userProfile } ) {
  return (
    <nav className="navbar p-0 navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid bg-primary text-white p-2">
        <div className="container d-flex justify-content-between align-items-center">
          <h2 className="navbar-brand text-white m-0">Welcome {storedUser.username ? storedUser.username.charAt(0).toUpperCase() + storedUser.username.slice(1) : "User"}</h2>
          <img
            className="rounded-circle"
            style={{ cursor: 'pointer' }}
            width="40" height="40"
            src={userProfile?.profilePic || (userProfile?.gender === 'male' ? maleProfilePic : userProfile?.gender === 'female' ? femaleProfilePic : userProfile?.gender === 'other' ? othersProfilePic : null)}
            alt="profile"
            onClick={() => setShowSidebar(true)}
          />
        </div>
      </div>
    </nav>
  )
}

export default PageHeader;