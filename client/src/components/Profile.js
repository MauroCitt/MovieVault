import React from 'react'

const Profile = (props) => {
  console.log(props);
  return (
    <div>
    <h1>Profile</h1>
    <button type="submit" id='btnSalida' onClick={props.logout}>
    Logout
  </button>
</div>
  )
}

export default Profile