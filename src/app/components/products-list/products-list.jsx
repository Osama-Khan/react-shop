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
  page: 1,
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

  componentDidUpdate(_, prevState) {
    const noData = !this.state.products && !this.state.failed;
    const isFetching = this.state.fetching;
    const pageChange = this.state.filters.page !== prevState.filters.page;
    // Fetch products if data does not exist or filters have been updated
    if (!isFetching && (noData || pageChange)) {
      this.doFetch();
    }
  }

  render() {
    // The FilterForm component used for product filtering
    const filterDiv = (
      <FilterForm
        state={this.state.filters}
        setState={(obj) => this.setState({ ...this.state, filters: obj })}
        onFilter={() => this.doFetch()}
      />
    );

    // The pagination element for page navigation
    const pagination = this.state.meta ? (
      <div className="mt-3 d-flex">
        <div className="ml-auto">
          <Pagination
            currentPage={this.state.meta.currentPage}
            totalPages={this.state.meta.totalPages}
            gotoPage={(p) => {
              this.setState({
                ...this.state,
                filters: { ...this.state.filters, page: p },
              });
            }}
          />
        </div>
      </div>
    ) : (
      <></>
    );

    // If fetching is in progress, return a loading spinner
    if (this.state.fetching) {
      return <LoadingSpinner />;
    }

    // If fetching fails, show LoadingFailed component
    if (this.state.failed) {
      return <LoadingFailed />;
    }

    // If products exist, show a list of products
    if (this.state.products?.length > 0) {
      const prods = this.state.products.map((p, i) => {
        return (
          <div key={`product-${i}`} className="col-md-4 col-sm-12">
            <ProductCard product={p} />
          </div>
        );
      });
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

    // Otherwise, show a no products found view
    const hasFilters = this.state.filters !== initialFilterState;

    return (
      <>
        {this.props.showFilters !== false ? filterDiv : <></>}
        <div className="col-md-12 text-center mt-5">
          <p className="font-weight-bold text-muted">
            No products found... {hasFilters ? 'Try changing the filters!' : ''}
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

  /** Uses the filters in current state to create a criteria object */
  generateCriteria = () => {
    const filters = this.state.filters;
    const criteria = new Criteria();
    criteria.setPage(filters.page);
    if (filters?.search) {
      criteria.addFilter('title', `%25${filters.search}%25`, 'like');
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

  /** Initiates fetch request */
  doFetch = () => {
    this.setState({ ...this.state, fetching: true });

    const criteria = this.generateCriteria();
    // The method provided in props, used to fetch products
    const method = this.props.requestMethod;
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
