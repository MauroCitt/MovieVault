import React, { useState } from 'react';
import '../../styles/UserEmail.css';
import { Toaster, toast } from 'sonner';


const UserEmail = (props) => {

  const toggleMode = () => {
    props.toggleMode();
  };

  return (
    <div className="user-email-container">
      <div className="left-half">
        <div className='form'>
          <form onSubmit={props.signInMode ?  props.emailPassSubmit : props.emailSubmit}>
            <input
              id='email'
              class="form-control mb-3 mt-3 "
              type="text"
              name="email"
              placeholder="Enter your email"
              value={props.userEmail}
              onChange={props.enterEmail}
            />

            {props.signInMode && (
              <input
                type="password"
                name="password"
                class="form-control mb-3 mt-3 "
                placeholder="Enter your password"
                value={props.userPass}
                onChange={props.enterPassword}
              />
            )}
            <button type="submit" id='btnEntrar'>
              {props.signInMode ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
        </div>

        <div className="footer">
          <span onClick={toggleMode}>
            {props.signInMode ? 'New user? Sign Up' : 'Already have an account? Sign In'}
          </span>
          
          {props.signInMode && (
              <span onClick={props.navigateToOPT}>
                Recover Password
              </span>
            )}
        </div>
      </div>
      <div className="right-half">
      </div>
    </div>
  );
};

export default UserEmail;
