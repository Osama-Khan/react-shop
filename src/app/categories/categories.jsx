import { Component } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/app.provider";
import { categoriesUrl } from "../routes";
import Criteria from "../models/criteria";
import LoadingSpinner from "../components/loading/loading-spinner";
import ProductsList from "../components/products-list/products-list";
import Icon from "../components/icon/icon";

export default class Categories extends Component {
  static contextType = AppContext;

  categoryName;

  constructor(props) {
    super(props);
    this.state = { categories: undefined, selectedStack: [] };

    this.categoryName = props.match.params.name;
  }

  componentDidMount() {
    if (!this.categoryName) {
      const criteria = new Criteria();
      criteria.addRelation("childCategories");
      criteria.addRelation("parentCategory");
      criteria.setLimit(10000);
      this.context.services.categoryService
        .fetchCategories(criteria)
        .then((res) => {
          this.setState({ ...this.state, categories: res.data.data });
        });
    }
  }

  render() {
    const rootCategories = this.state.categories?.filter(
      (c) => !c.parentCategory
    );
    const page = this.state.categories ? (
      <this.CategoriesList categories={rootCategories} />
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
            <>:&nbsp;{this.categoryName.toUpperCase()}</>
          ) : (
            ""
          )}
        </h1>
        {page}
      </>
    );
  }

  CategoriesList = ({ categories, level = 0 }) => {
    const isRoot = level === 0;
    const isTop = level === this.state.selectedStack.length;
    const mainCats = categories.map((c) => {
      const isLeaf = c.childCategories.length === 0;
      const isSelected = this.state.selectedStack.some((sc) => sc.id === c.id);

      return (
        <div key={c.id} className="col-6 col-md-4 col-lg-2">
          <div
            className={`card p-0 my-2 transition ${
              isSelected
                ? "bg-dark text-light shadow font-weight-bold"
                : `shadow-sm${!isTop ? " opacity-3" : ""}`
            }`}>
            <div className="row mx-0">
              <Link
                className={"py-3 ml-2 flex-grow-1 anchor-color-remover"}
                to={`${categoriesUrl}/${c.name.toLowerCase()}`}>
                {c.name}
              </Link>
              {!isLeaf && !isSelected ? (
                <div
                  className="text-clickable px-2 d-flex align-items-center border-left"
                  onClick={() => {
                    let selectedStack = this.state.selectedStack;
                    // If level is less than stack level, a category was selected under the current level
                    // In that case, we should remove all categories above the level
                    if (level < selectedStack.length) {
                      selectedStack = selectedStack.slice(0, level);
                    }
                    selectedStack.push(c);
                    this.setState({ ...this.state, selectedStack });
                  }}>
                  <Icon dataIcon="fa:chevron-down" />
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      );
    });
    const cat = this.state.selectedStack[level];
    const subCats = cat ? (
      <this.CategoriesList
        key={level}
        categories={this.getChildren(cat.id)}
        level={level + 1}
      />
    ) : (
      <></>
    );
    return (
      <>
        {!isRoot ? <hr /> : ""}
        <div className="row mt-5">{mainCats}</div>
        {subCats}
      </>
    );
  };

  /**
   * Gets children of a category from the state categories
   * @param {number} parentId ID of the parent to get children of
   * @returns A list of categories that are direct children of the given parent
   */
  getChildren(parentId) {
    return this.state.categories.filter(
      (c) => c.parentCategory?.id === parentId
    );
  }
}
