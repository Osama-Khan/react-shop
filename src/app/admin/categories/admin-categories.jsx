import { Component } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/app.provider';
import { categoriesUrl } from '../../routes';
import ListingComponent from '../listing-component.tsx';

export default class AdminCategories extends Component {
  static contextType = AppContext;
  listingColumnOptions = [
    {
      header: 'ID',
      key: 'id',
    },
    {
      header: 'Name',
      key: 'name',
      selector: (v) => <Link to={`${categoriesUrl}/${v}`}>{v}</Link>,
    },
  ];

  render() {
    return (
      <div className="mt-5 card">
        <h3 className="card-header">
          <span
            className="mr-2 text-clickable"
            onClick={this.props.history.goBack}>
            &larr;
          </span>
          Manage Categories
        </h3>
        <div className="card-body">
          <div className="d-flex flex-column">
            <ListingComponent
              options={this.listingColumnOptions}
              fetchMethod={(crit) =>
                this.context.services.categoryService.fetchCategories(crit)
              }
            />
          </div>
        </div>
      </div>
    );
  }
}
