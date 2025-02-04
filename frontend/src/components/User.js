import Navbar from './Navbar.js';
import FileUpload from './fileUpload.js';
import FileView from './fileView.js';

const User = ({onLogout}) => {
    return (
        <div className="User">
            <Navbar onLogout={onLogout}/>
            <FileUpload />
            <FileView />
        </div>
    );
};

export default User;