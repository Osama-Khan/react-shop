import { Component } from 'react';
import Icon from '../icon/icon';

export default class FilterForm extends Component {
  constructor({ state, setState, onFilter }) {
    super();
    this.state = { showAdvanced: false };
  }

  render() {
    const recordOptions = [10, 20, 30, 40, 50];
    const recordOptionsEl = recordOptions.map((r) => (
      <option key={`limit-option-${r}`} value={r}>
        {r}
      </option>
    ));
    return (
      <form
        className="col-12 row align-items-center m-0 row"
        onSubmit={(e) => {
          e.preventDefault();
          this.props.onFilter();
        }}>
        <div className="form-group ml-md-auto">
          <input
            type="text"
            value={this.props.state.search}
            className="form-control"
            placeholder="Search..."
            onChange={(e) =>
              this.props.setState({
                ...this.props.state,
                search: e.target.value,
              })
            }
          />
        </div>
        <div className="form-group mx-1">
          <select
            className="form-control"
            value={this.props.state.limit}
            onChange={(e) =>
              this.props.setState({
                ...this.props.state,
                limit: e.target.value,
              })
            }>
            <option value="" disabled>
              Max Records...
            </option>
            {recordOptionsEl}
          </select>
        </div>
        <div className="form-group">
          <select
            className="form-control"
            value={this.props.state.orderBy}
            onChange={(e) =>
              this.props.setState({
                ...this.props.state,
                orderBy: e.target.value,
              })
            }>
            <option value="" disabled>
              Sort by...
            </option>
            <option value="title">Title</option>
            <option value="rating">Rating</option>
            <option value="price">Price</option>
          </select>
        </div>
        {this.props.state.orderBy ? (
          <div className="form-group mx-1">
            <button
              className={`btn m-0 ${
                this.props.state.orderDir === 'ASC'
                  ? 'btn-primary'
                  : 'btn-light'
              }`}
              disabled={this.props.state.orderDir === 'ASC'}
              onClick={(e) =>
                this.props.setState({ ...this.props.state, orderDir: 'ASC' })
              }
              title="Sort in ascending order: A-Z, 0-9">
              <Icon
                key="filter-sort-icon-asc"
                dataIcon="mdi-sort-alphabetical-ascending"
              />
            </button>
            <button
              className={`btn m-0 ${
                this.props.state.orderDir === 'DESC'
                  ? 'btn-primary'
                  : 'btn-light'
              }`}
              disabled={this.props.state.orderDir === 'DESC'}
              onClick={(e) =>
                this.props.setState({ ...this.props.state, orderDir: 'DESC' })
              }
              title="Sort in descending order: Z-A, 9-0">
              <Icon
                key="filter-sort-icon-desc"
                dataIcon="mdi-sort-alphabetical-descending"
              />
            </button>
          </div>
        ) : (
          <></>
        )}
        <div className="form-group">
          {
            <>
              <button className="btn btn-primary" onClick={this.props.onFilter}>
                Filter
              </button>
              <span
                onClick={() =>
                  this.setState({ showAdvanced: !this.state.showAdvanced })
                }
                className="text-clickable mx-2 transition fast"
                title="Show Advanced Filters">
                <Icon dataIcon="fa:chevron-down" />
              </span>
            </>
          }
        </div>
        <div
          className={`col-12 p-0 mt-0 mb-2 card ${
            this.state.showAdvanced ? '' : 'd-none'
          }`}>
          <div className="card-header">
            <h4 className="mt-2">
              Advanced Filters
              <span
                className="float-right text-clickable"
                onClick={(e) => this.setState({ showAdvanced: false })}>
                &times;
              </span>
            </h4>
          </div>
          <div className="card-body">
            <div className="row flex-row">
              <div className="form-group col-md-4">
                <label className="font-weight-bold">Price Range</label>
                <div className="row">
                  <div className="form-group col-6">
                    <label>
                      From:{' '}
                      {this.props.state.priceMin > 10000
                        ? parseInt(this.props.state.priceMin / 1000) + 'k'
                        : this.props.state.priceMin}{' '}
                      Rs.
                    </label>
                    <input
                      type="range"
                      value={this.props.state.priceMin}
                      className="form-control"
                      min="0"
                      max={this.props.state.priceMax}
                      step="100"
                      onChange={(e) => this.getMinFromInput(e)}
                    />
                  </div>
                  <div className="form-group col-6">
                    <label>
                      To:{' '}
                      {this.props.state.priceMax >= 100000
                        ? 'No limit'
                        : this.props.state.priceMax > 10000
                        ? parseInt(this.props.state.priceMax / 1000) + 'k Rs.'
                        : this.props.state.priceMax + ' Rs.'}
                    </label>
                    <input
                      type="range"
                      value={this.props.state.priceMax}
                      className="form-control"
                      min="500"
                      max="100000"
                      step="500"
                      onChange={(e) => this.getMaxFromInput(e)}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group col-md-4">
                <label className="font-weight-bold">Minimum Rating</label>
                <select
                  value={this.props.state.ratingMin}
                  onChange={(e) =>
                    this.props.setState({
                      ...this.props.state,
                      ratingMin: parseFloat(e.target.value),
                    })
                  }
                  className="form-control">
                  <option value="0">All</option>
                  <option value="0.5">0.5 Stars</option>
                  <option value="1">1 Star</option>
                  <option value="1.5">1.5 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="2.5">2.5 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="3.5">3.5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="4.5">4.5 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>
              <div className="form-group col-md-4">
                <input
                  type="checkbox"
                  className="mx-1"
                  checked={this.props.state.showOutOfStock}
                  onChange={(e) =>
                    this.props.setState({
                      ...this.props.state,
                      showOutOfStock: e.target.checked,
                    })
                  }
                />
                <label>Show out of stock</label>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }

  getMinFromInput = (e) => {
    const priceMin = parseInt(e.target.value);
    if (priceMin) {
      this.props.setState({ ...this.props.state, priceMin });
    }
  };

  getMaxFromInput = (e) => {
    const priceMax = parseInt(e.target.value);
    if (priceMax) {
      if (priceMax > this.props.state.priceMin)
        this.props.setState({ ...this.props.state, priceMax });
      else
        this.props.setState({
          ...this.props.state,
          priceMax,
          priceMin: priceMax - 500,
        });
    }
  };
}
