import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_POSTS,
  GET_POST,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  ADD_COMMENT,
  REMOVE_COMMENT
} from './types';

export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get('/api/posts');
    dispatch({
      type: GET_POSTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

//Get post by id
export const getPostById = postId => async dispatch => {
  try {
    const res = await axios.get(`/api/posts/${postId}`);
    dispatch({
      type: GET_POST,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
    dispatch(setAlert(err.response.data.msg, 'danger'));
  }
};

export const addLike = id => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/like/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: {
        id,
        likes: res.data
      }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
    dispatch(setAlert(err.response.data.msg, 'danger'));
  }
};

export const removeLike = id => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/unlike/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: {
        id,
        likes: res.data
      }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
    dispatch(setAlert(err.response.data.msg, 'danger'));
  }
};

export const deletePost = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/posts/${id}`);

    dispatch({
      type: DELETE_POST,
      payload: { id }
    });
    dispatch(setAlert('Post Removed', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
    dispatch(setAlert(err.response.data.msg, 'danger'));
  }
};

export const addPost = formData => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const res = await axios.post('/api/posts', formData, config);

    dispatch({
      type: ADD_POST,
      payload: res.data
    });
    dispatch(setAlert('Post Created', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
    const errors = err.response.data.errors; //list
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

export const addComment = (text, postId) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.put(`/api/posts/comments/${postId}`, text, config);

    dispatch({
      type: ADD_COMMENT,
      payload: res.data
    });
    dispatch(setAlert('Comment Added', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

export const removeComment = (postId, commentId) => async dispatch => {
  try {
    const res = await axios.delete(
      `/api/posts/comments/${postId}/${commentId}`
    );

    dispatch({
      type: REMOVE_COMMENT,
      payload: res.data
    });
    dispatch(setAlert('Comment Removed', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};
