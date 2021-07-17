import { AxiosResponse } from 'axios';
import { Component } from 'react';
import LoadingSpinner from '../components/loading/loading-spinner';
import Pagination from '../components/pagination/pagination';
import Criteria from '../models/criteria';

/**
 * Meta type used for pagination Contains currentPage and totalPages
 */
type Meta = {
  currentPage: number;
  totalPages: number;
};

/** Type for actions */
type Action = {
  /** Selector function to modify output
   * @param row Object representing the current row
   */
  selector: (row: any) => any;

  /** Method to call on click. If it returns promise, table is refreshed when resolved */
  onClick: (row: any) => Promise<any> | undefined;
};

/**
 * Class representing options for columns
 */
class Option {
  /** Header of the column */
  header: any;
  /** Key used to access the property of the object containing value */
  key: string;
  /** Selector function to modify output
   * @param value Value of the current cell
   * @param row Object representing the current row
   */
  selector: (value: any, row: any) => any = (value: any) => value;

  actions?: Action[];

  constructor(obj: Option) {
    this.header = obj.header;
    this.key = obj.key;
    this.selector = obj.selector || ((value: any) => value);
    this.actions = obj.actions;
  }
}

/**
 * Type of props received by the ListingComponent
 */
type ListingProps = {
  options: Option[];
  criteria: Criteria<any>;
  fetchMethod: (criteria: Criteria<any>) => Promise<AxiosResponse>;
};

type ComponentType<T> = { data: T[] | undefined; meta: Meta | undefined };

/**
 * Component that represents given data in a table along with pagination
 */
export default class ListingComponent<T> extends Component<
  ListingProps,
  ComponentType<T>
> {
  private options: Option[];
  criteria: Criteria<T>;

  initialState = { data: undefined, meta: undefined };

  constructor(props: ListingProps) {
    super(props);
    this.state = this.initialState;
    this.criteria = props.criteria ?? new Criteria<T>();
    this.options = props.options.map((o) => new Option(o));
  }

  componentDidMount() {
    this.fetch();
  }

  render() {
    if (!this.state.data) return <LoadingSpinner />;
    if (this.state.data.length === 0)
      return <div className="text-center">No users to display...</div>;
    return (
      <div className="d-flex flex-column">
        <table className="table table-striped table-border shadow-sm">
          <thead className="table-dark">
            <tr>
              {this.options.map((o) => (
                <th key={`t-head-${o.header}`}>{o.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.state.data?.map((d: any, i: number) => (
              <tr key={`row-${i}`}>
                {this.options.map((o, i) => (
                  <td key={`cell-${i}`}>
                    {o.actions
                      ? o.actions.map((a, i) => (
                          <span
                            key={`action-${i}`}
                            onClick={() =>
                              a.onClick
                                ? a.onClick(d)?.then(() => this.fetch())
                                : undefined
                            }>
                            {a.selector(d)}
                          </span>
                        ))
                      : o.selector(d[o.key], d)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="ml-auto">
          <Pagination
            currentPage={this.state.meta?.currentPage}
            totalPages={this.state.meta?.totalPages}
            gotoPage={(p: number) => {
              this.criteria.setPage(p);
              this.fetch();
            }}
          />
        </div>
      </div>
    );
  }

  fetch = () => {
    this.props.fetchMethod(this.criteria).then((res: AxiosResponse) => {
      const { data, meta } = res.data;
      this.setState({ ...this.state, data, meta });
    });
  };
}
