import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileExperience = ({ profile: { experience } }) => {
  const exp_tag = experience.map(exp => (
    <div>
      <h3 class='text-dark'>{exp.company}</h3>
      <p>
        <Moment format='YYYY/MM/DD'>{exp.from}</Moment> -{' '}
        {exp.to === null ? (
          'Now'
        ) : (
          <Moment format='YYYY/MM/DD'>{exp.to}</Moment>
        )}
      </p>
      <p>
        <strong>Position: </strong>
        {exp.title}
      </p>
      <p>
        <strong>Description: </strong>
        {exp.description}
      </p>
    </div>
  ));

  return <div>{exp_tag}</div>;
};

ProfileExperience.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileExperience;
