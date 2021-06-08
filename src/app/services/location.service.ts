import axios from "axios";
import ApiService from "./api.service";

export default class LocationService extends ApiService {
  endpoint = `${this.domain}`

  async getCountries() {
    const res = await axios.get(`${this.endpoint}/countries?limit=1000000`);
    return res.data;
  }

  async getStates(countryId?: number) {
    const filter = countryId ? `&filters=country=${countryId}` : undefined;
    const res = await axios.get(`${this.endpoint}/states?limit=1000000${filter || ""}`);
    return res.data;
  }

  async getCities(stateId?: number) {
    const filter = stateId ? `&filters=state=${stateId}` : undefined;
    const res = await axios.get(`${this.endpoint}/cities?limit=1000000${filter || ""}`);
    return res.data;
  }
}