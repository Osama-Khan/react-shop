import { Component } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/app.provider';
import { userUrl } from '../../routes';
import Icon from '../../components/icon/icon';
import ListingComponent from '../listing-component.tsx';

export default class AdminUsers extends Component {
  static contextType = AppContext;

  listingColumnOptions = [
    {
      header: (
        <div className="text-center img-tiny">
          <Icon dataIcon="fa:user" />
        </div>
      ),
      key: 'profileImage',
      selector: (v) => <img src={v} alt="Profile" className="img-tiny" />,
    },
    {
      header: 'ID',
      key: 'id',
    },
    {
      header: 'Username',
      key: 'username',
      selector: (v, r) => <Link to={`${userUrl}/${r.id}`}>@{v}</Link>,
    },
    {
      header: 'Name',
      key: 'firstName',
      selector: (v, r) => `${v} ${r.lastName}`,
    },
    {
      header: 'Actions',
      actions: [
        {
          selector: () => (
            <span title="Delete">
              <Icon dataIcon="fa:trash" classes="text-red text-clickable" />
            </span>
          ),
          onClick: (row) => this.delete(row),
        },
      ],
    },
  ];

  render() {
    return (
      <div className="mt-5 card">
        <h3 className="card-header">
          <span
            className="mr-2 text-clickable"
            onClick={this.props.history.goBack}>
            &larr;
          </span>
          Manage Users
        </h3>
        <div className="card-body">
          <div className="d-flex flex-column">
            <ListingComponent
              options={this.listingColumnOptions}
              fetchMethod={(crit) =>
                this.context.services.userService.getUsers(crit)
              }
            />
          </div>
        </div>
      </div>
    );
  }

  delete = async (user) => {
    const svc = this.context.services;
    const confirmation = await svc.uiService.confirmModal(
      `Delete ${user.username}?`,
      `Are you sure you want to delete the user ${user.username}?`,
      'warning',
      true,
      'Delete',
    );
    if (confirmation) {
      const promise = svc.userService.delete(user.id);
      const messages = {
        loading: 'Deleting user...',
        success: 'User deleted!',
        error: 'Failed to delete user!',
      };
      return svc.uiService.promiseToast(promise, messages).then(() => {
        this.setState(this.initialState);
      });
    }
  };
}
