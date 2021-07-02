import React from 'react';
import { Redirect } from 'react-router-dom';
import { AppContext } from '../context/app.provider';
import LoadingSpinner from '../components/loading/loading-spinner';
import LoadingFailed from '../components/loading/loading-failed';
import UserProfile from './profile/user-profile';
import LoginForm from './login-form';
import { userUrl } from '../routes';

export default class User extends React.Component {
  static contextType = AppContext;
  userId;

  constructor(props) {
    super(props);
    this.state = {
      address: undefined,
      user: undefined,
      failed: false,
      fetching: false,
    };
  }

  render() {
    if (this.context.state.user?.id === parseInt(this.props.match.params.id)) {
      return <Redirect to={userUrl} />;
    }
    if (this.context.state.user.token || this.props.match.params.id) {
      if (this.state.address === undefined && this.state.user === undefined) {
        if (this.state.failed) {
          return <LoadingFailed />;
        } else {
          if (!this.state.fetching) this.fetchData();
          return <LoadingSpinner />;
        }
      }
      if (
        !this.props.match.params.id ||
        (this.context.state.user.token &&
          this.state.user?.id === this.context.state.user.id)
      ) {
        return (
          <UserProfile
            user={this.context.state.user}
            address={this.state.address}
            isOwn={true}
            onLogout={this.logout}
          />
        );
      } else {
        if (this.state.user) return <UserProfile user={this.state.user} />;
        else if (this.state.fetching) return <LoadingSpinner />;
        else return <LoadingFailed />;
      }
    } else {
      return <LoginForm context={this.context} />;
    }
  }

  fetchData = () => {
    this.setState({ ...this.state, fetching: true });
    const id = this.props.match.params.id;
    if (id) {
      this.context.services.userService
        .getUser(parseInt(id))
        .then((res) => {
          const user = res.data;
          this.setState({ ...this.state, user });
        })
        .catch((err) => {
          if (err) {
            if (err.response.status === 404) {
              this.context.services.uiService.iconModal(
                'Nobody Here',
                'The user you are looking for could not be found',
                'error',
              );
            }
            this.setState({ ...this.state, failed: true });
          }
        })
        .finally(() => this.setState({ ...this.state, fetching: false }));
    } else {
      const user = this.context.state.user;
      this.context.services.settingService
        .getDefaultAddress(user.id)
        .then((res) => {
          const address = res.data;
          if (address) {
            this.setState({ ...this.state, address });
            this.context.services.addressService
              .getAddress(address.id)
              .then((res) => {
                const address = res.data;
                this.setState({ ...this.state, address });
              })
              .catch((err) => {
                if (err) {
                  this.setState({ ...this.state, failed: true });
                }
              })
              .finally(() => (this.fetching = false));
            return;
          }
          this.setState({
            ...this.state,
            address: false,
          });
        })
        .catch((err) => {
          if (err) {
            this.setState({ ...this.state, failed: true });
          }
        });
    }
  };

  logout = () => {
    this.context.services.storageService.clearUserToken();
    this.context.setState({
      ...this.context.state,
      user: {
        ...this.context.state.user,
        token: undefined,
      },
    });
  };
}
