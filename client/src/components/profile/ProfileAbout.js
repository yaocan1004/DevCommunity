import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const ProfileAbout = ({ profile: { user, bio, skills } }) => {
  const skills_tag = skills.map(skill => (
    <div class='p-1'>
      <i class='fa fa-check' /> {skill}
    </div>
  ));

  return (
    <div class='profile-about bg-light p-2'>
      {bio && (
        <Fragment>
          <h2 class='text-primary'>{user.name.trim().split(' ')[0]}'s Bio</h2>
          <p>{bio}</p>
        </Fragment>
      )}

      <div class='line' />
      <h2 class='text-primary'>Skill Set</h2>
      <div class='skills'>{skills_tag}</div>
    </div>
  );
};

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileAbout;
