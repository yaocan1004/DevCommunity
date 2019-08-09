import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getRepos } from '../../actions/profile';
import Spinner from '../../components/layout/Spinner';

const ProfileGuthub = ({ username, repos, getRepos }) => {
  useEffect(() => {
    getRepos(username);
  }, [getRepos]);

  const git_repos = repos.map(repo => (
    <div key={repo._id} class='repo bg-white p-1 my-1'>
      <h4>
        <a href={repo.html_url} target='_blank' rel='noopener noreferrer'>
          {repo.name}
        </a>
      </h4>
      <p>
        {repo.description === null ? (
          'None description for this event'
        ) : (
          <span>{repo.description}</span>
        )}
      </p>
      <div>
        <ul>
          <li class='badge badge-primary'>Stars: {repo.stargazers_count}</li>
          <li class='badge badge-dark'>Watchers: {repo.watchers_count}</li>
          <li class='badge badge-light'>Forks: {repo.forks_count}</li>
        </ul>
      </div>
    </div>
  ));

  return (
    <div class='profile-github'>
      <h2 class='text-primary my-1'>
        <i class='fab fa-github' /> Github Repos
      </h2>
      {git_repos}
    </div>
  );
};

ProfileGuthub.propTypes = {
  getRepos: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  repos: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  repos: state.profile.repos
});

export default connect(
  mapStateToProps,
  { getRepos }
)(ProfileGuthub);
