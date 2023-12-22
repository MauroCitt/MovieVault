import React from 'react'

const Profile = (props) => {
  console.log(props);
  return (
    <div className="user-email-container">
        {/* <form onSubmit={props.handleSubmit}>
            <p>{props.userEmail}</p>
            <input
                id='password'
                type="password"
                name="password"
                placeholder="Enter your password"
                value={props.userPassword}  
                onChange={props.enterPassword} 
            />
            <button type="submit">Submit</button>
        </form> */}
        <h1>Profile</h1>
        
    </div>
  )
}

export default Profile