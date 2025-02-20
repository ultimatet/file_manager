import Navbar from './Navbar.js';
import FileView from './fileView.js';

const User = ({onLogout}) => {
    return (
        <div className="User">
            <Navbar onLogout={onLogout}/>
            
            <FileView />
        </div>
    );
};

export default User;