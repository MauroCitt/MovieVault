import React from 'react';
import '../../styles/UserEmail.css';


const RecoverPass = (props) => {

  return (
    <div className="user-email-container">
      <div className="left-half">
        <div className='form'>
          <form onSubmit={props.passwordRecoveringSent}>
            <input
              id='email'
              class="form-control mb-3 mt-3 "
              type="text"
              name="email"
              placeholder="Enter your email"
              value={props.userEmail}
              onChange={props.enterEmail}/>

            <button type="submit" id='btnEntrar'>
              Recover password
            </button>

            <div className="footer" class="justify-center mt-10">
              <span onClick={props.navigateToLogin}>
                New user? Sign Up
              </span>

          </div>
            

          </form>
        </div>
      </div>
      <div className="right-half">
      </div>
    </div>
  );
};

export default RecoverPass;
