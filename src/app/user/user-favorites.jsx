import { Component } from 'react';
import ProductsList from '../components/products-list/products-list';
import { AppContext } from '../context/app.provider';

export default class UserFavorites extends Component {
  static contextType = AppContext;

  render() {
    return (
      <div className="mt-5">
        <h1>Your Favorites</h1>
        <ProductsList
          showFilters={false}
          requestMethod={(criteria) =>
            this.context.services.favoriteService.getFavoritesOfUser(
              this.context.state.user.id,
              criteria,
            )
          }
        />
      </div>
    );
  }
}
