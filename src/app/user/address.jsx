import { Component } from "react";
import { Redirect } from "react-router-dom";
import Icon from "../components/icon/icon";
import LoadingSpinner from "../components/loading/loading";
import Modal from "../components/popup/modal";
import { AppContext } from "../context/app.provider";
import { userUrl } from "../routes";

export default class AddressBook extends Component {
  static contextType = AppContext;

  addData = {
    tag: undefined,
    address: undefined,
    country: undefined,
    state: undefined,
    city: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      addresses: undefined,
      defaultAddress: undefined,
      selectedAddress: undefined,
      countries: undefined,
      states: undefined,
      cities: undefined,
    };
  }

  componentDidMount() {
    const userId = this.context.state.user.id;
    if (userId) {
      this.context.services.addressService
        .getAddresses(userId)
        .then((addresses) => this.setState({ ...this.state, addresses }));
      this.context.services.settingService
        .getDefaultAddress(this.context.state.user.id)
        .then((defaultAddress) => {
          defaultAddress = defaultAddress || {};
          this.setState({
            ...this.state,
            defaultAddress,
            selectedAddress: defaultAddress,
          });
        })
        .catch((e) => {});
      this.context.services.locationService.getCountries().then((countries) => {
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
              onClick={this.deleteAddress(a)}>
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
            {this.changeDefaultAddressModal()}
            {this.addAddressModal()}
          </div>
        </div>
      </div>
    );
  }

  changeDefaultAddressModal() {
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

    return (
      <Modal
        title="Change Default Address"
        content={
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
        }
        trigger={
          <div className="ml-auto btn btn-dark-outline">Change Default</div>
        }
        hasClose={true}
        primaryAction={this.changeDefaultAddress}
        primaryActionText="Save"
        secondaryAction={() => {
          this.setState({
            ...this.state,
            selectedAddress: this.state.defaultAddress,
          });
        }}
        secondaryActionText="Discard"
      />
    );
  }

  changeDefaultAddress = () => {
    const svc = this.context.services.settingService;
    svc
      .setDefaultAddress(
        this.context.state.user.id,
        this.state.selectedAddress.id
      )
      .then((defaultAddress) => {
        this.setState({ ...this.state, defaultAddress });
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

  addAddressModal() {
    return (
      <Modal
        title="Add Address"
        content={this.addAddressForm()}
        trigger={<div className="btn btn-dark-outline">Add Address</div>}
        hasClose={true}
        primaryAction={this.addAddress}
        primaryActionText="Add"
        secondaryAction={() => {}}
        secondaryActionText="Close"
      />
    );
  }

  addAddressForm() {
    const [countries, states, cities] = [
      this.state.countries,
      this.state.states,
      this.state.cities,
    ];
    const countryOptions = countries ? (
      [
        <option disabled selected>
          Select a country...
        </option>,
        ...countries.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        )),
      ]
    ) : (
      <option disabled>Loading...</option>
    );
    const stateOptions = states ? (
      [
        <option disabled selected>
          Select a state...
        </option>,
        ...states.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        )),
      ]
    ) : (
      <option disabled>Loading...</option>
    );
    const cityOptions = cities ? (
      [
        <option disabled selected>
          Select a city...
        </option>,
        ...cities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        )),
      ]
    ) : (
      <option disabled>Loading...</option>
    );
    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>Tag</label>
          <input
            className="form-control"
            value={this.addData.tag}
            onChange={(e) => (this.addData.tag = e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            className="form-control"
            value={this.addData.address}
            onChange={(e) => (this.addData.address = e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Country</label>
          <select className="form-control" onChange={this.onCountryChange}>
            {countryOptions}
          </select>
        </div>
        {states ? (
          states.length > 0 ? (
            <div className="form-group">
              <label>State</label>
              <select className="form-control" onChange={this.onStateChange}>
                {stateOptions}
              </select>
            </div>
          ) : (
            <p className="text-center text-muted">This country has no states</p>
          )
        ) : (
          <></>
        )}
        {cities ? (
          cities.length > 0 ? (
            <div className="form-group">
              <label>City</label>
              <select
                className="form-control"
                value={this.addData.city}
                onChange={(e) =>
                  (this.addData.city = parseInt(e.target.value))
                }>
                {cityOptions}
              </select>
            </div>
          ) : (
            <p className="text-center text-muted">This state has no cities</p>
          )
        ) : (
          <></>
        )}
      </form>
    );
  }

  addAddress = () => {
    // Todo: Handling countries with no states or states with no cities
    const svc = this.context.services.uiService;
    const [errorToast, promiseToast] = [svc.errorToast, svc.promiseToast];
    const address = {
      tag: this.addData.tag,
      address: this.addData.address,
      city: this.addData.city,
      user: this.context.state.user.id,
    };
    if (!address.tag) {
      errorToast("Please enter a tag");
      return false;
    } else if (!address.address) {
      errorToast("Please enter an address");
      return false;
    } else if (
      !this.state.countries ||
      !this.state.states ||
      !this.state.cities ||
      !address.city
    ) {
      errorToast("Please select a location");
      return false;
    }
    const promise = this.context.services.addressService.addAddress(address);
    promiseToast(promise, {
      loading: "Adding the address...",
      success: "Congrats, You've got a new address!",
      error: "Oops, that didn't work. Try again!  ",
    });
    promise.then((address) => {
      this.setState({
        ...this.state,
        addresses: [...this.state.addresses, address],
      });
    });
    return true;
  };

  deleteAddress = (a) => {
    // TODO: Add deletion
  };

  onCountryChange = (e) => {
    const id = parseInt(e.target.value);
    if (
      this.state.countries &&
      this.state.countries.filter((c) => c.id === id).length > 0
    ) {
      this.addData.city = undefined;
      this.setState({ ...this.state, states: undefined, cities: undefined });
      this.context.services.locationService
        .getStates(id)
        .then((states) => this.setState({ ...this.state, states }));
    }
  };

  onStateChange = (e) => {
    const id = parseInt(e.target.value);
    if (
      this.state.states &&
      this.state.states.filter((c) => c.id === id).length > 0
    ) {
      this.addData.city = undefined;
      this.setState({ ...this.state, cities: undefined });
      this.context.services.locationService.getCities(id).then((cities) => {
        this.addData.city = cities[0];
        this.setState({ ...this.state, cities });
      });
    }
  };
}
