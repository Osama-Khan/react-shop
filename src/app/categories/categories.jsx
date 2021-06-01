import { Component } from "react";
import Card from "../components/card/card";
import { AppContext } from "../context/app.provider";
import { categoriesUrl } from "../routes";
import LoadingSpinner from "../components/loading/loading";
import ProductsList from "../components/products-list/products-list";

export default class Categories extends Component {
  static contextType = AppContext;

  category;

  constructor(props) {
    super(props);
    this.state = { categories: null, products: null };

    this.category = props.match.params.name;
  }

  componentDidMount() {
    if (this.category) {
      this.context.services.categoryService
        .fetchProductsByCategory(this.category)
        .then((products) => {
          this.setState({ ...this.state, products });
        });
    } else {
      this.context.services.categoryService
        .fetchCategories()
        .then((categories) => {
          this.setState({ ...this.state, categories });
        });
    }
  }

  render() {
    const page = this.state.categories ? (
      this.renderCategories()
    ) : this.state.products ? (
      <ProductsList products={this.state.products} />
    ) : (
      <LoadingSpinner />
    );
    return (
      <>
        <h1 className="mt-5">
          Categories{this.category ? ` > ${this.category.toUpperCase()}` : ""}
        </h1>
        {page}
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
    return <div className="row mt-5">{mainCats}</div>;
  }
}
