import { Component } from "react";
import { Redirect } from "react-router-dom";
import { IconButton, PrimaryButton } from "../components/button/Button";
import Icon from "../components/icon/icon";
import LoadingSpinner from "../components/loading/loading";
import { AppContext } from "../context/app.provider";
import { userUrl } from "../routes";

export default class AddressBook extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = { addresses: undefined, defaultId: undefined };
  }

  componentDidMount() {
    const userId = this.context.state.user.id;
    this.context.services.addressService
      .getAddresses(userId)
      .then((addresses) => this.setState({ addresses }));
    this.context.services.addressService
      .getDefaultAddress(this.context.state.user.id)
      .then((u) => {
        this.setState({ defaultId: u.id });
      });
  }

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    if (!this.context.state.user.token) {
      return <Redirect to={userUrl} />;
    }
    let addressEls;
    if (!this.state.addresses || this.state.defaultId === undefined) {
      addressEls = <LoadingSpinner />;
    } else {
      addressEls = this.state.addresses?.map((a) => (
        <div
          key={`address-${a.tag}`}
          className="border border-dark rounded p-2 my-2">
          <div>
            <b>{a.tag} </b>
            {this.state.defaultId === a.id ? (
              <span className="text-muted">(Default)</span>
            ) : (
              ""
            )}
          </div>
          <p>
            {`${a.address}`}
            <span className="text-muted ml-2">
              {a.city}, {a.country}
            </span>
          </p>
        </div>
      ));
    }
    return (
      <div className="row">
        <div className="col-md-6 mx-auto mt-5 card shadow p-3 d-flex flex-column">
          <div className="top-left m-3" onClick={this.goBack}>
            <Icon classes="clickable" dataIcon="fa:arrow-left" />
          </div>
          <p className="text-center font-weight-bold">Address Book</p>
          {addressEls}
          <IconButton
            dataIcon="fa:plus"
            classes="btn-primary btn-block m-0 mt-2"
            text="Add Address"
          />
        </div>
      </div>
    );
  }
}
