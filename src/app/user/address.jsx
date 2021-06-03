import { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Icon from "../components/icon/icon";
import LoadingSpinner from "../components/loading/loading";
import { AppContext } from "../context/app.provider";
import { userUrl } from "../routes";

export default class AddressBook extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = { addresses: undefined };
  }

  componentDidMount() {
    const userId = this.context.state.user.id;
    this.context.services.userService
      .getAddresses(userId)
      .then((addresses) => this.setState({ addresses }));
  }

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    if (!this.context.state.user.token) {
      return <Redirect to={userUrl} />;
    }
    let addressEls = this.state.addresses?.map((a) => (
      <div
        key={`address-${a.tag}`}
        className="border border-dark rounded p-2 my-2">
        <b>{a.tag}</b>
        <p>{a.address}</p>
      </div>
    ));
    addressEls = addressEls || <LoadingSpinner />;
    return (
      <div className="row">
        <div className="col-md-6 mx-auto mt-5 card shadow p-3 d-flex flex-column">
          <div className="top-left m-3" onClick={this.goBack}>
            <Icon classes="clickable" dataIcon="fa:arrow-left" />
          </div>
          <p className="text-center font-weight-bold">Address Book</p>
          {addressEls}
        </div>
      </div>
    );
  }
}
