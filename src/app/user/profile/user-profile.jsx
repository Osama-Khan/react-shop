import { Link } from 'react-router-dom';
import Card from '../../components/card/card';
import Icon from '../../components/icon/icon';
import {
  addressesUrl,
  editUserUrl,
  ordersUrl,
  userFavoritesUrl,
  userUrl,
} from '../../routes';
import RoleBadge from './role-badge';

export default function UserProfile({
  user,
  isOwn = false,
  address,
  onLogout,
}) {
  return (
    <div className="mt-5">
      <div
        className={`m-auto col-md-8 p-0${
          isOwn ? ' card border border-primary' : ''
        }`}>
        <div className="row ml-0 mr-0">
          <div
            className={`col-sm-4 bg-primary card rounded-left${
              !isOwn ? ' mx-auto' : ''
            }`}>
            {isOwn ? <EditUserIcon /> : ''}
            <div
              className={`text-center text-white${
                isOwn ? ' my-auto' : 'my-3'
              }`}>
              <img
                src={user.profileImage}
                className="rounded-circle shadow img-large"
                alt="User-Profile"
              />
              <h6 className="mt-1 font-weight-bold text-light">
                {user.firstName} {user.lastName}
              </h6>
              <Link to={`${userUrl}/${user.id}`}>
                <p className="badge btn btn-light">@{user.username}</p>
              </Link>
              <br />
              {user.roles ? <RoleBadge roles={user.roles} /> : ''}
            </div>
          </div>
          {isOwn ? (
            <div className="col-sm-8">
              <h6 className="mt-3 font-weight-bold">Information</h6>
              <div className="row">
                <div className="col-sm-6">
                  <p className="mb-0">Email</p>
                  <h6 className="text-muted">{user.email}</h6>
                </div>
                <div className="col-sm-6">
                  <p className="mb-0">
                    Default Address{' '}
                    <Link to={addressesUrl}>
                      <Icon
                        dataIcon="bx-bxs-message-square-detail"
                        classes="text-transparent-dark clickable"
                      />
                    </Link>
                  </p>
                  <p>
                    <b>{address ? address.tag : ''}</b>{' '}
                    <span className="text-sm text-muted">
                      {' '}
                      {address ? address.address : 'No default address'}
                    </span>
                  </p>
                </div>
              </div>
              <hr />
              <div className="row mt-2">
                <div className="col-sm-6 mb-3 mx-auto">
                  <Card
                    text="My Products"
                    icon="bx-bxs-box"
                    color="primary"
                    iconClasses="icon-sm"
                    linkTo={`${userUrl}/${user.id}/products`}
                  />
                </div>
                <div className="col-sm-6 mb-3 mx-auto">
                  <Card
                    text="My Orders"
                    icon="fa-solid:file-invoice"
                    color="primary"
                    iconClasses="icon-sm"
                    linkTo={ordersUrl}
                  />
                </div>
                <div className="col-sm-6 mb-3 mx-auto">
                  <Card
                    text="My Favorites"
                    icon="fa:heart"
                    color="primary"
                    iconClasses="icon-sm"
                    linkTo={userFavoritesUrl}
                  />
                </div>
                <div className="col-sm-6 mb-3 mx-auto">
                  <Card
                    text="Logout"
                    icon="fa:sign-out"
                    color="red"
                    classes="border border-red"
                    iconClasses="icon-sm"
                    click={onLogout}
                  />
                </div>
                {user.roles?.find((r) => r.name === 'admin') ? (
                  <div className="col-sm-6 mb-3 mx-auto">
                    <Card
                      text="Admin Panel"
                      icon="fa:shield"
                      color="primary"
                      classes="border border-primary"
                      iconClasses="icon-sm"
                    />
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
        {!isOwn ? (
          <div className="col-sm-4 mt-3 mx-auto">
            <Card
              text="Products"
              icon="bx-bxs-box"
              color="primary"
              iconClasses="icon-sm"
              linkTo={`${userUrl}/${user.id}/products`}
            />
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

const EditUserIcon = () => (
  <div className="m-2 top-right">
    <Link to={editUserUrl}>
      <Icon
        classes="text-subtle-white clickable"
        dataIcon="bx-bxs-message-square-edit"
      />
    </Link>
  </div>
);
