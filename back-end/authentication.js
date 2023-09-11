export default class Authentication {
  #expiration_timestamp;
  #token;
  #generationOptions;
  static #instance;

  constructor(client_id, client_secret) {
    const credentials = client_id + ":" + client_secret;
    const credentialsBuffer = Buffer.alloc(credentials.length, credentials);
    const credentialsBase64 = credentialsBuffer.toString("base64");
    this.#generationOptions = {
      method: "POST",
      headers: {
        Authorization: "Basic " + credentialsBase64,
        Accept: "application/json",
        "Content-type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials`,
    };
  }

  static setInstance(client_id, client_secret) {
    Authentication.#instance = new Authentication(client_id, client_secret);
  }

  static getInstance() {
    return Authentication.#instance;
  }

  async getToken() {
    const currentDate = new Date();
    const currentTimestamp = currentDate.getTime();
    if (
      this.#token == undefined ||
      this.#expiration_timestamp + 1000 * 60 * 1 > currentTimestamp
    ) {
      await this.#setToken();
    }
    return this.#token;
  }

  async #setToken() {
    const response = await fetch(
      "https://accounts.spotify.com/api/token",
      this.#generationOptions
    );
    const jsonResponse = await response.json();
    const currentDate = new Date();
    this.#expiration_timestamp = currentDate + jsonResponse.expires_in * 1000;
    this.#token = jsonResponse.access_token;
  }
}
