import React from 'react';

const dummy = "http://www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640-300x300.png";

const User = ({ active, user, onClick }) => (
  <li className={ active ? 'active' : ''} onClick={ () => onClick(user) }>

    <div className="user">

      <img
        className="img-responsive img-circle user-profile-pic"
        src={ user.profile_images || dummy }
        alt={ `${user.name}'s Profile Picture` }
      />

      <div className="user-info">
        <h5 className="user-name">{user.name}</h5>
        {/* <p className="user-thought">Content of the user's status some more to test</p> */}
      </div>

      <div className="user-status">
        <i className={`${user.online ? 'user-online fa fa-circle' : 'user-offline fa fa-circle-o'}`} arial-hidden="true"></i>
      </div>

    </div>
    
  </li>
);

export default User;