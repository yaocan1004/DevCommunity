import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getPostById, addComment } from '../../actions/post';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import Comment from './Comment';
import Alert from '../layout/Alert';

const Post = ({ match, getPostById, addComment, post: { post, loading } }) => {
  useEffect(() => {
    getPostById(match.params.id);
  }, [getPostById]);

  const [text, setComment] = useState('');

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to='/posts' className='btn'>
        Back To Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <div className='post-form'>
        <div className='bg-primary p'>
          <h3>Leave A Comment</h3>
        </div>
        <form className='form my-1'>
          <textarea
            name='text'
            cols='30'
            rows='5'
            placeholder='Comment on this post'
            value={text}
            onChange={e => setComment(e.target.value)}
          />
          <input
            onClick={e => {
              e.preventDefault();
              addComment({ text }, post._id);
              setComment('');
            }}
            type='submit'
            className='btn btn-dark my-1'
            value='Submit'
          />
        </form>
      </div>
      {post.comments.length > 0 &&
        post.comments.map(comment => (
          <Comment key={comment._id} comment={comment} postId={post._id} />
        ))}
    </Fragment>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
  getPostById: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(
  mapStateToProps,
  { getPostById, addComment }
)(Post);
