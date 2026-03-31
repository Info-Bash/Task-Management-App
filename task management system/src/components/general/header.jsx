import maleProfilePic from '../../assets/icons/male-profile-image.png';
import femaleProfilePic from '../../assets/icons/female-profile-image.png';
import othersProfilePic from '../../assets/icons/other-profile-image.png';

function PageHeader(
  { storedUser,
    setShowSidebar,
    userProfile,
    clickable = true
  }
) {

  const defaultPic = userProfile?.gender === 'male' ? maleProfilePic :
    userProfile?.gender === 'female' ? femaleProfilePic :
      othersProfilePic;

  const profileSrc = userProfile?.profilePic || defaultPic;

  return (
    <nav className="navbar p-0 navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid bg-primary text-white p-2">
        <div className="container d-flex justify-content-between align-items-center">
          <h2 className="navbar-brand text-white m-0">Welcome {storedUser.username ? storedUser.username.charAt(0).toUpperCase() + storedUser.username.slice(1) : "User"}</h2>
          <img
            className="rounded-circle"
            style={{ cursor: clickable ? 'pointer' : 'default' }}
            width="40" 
            height="40"
            src={profileSrc}
            alt="profile"
            onClick={clickable ? () => setShowSidebar(true) : undefined}


          />
        </div>
      </div>
    </nav>
  )
}

export default PageHeader;