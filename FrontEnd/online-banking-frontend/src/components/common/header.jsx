import UserInfo from "../Dashboard/UserInfo";
import "../../assets/styles/Dashboard/Dashboard.css";

const Header = ({GenerateUserInfo, handleLogout}) => {
    return (
        <header className="dashboard-header">
        <div className="header-content">
          <div className="logo" onClick={()=>window.location.reload()} style={{cursor:'pointer', transition: 'opacity 0.2s'}} title="Reload Dashboard">
            <h2 style={{margin:0}}>🏦 Banking App</h2>
          </div>
          <UserInfo userInfo={GenerateUserInfo()} onLogout={handleLogout} />
        </div>
      </header>
    )
}

export default Header;