export default class Auth {
  // #expiration_timestamp;
  #tokens = {
    sdk: {
      expiration_date: undefined,
      access: undefined,
      refresh: undefined,
    },
    api: {
      expiration_date: undefined,
      access: undefined,
    },
  };
  #APITokenOptions;
  #authorizationParams;
  #credentialsBase64;
  // #sdk_redirect_uri;
  static #instance;

  constructor(client_id, client_secret /*redirect_uri*/) {
    const credentials = client_id + ":" + client_secret;
    const credentialsBuffer = Buffer.alloc(credentials.length, credentials);
    this.#credentialsBase64 = credentialsBuffer.toString("base64");
    // this.#sdk_redirect_uri = redirect_uri;
    this.#setAPITokenOptions();
    this.#setAuthorizationParams(client_id);
  }

  #getSDKTokenOptions(code, uri) {
    const queryParams = new URLSearchParams({
      code: code,
      grant_type: "authorization_code",
      redirect_uri: uri,
    });
    return {
      method: "POST",
      headers: {
        Authorization: "Basic " + this.#credentialsBase64,
        Accept: "application/json",
        "Content-type": "application/x-www-form-urlencoded",
      },
      body: queryParams.toString(),
    };
  }

  #getSDKTokenRefreshOptions() {
    const queryParams = new URLSearchParams({
      refresh_token: this.#tokens.sdk.refresh,
      grant_type: "refresh_token",
    });
    return {
      method: "POST",
      headers: {
        Authorization: "Basic " + this.#credentialsBase64,
        Accept: "application/json",
        "Content-type": "application/x-www-form-urlencoded",
      },
      body: queryParams.toString(),
    };
  }

  #setAPITokenOptions() {
    const queryParams = new URLSearchParams({
      grant_type: "client_credentials",
    });
    this.#APITokenOptions = {
      method: "POST",
      headers: {
        Authorization: "Basic " + this.#credentialsBase64,
        Accept: "application/json",
        "Content-type": "application/x-www-form-urlencoded",
      },
      body: queryParams.toString(),
    };
  }

  #setAuthorizationParams(client_id) {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: client_id,
      scope: "streaming  user-read-email  user-read-private",
    });

    this.#authorizationParams = params.toString();
  }

  #getAutorizationParams(redirect) {
    const temporaryParams = new URLSearchParams(this.#authorizationParams);
    temporaryParams.append("redirect_uri", redirect);
    return temporaryParams.toString();
  }

  static setInstance(client_id, client_secret, redirect_uri) {
    Auth.#instance = new Auth(client_id, client_secret, redirect_uri);
  }

  static getInstance() {
    return Auth.#instance;
  }

  async getAPIToken() {
    const currentDate = new Date();
    const currentTimestamp = currentDate.getTime();
    if (
      this.#tokens.api.access == undefined ||
      this.#tokens.api.expiration_date < currentTimestamp + 1000 * 60 * 1
    ) {
      await this.#setAPIToken();
    }
    return this.#tokens.api.access;
  }

  async loginUser(res, redirect) {
    res.redirect(
      "https://accounts.spotify.com/authorize/?" +
        this.#getAutorizationParams(redirect)
    );
  }

  async getSDKToken(code, uri) {
    const currentDate = new Date();
    const currentTimestamp = currentDate.getTime();
    if (
      (this.#tokens.sdk.access === undefined || this.#tokens.sdk.refresh) &&
      code
    ) {
      const tokenOptions = this.#getSDKTokenOptions(code, uri);
      await this.#setSDKToken(tokenOptions);
    } else if (
      this.#tokens.sdk.expiration_date < currentTimestamp + 1000 * 60 * 1 &&
      this.#tokens.refresh !== undefined
    ) {
      const tokenOptions = this.#getSDKTokenRefreshOptions();
      await this.#setSDKToken(tokenOptions);
    }
    return this.#tokens.sdk.access;
  }

  async #setSDKToken(tokenOptions) {
    try {
      const response = await fetch(
        "https://accounts.spotify.com/api/token",
        tokenOptions
      );
      const jsonResponse = await response.json();
      const currentDate = new Date();
      // this.#expiration_timestamp = currentDate + jsonResponse.expires_in * 1000;
      this.#tokens.sdk = {
        expiration_date: currentDate.getTime() + jsonResponse.expires_in * 1000,
        access: jsonResponse.access_token,
        refresh: jsonResponse.refresh_token,
      };
      console.log(jsonResponse);
    } catch (e) {
      console.error(e);
    }
  }

  async #setAPIToken() {
    const response = await fetch(
      "https://accounts.spotify.com/api/token",
      this.#APITokenOptions
    );
    const jsonResponse = await response.json();
    const currentDate = new Date();
    this.#tokens.api = {
      expiration_date: currentDate.getTime() + jsonResponse.expires_in * 1000,
      access: jsonResponse.access_token,
    };
  }
}
