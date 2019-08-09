import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEducation = ({ profile: { education } }) => {
  const edu_tag = education.map(edu => (
    <div>
      <h3>{edu.school}</h3>
      <p>
        <Moment format='YYYY/MM/DD'>{edu.from}</Moment> -{' '}
        {edu.to === null ? (
          'Now'
        ) : (
          <Moment format='YYYY/MM/DD'>{edu.to}</Moment>
        )}
      </p>
      <p>
        <strong>Degree: </strong>
        {edu.degree}
      </p>
      <p>
        <strong>Field Of Study: </strong>
        {edu.fieldofstudy}
      </p>
      <p>
        <strong>Description: </strong>
        {edu.description}
      </p>
    </div>
  ));
  return <div>{edu_tag}</div>;
};

ProfileEducation.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileEducation;
