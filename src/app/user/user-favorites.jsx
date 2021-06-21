import { Component } from "react";
import { Redirect } from "react-router-dom";
import ProductsList from "../components/products-list/products-list";
import { AppContext } from "../context/app.provider";
import { userUrl } from "../routes";

export default class UserFavorites extends Component {
  static contextType = AppContext;

  render() {
    if (!this.context.state.user.token) {
      return <Redirect to={userUrl} />;
    }
    return (
      <div className="mt-5">
        <h1>Your Favorites</h1>
        <ProductsList
          requestMethod={(criteria) =>
            this.context.services.favoriteService.getFavoritesOfUser(
              this.context.state.user.id,
              criteria
            )
          }
        />
      </div>
    );
  }
}
