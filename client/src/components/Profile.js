import React from 'react';
import NavbarHome from './Navbar';
import '../styles/Profile.css';

const Profile = (props) => {
  const logoutButtonStyle = {
    backgroundColor: '#A239CA',
    color: 'white',
  };

  return (
    <div>
      <NavbarHome />
      <div className='header row'>
        <h1 className='titulo'>Profile</h1>
      </div>
      <div className='formularioPerfil row'>
      <form onSubmit={props.passwordSubmit}>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id='email'
              className="form-control"
              style={{ marginLeft: '10px' }}  
              type="text"
              value={props.email}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id='password'
              className="form-control"  
              style={{ marginLeft: '10px' }}  
              type="password"
              placeholder="Enter your password"
              value={props.userPass}
              onChange={props.enterPassword}
            />
          </div>
        </div>
        <div className="col-md-6">
          <button
            type="submit"
            className="btn"
            style={logoutButtonStyle}
            onClick={props.logout}
          >
            Logout
          </button>
          <button type='submit' id='btnGuardarPass'>
            Save password
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
