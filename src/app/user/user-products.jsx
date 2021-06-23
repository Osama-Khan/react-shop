import { Component } from "react";
import LoadingFailed from "../components/loading/loading-failed";
import LoadingSpinner from "../components/loading/loading-spinner";
import ProductsList from "../components/products-list/products-list";
import { AppContext } from "../context/app.provider";

export default class UserProducts extends Component {
  static contextType = AppContext;
  userId = undefined;

  constructor() {
    super();
    this.state = {};
  }

  render() {
    if (!this.state.user && !this.state.fetching && !this.state.failed) {
      this.setState({ ...this.state, fetching: true });
      this.fetchData();
      return <LoadingSpinner />;
    } else if (this.state.fetching) {
      return <LoadingSpinner />;
    } else if (this.state.user && !this.state.failed) {
      return (
        <div className="mt-5">
          <h1>{this.state.user.username}'s Products</h1>
          <ProductsList
            requestMethod={(criteria) =>
              this.context.services.userService.fetchProducts(
                parseInt(this.props.match.params.id),
                criteria
              )
            }
          />
        </div>
      );
    } else {
      return <LoadingFailed />;
    }
  }

  fetchData = () => {
    this.context.services.userService
      .getUser(parseInt(this.props.match.params.id))
      .then((res) => {
        const user = res.data;
        this.setState({ user });
      })
      .catch((err) => {
        if (err.response.status === 404) {
          this.context.services.uiService.iconModal(
            "No Such User",
            "The user you have provided does not exist",
            "error"
          );
        }
        this.setState({ ...this.state, failed: true });
      })
      .finally(() => this.setState({ ...this.state, fetching: false }));
  };
}
