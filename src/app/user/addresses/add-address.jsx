import { Component } from "react";
import Icon from "../../components/icon/icon";
import { AppContext } from "../../context/app.provider";

export default class AddAddress extends Component {
  static contextType = AppContext;

  constructor() {
    super();
    this.state = {
      countries: undefined,
      states: undefined,
      cities: undefined,
      addData: {
        tag: undefined,
        address: undefined,
        country: undefined,
        state: undefined,
        city: undefined,
      },
    };
  }

  componentDidMount() {
    this.context.services.locationService.getCountries().then((res) => {
      const countries = res.data.data;
      this.setState({ ...this.state, countries });
    });
  }

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    return (
      <div className="row">
        <div className="col-md-6 mx-auto mt-5 card shadow p-3 d-flex flex-column">
          <div className="top-left m-3" onClick={this.goBack}>
            <Icon classes="clickable" dataIcon="fa:arrow-left" />
          </div>
          <p className="text-center font-weight-bold">Address Book</p>
          <div>{this.addAddressForm()}</div>
        </div>
      </div>
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
        <option disabled value="-1">
          Select a country...
        </option>,
        ...countries.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        )),
      ]
    ) : (
      <option disabled value="-1">
        Loading...
      </option>
    );
    const stateOptions = states ? (
      [
        <option disabled value="-1">
          Select a state...
        </option>,
        ...states.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        )),
      ]
    ) : (
      <option disabled value="-1">
        Loading...
      </option>
    );
    const cityOptions = cities ? (
      [
        <option disabled value="-1">
          Select a city...
        </option>,
        ...cities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        )),
      ]
    ) : (
      <option disabled value="-1">
        Loading...
      </option>
    );
    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>Tag</label>
          <input
            className="form-control"
            value={this.state.addData.tag}
            onChange={(e) =>
              this.setState({
                ...this.state,
                addData: { ...this.state.addData, tag: e.target.value },
              })
            }
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            className="form-control"
            value={this.state.addData.address}
            onChange={(e) =>
              this.setState({
                ...this.state,
                addData: { ...this.state.addData, address: e.target.value },
              })
            }
          />
        </div>
        <div className="form-group">
          <label>Country</label>
          <select
            className="form-control"
            onChange={this.onCountryChange}
            defaultValue="-1">
            {countryOptions}
          </select>
        </div>
        {states ? (
          states.length > 0 ? (
            <div className="form-group">
              <label>State</label>
              <select
                className="form-control"
                onChange={this.onStateChange}
                defaultValue="-1">
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
                value={this.state.addData.city}
                onChange={(e) =>
                  this.setState({
                    ...this.state,
                    addData: {
                      ...this.state.addData,
                      city: parseInt(e.target.value),
                    },
                  })
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
        <div className="row m-0">
          <button
            className="btn btn-primary ml-auto"
            disabled={!this.isValid()}
            onClick={() => (this.isValid() ? this.addAddress() : {})}>
            Add address
          </button>
        </div>
      </form>
    );
  }

  addAddress = () => {
    // Todo: Handling countries with no states or states with no cities
    const svc = this.context.services.uiService;
    const [errorToast, promiseToast] = [svc.errorToast, svc.promiseToast];
    const address = {
      tag: this.state.addData.tag,
      address: this.state.addData.address,
      country: this.state.addData.country,
      state: this.state.addData.state,
      city: this.state.addData.city,
      user: this.context.state.user.id,
    };
    if (!address.tag) {
      errorToast("Please enter a tag");
      return false;
    } else if (!address.address) {
      errorToast("Please enter an address");
      return false;
    } else if (!address.country || !address.state || !address.city) {
      errorToast("Please select a location");
      return false;
    }
    const promise = this.context.services.addressService.addAddress(address);
    promiseToast(promise, {
      loading: "Adding the address...",
      success: "Congrats, You've got a new address!",
      error: "Oops, that didn't work. Try again!  ",
    });
  };

  onCountryChange = (e) => {
    const id = parseInt(e.target.value);
    if (
      this.state.countries &&
      this.state.countries.filter((c) => c.id === id).length > 0
    ) {
      this.setState({
        ...this.state,
        states: undefined,
        cities: undefined,
        addData: { ...this.state.addData, city: undefined, country: id },
      });
      this.context.services.locationService.getStates(id).then((res) => {
        const states = res.data.data;
        this.setState({ ...this.state, states });
      });
    }
  };

  onStateChange = (e) => {
    const id = parseInt(e.target.value);
    if (
      this.state.states &&
      this.state.states.filter((c) => c.id === id).length > 0
    ) {
      this.setState({
        ...this.state,
        cities: undefined,
        addData: { ...this.state.addData, city: undefined, state: id },
      });
      this.context.services.locationService.getCities(id).then((res) => {
        const cities = res.data.data;
        this.setState({
          ...this.state,
          cities,
          addData: { ...this.state.addData, city: cities[0] },
        });
      });
    }
  };

  isValid = () =>
    this.state.addData.address &&
    this.state.addData.tag &&
    this.state.addData.country &&
    this.state.addData.state &&
    this.state.addData.city;
}
