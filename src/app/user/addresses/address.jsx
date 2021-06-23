import { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Icon from "../../components/icon/icon";
import LoadingSpinner from "../../components/loading/loading";
import { AppContext } from "../../context/app.provider";
import { addAddressUrl, userUrl } from "../../routes";

export default class AddressBook extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      addresses: undefined,
      defaultAddress: undefined,
      selectedAddress: undefined,
    };
  }

  componentDidMount() {
    const userId = this.context.state.user.id;
    if (userId) {
      this.context.services.addressService.getAddresses(userId).then((res) => {
        const addresses = res.data?.data;
        this.setState({ ...this.state, addresses });
      });
      this.context.services.settingService
        .getDefaultAddress(this.context.state.user.id)
        .then((res) => {
          const defaultAddress = res.data || {};
          this.setState({
            ...this.state,
            defaultAddress,
            selectedAddress: defaultAddress,
          });
        })
        .catch((e) => {});
      this.context.services.locationService.getCountries().then((res) => {
        const countries = res.data.data;
        this.setState({ ...this.state, countries });
      });
    }
  }

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    if (!this.context.state.user.token) {
      return <Redirect to={userUrl} />;
    }
    let addressEls;
    if (!this.state.addresses || this.state.defaultAddress === undefined) {
      addressEls = <LoadingSpinner />;
    } else {
      addressEls = this.state.addresses?.map((a) => {
        const isDefault = this.state.defaultAddress.id === a.id;
        const cardClasses = isDefault
          ? "bg-dark text-light"
          : "border border-dark";
        return (
          <div
            key={`address-${a.tag}`}
            className={`${cardClasses} rounded p-2 my-2`}>
            <div
              className="p-1 m-0 float-right text-red text-clickable"
              onClick={() => this.deleteAddress(a)}>
              <Icon dataIcon="fa:trash" />
            </div>
            <div>
              <b>{a.tag} </b>
              {isDefault ? (
                <span className="ml-1 text-muted">(Default)</span>
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
        );
      });
    }

    return (
      <div className="row">
        <div className="col-md-6 mx-auto mt-5 card shadow p-3 d-flex flex-column">
          <div className="top-left m-3" onClick={this.goBack}>
            <Icon classes="clickable" dataIcon="fa:arrow-left" />
          </div>
          <p className="text-center font-weight-bold">Address Book</p>
          {addressEls.length > 0 ? (
            addressEls
          ) : (
            <p className="text-center text-muted">
              You don't have any addresses :(
            </p>
          )}
          <div className="row m-0">
            {this.changeAddressButton()}
            <Link to={addAddressUrl}>
              <div className="btn btn-dark">Add Address</div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  changeAddressButton() {
    const addressOptions = this.state.addresses?.map((a) => (
      <option key={a.id} value={a.id}>
        [{a.tag.toUpperCase()}] - {a.address} - {a.city}, {a.country}
      </option>
    ));
    if (!this.state.addresses || !this.state.selectedAddress) {
      return <></>;
    }
    if (addressOptions.length === 0) {
      return (
        <button
          data-toggle="tooltip"
          title="You don't have any address"
          className="btn btn-dark-outline ml-auto"
          disabled>
          Change default
        </button>
      );
    }

    const defAddressForm = (
      <div>
        <div className="form-group">
          <label>New default address: </label>
          <select
            value={this.state.selectedAddress.id}
            className="form-control ml-1"
            onChange={this.onChangeDefaultAddress}>
            {addressOptions}
          </select>
        </div>
      </div>
    );

    const resolver = (res) => {
      if (res.isConfirmed) {
        this.changeDefaultAddress();
      } else {
        this.setState({
          ...this.state,
          selectedAddress: this.state.defaultAddress,
        });
      }
    };

    const modal = this.context.services.uiService.htmlModal;
    return (
      <div
        className="ml-auto btn btn-dark-outline"
        onClick={() =>
          modal(
            "Change Default Address",
            defAddressForm,
            "",
            true,
            "Save"
          ).then(resolver)
        }>
        Change Default
      </div>
    );
  }

  changeDefaultAddress = () => {
    const svc = this.context.services.settingService;
    svc
      .setDefaultAddress(
        this.context.state.user.id,
        this.state.selectedAddress.id
      )
      .then((setting) => {
        svc.getDefaultAddress(this.context.state.user.id).then((res) => {
          const defaultAddress = res.data;
          this.setState({ ...this.state, defaultAddress });
        });
      });
    return true;
  };

  onChangeDefaultAddress = (e) => {
    const selectedAddress = this.state.addresses.find(
      (a) => a.id.toString() === e.target.value
    );
    if (!selectedAddress) {
      this.context.services.uiService.errorToast(
        "Selected address doesn't exist"
      );
      return;
    }
    this.setState({ ...this.state, selectedAddress });
  };

  deleteAddress = (a) => {
    const uiSvc = this.context.services.uiService;
    uiSvc
      .confirmModal(
        `Deleting ${a.tag}`,
        `Are you sure you want to delete the address ${a.tag}?`,
        "warning",
        true,
        "Delete"
      )
      .then((isConfirmed) => {
        if (isConfirmed) {
          const promise = this.context.services.addressService
            .deleteAddress(a.id)
            .then(() =>
              this.setState({
                ...this.state,
                addresses: this.state.addresses.filter(
                  (addr) => addr.id !== a.id
                ),
              })
            );
          uiSvc.promiseToast(promise, {
            loading: "Deleting address...",
            success: "Address deleted!",
            error: "Could not delete address, try again.",
          });
        }
      });
  };
}
