import React from 'react';
import '../styles/UserEmail.css';
import  { Toaster, toast } from 'sonner';

const notify = () => toast.success('Email sent!', {style: {
  background: 'white', padding: '16px',
}, className: 'custom-toast',
duration: 5000,
});

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
          <button type="submit" id='btnEntrar' onClick={notify}>
              Entrar
          </button>
          <Toaster position="bottom-right" />
        </form>
      </div>
      <div className="right-half">
        <img
          src="..\images\collagePeliculas.jpg"  
          alt="Right Half"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
};

export default UserEmail;
