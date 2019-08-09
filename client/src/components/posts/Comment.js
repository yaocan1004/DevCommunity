import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { removeComment } from '../../actions/post';

const Comment = ({
  auth,
  comment: { date, _id, user, text, name, avatar },
  postId,
  removeComment
}) => {
  return (
    <div className='comments'>
      <div className='post bg-white p-1 my-1'>
        <div>
          <Link to={`/profile/${user}`}>
            <img className='round-img' src={avatar} alt='' />
            <h4>{name}</h4>
          </Link>
        </div>
        <div>
          <p className='my-1'>{text}</p>
          <p className='post-date'>
            Posted on <Moment format='MM/DD/YYYY'>{date}</Moment>
          </p>
        </div>
        {!auth.loading && auth.user._id === user && (
          <button
            onClick={e => {
              e.preventDefault();
              removeComment(postId, _id);
            }}
            className='btn btn-danger'
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { removeComment }
)(Comment);
