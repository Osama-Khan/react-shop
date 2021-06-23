import { Component } from "react";
import Card from "../components/card/card";
import { AppContext } from "../context/app.provider";
import { categoriesUrl } from "../routes";
import LoadingSpinner from "../components/loading/loading-spinner";
import ProductsList from "../components/products-list/products-list";
import Icon from "../components/icon/icon";

export default class Categories extends Component {
  static contextType = AppContext;

  categoryName;

  constructor(props) {
    super(props);
    this.state = { categories: undefined };

    this.categoryName = props.match.params.name;
  }

  componentDidMount() {
    if (!this.categoryName) {
      this.context.services.categoryService.fetchCategories().then((res) => {
        this.setState({ ...this.state, categories: res.data.data });
      });
    }
  }

  render() {
    const page = this.state.categories ? (
      <this.CategoriesList />
    ) : this.categoryName ? (
      <ProductsList
        requestMethod={(criteria) =>
          this.context.services.productService.fetchFromCategory(
            this.categoryName,
            criteria
          )
        }
      />
    ) : (
      <LoadingSpinner />
    );
    return (
      <>
        <h1 className="mt-5">
          Categories
          {this.categoryName ? (
            <>
              <Icon dataIcon="akar-icons:chevron-right" />
              {this.categoryName.toUpperCase()}
            </>
          ) : (
            ""
          )}
        </h1>
        {page}
      </>
    );
  }

  CategoriesList = () => {
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
  };
}
