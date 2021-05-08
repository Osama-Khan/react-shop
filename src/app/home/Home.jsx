import React from "react";
import Carousel from "../components/carousel/Carousel";
import { Card } from "../components/card/card";
import { categoriesUrl } from "../routes";
import CategoryService from "../services/category-service.ts";
import { catIconMap } from "../../data/category-icon-map.ts";

const carouselImages = [
  "https://hackernoon.com/hn-images/1*jFyawcsqoYctkTuZg6wQ1A.jpeg",
  "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
  "https://static.scientificamerican.com/sciam/cache/file/4F73FD83-3377-42FC-915AD56BD66159FE_source.jpg?w=590&h=800&F7E1D298-3587-4BFF-AF028495DEAA9162",
];
const categoriesMeta = {
  colors: ["primary", "teal", "red", "green", "yellow", "blue"],
};

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {categories: []};
  }

  componentDidMount() {
    new CategoryService().fetchCategories().then((categories) => {
      this.setState({categories});
    });
  }

  render() {
    const cats = this.state.categories.map((c) => (
      <div key={c.id} className="col-6 col-md-4 col-lg-2">
        <Card
          text={c.name}
          icon={catIconMap[c.name]}
          iconClasses="icon-md"
          color={categoriesMeta.colors[0]}
          linkTo={`${categoriesUrl}/${c.name.toLowerCase()}`}
        />
      </div>
    ));
    return (
      <>
        <div className="row">
          <div className="mx-auto my-5 text-center">
            <h1>
              <span className="text-primary has-zap-3">
                <strong>Shop</strong>
              </span>{" "}
              like never before.
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 m-auto">
            <h4>
              <b>Featured Items</b>
            </h4>
            <div className="bg-light shadow rounded">
              <Carousel images={carouselImages} captions={[]} />
            </div>
          </div>
          <div className="col-md-12 mt-5">
            <h4>
              <b>Explore</b>
            </h4>
            <div className="row">{cats}</div>
          </div>
        </div>
      </>
    );
  }
}
