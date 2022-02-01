export default class ApiService {
  protected domain = `http://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}`;
}
