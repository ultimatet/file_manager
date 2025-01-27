import Navbar from './Navbar.js';


const User = ({onLogout}) => {
    return (
        <div className="User">
            <Navbar onLogout={onLogout}/>
        </div>
    );
};

export default User;