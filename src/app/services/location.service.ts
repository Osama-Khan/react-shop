import axios from "axios";
import Criteria from "../models/criteria";
import ApiService from "./api.service";

export default class LocationService extends ApiService {
  endpoint = this.domain;

  async getCountries(criteria?: Criteria<any>) {
    if (!criteria) {
      criteria = new Criteria();
      criteria.setLimit(1000000);
    }
    const res = await axios.get(
      `${this.endpoint}/countries${criteria.getUrlParameters()}`
    );
    return res.data;
  }

  async getStates(countryId?: number, criteria?: Criteria<any>) {
    if (!criteria) {
      criteria = new Criteria();
      criteria.setLimit(1000000);
    }
    criteria.addFilter("country", countryId);
    const res = await axios.get(
      `${this.endpoint}/states${criteria.getUrlParameters()}`
    );
    return res.data;
  }

  async getCities(stateId?: number, criteria?: Criteria<any>) {
    if (!criteria) {
      criteria = new Criteria();
      criteria.setLimit(1000000);
    }
    criteria.addFilter("state", stateId);
    const res = await axios.get(
      `${this.endpoint}/cities${criteria.getUrlParameters()}`
    );
    return res.data;
  }
}
