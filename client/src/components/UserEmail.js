import React from 'react';

const UserEmail = (props) => {
  return (
    <form onSubmit={props.emailSubmit}>
      <input
        type="text"
        name="email"
        placeholder="Enter your email"
        value={props.userEmail}  
        onChange={props.enterEmail} 
      />
      <button type="submit">Entrar</button>
    </form>
  );
};

export default UserEmail;  
