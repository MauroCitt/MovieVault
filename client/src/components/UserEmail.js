import React from 'react';
import '../styles/UserEmail.css';

const UserEmail = (props) => {
  return (
    <div className="user-email-container">
      <div className="left-half">
        <form onSubmit={props.emailSubmit}>
          <input
            id='email'
            type="text"
            name="email"
            placeholder="Enter your email"
            value={props.userEmail}  
            onChange={props.enterEmail} 
          />
          <button type="submit" id='btnEntrar'>Entrar</button>
        </form>
      </div>
      <div className="right-half">
        <img
          src="client\src\images\collagePeliculas.jpg"  
          alt="Right Half"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
};

export default UserEmail;
