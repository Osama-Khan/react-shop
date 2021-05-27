import { Component } from "react";
import Icon from "../components/icon/icon";
import Card from "../components/card/card";
import { AppContext } from "../context/app.provider";
import { categoriesUrl } from "../routes";
import LoadingSpinner from "../components/loading/loading";

export default class Categories extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = { categories: null };
  }

  componentDidMount() {
    this.context.services.categoryService
      .fetchCategories()
      .then((categories) => {
        this.setState({ categories });
      });
  }

  render() {
    const catPage = this.state.categories ? (
      this.renderCategories()
    ) : (
      <LoadingSpinner />
    );
    return (
      <>
        <h1 className="mt-5">Categories</h1>
        <div className="row mt-5">{catPage}</div>
      </>
    );
  }

  renderCategories() {
    const categories = this.state.categories;
    const mainCats = categories.map((c) => (
      <div key={c.id} className="col-6 col-md-4 col-lg-2">
        <Card
          text={c.name}
          color="primary"
          linkTo={`${categoriesUrl}/${c.name.toLowerCase()}`}
        />
      </div>
    ));
    return mainCats;
  }
}
