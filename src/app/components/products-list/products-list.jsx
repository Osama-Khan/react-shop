import { Component } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/app.provider';
import Criteria from '../../models/criteria';
import { productsUrl } from '../../routes';
import ProductCard from './product-card';
import LoadingSpinner from '../loading/loading-spinner';
import FilterForm from './filter-form';
import Pagination from '../pagination/pagination';
import LoadingFailed from '../loading/loading-failed';

const initialFilterState = {
  search: '',
  limit: '',
  orderBy: '',
  orderDir: 'ASC',
  priceMin: 0,
  priceMax: 100000,
  ratingMin: 0,
  showOutOfStock: true,
};

const initialState = {
  products: undefined,
  meta: undefined,
  fetching: false,
  failed: false,
  filters: initialFilterState,
};

export default class ProductsList extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.doFetch();
  }

  componentDidUpdate() {
    if (!this.state.fetching && !this.state.products && !this.state.failed) {
      this.doFetch();
    }
  }

  render() {
    let prods;

    const filterDiv = (
      <FilterForm
        state={this.state.filters}
        setState={(obj) => this.setState({ ...this.state, filters: obj })}
        onFilter={this.doFetch}
      />
    );

    const pagination = this.state.meta ? (
      <div className="mt-3 d-flex">
        <div className="ml-auto">
          <Pagination
            currentPage={this.state.meta.currentPage}
            totalPages={this.state.meta.totalPages}
            gotoPage={(p) => {
              this.setState({ ...this.state, page: p });
              this.doFetch();
            }}
          />
        </div>
      </div>
    ) : (
      <></>
    );

    if (this.state.fetching) {
      return <LoadingSpinner />;
    } else if (this.state.products?.length > 0) {
      prods = this.state.products.map((p, i) => {
        return (
          <div key={`product-${i}`} className="col-md-4 col-sm-12">
            <ProductCard product={p} />
          </div>
        );
      });
    } else if (this.state.failed) {
      prods = <LoadingFailed />;
    } else {
      const hasFilters = this.state.filters !== initialFilterState;

      return (
        <>
          {this.props.showFilters !== false ? filterDiv : <></>}
          <div className="col-md-12 text-center mt-5">
            <p className="font-weight-bold text-muted">
              No products found...{' '}
              {hasFilters ? 'Try changing the filters!' : ''}
            </p>
            {hasFilters ? (
              <button
                className="btn btn-dark mt-2"
                onClick={() => this.setState(initialState)}>
                Reset Filters
              </button>
            ) : (
              <Link to={productsUrl}>
                <button className="btn btn-dark mt-2">View All Products</button>
              </Link>
            )}
          </div>
        </>
      );
    }

    return (
      <>
        {filterDiv}
        <div id="products-list" className="row">
          {prods ? prods : <LoadingSpinner />}
        </div>
        {pagination}
      </>
    );
  }

  generateCriteria = () => {
    const filters = this.state.filters;
    const Product = require('../../models/product/product');
    const criteria = new Criteria(Product);
    if (filters?.search) {
      criteria.addFilter('title', `%25${filters.search}%25`, 'like');
    }
    if (filters?.page) {
      criteria.setPage(filters.page);
    }
    if (filters?.limit) {
      criteria.setLimit(filters.limit);
    }
    if (filters?.orderBy) {
      criteria.setOrderBy(filters.orderBy);
      criteria.setOrderDir(filters.orderDir);
    }
    if (filters?.priceMin) {
      criteria.addFilter('price', filters.priceMin, '>=');
    }
    if (filters?.priceMax && filters?.priceMax < 100000) {
      criteria.addFilter('price', filters.priceMax, '<=');
    }
    if (filters?.ratingMin) {
      criteria.addFilter('rating', filters.ratingMin, '>=');
    }
    if (!filters?.showOutOfStock) {
      criteria.addFilter('stock', 0, '>');
    }
    return criteria;
  };

  doFetch = () => {
    this.setState({ ...this.state, fetching: true });
    const method = this.props.requestMethod;
    const criteria = this.generateCriteria();
    const promise = method
      ? method(criteria)
      : this.context.services.productService.fetchProducts(criteria);
    promise
      .then((res) => {
        this.setState({
          ...this.state,
          products: res.data.data,
          meta: res.data.meta,
          fetching: false,
        });
      })
      .catch((e) =>
        this.setState({ ...this.state, failed: true, fetching: false }),
      );
  };
}
