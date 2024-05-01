export class EventTarget {
  static #eventTargets = {};
  #clients = [];

  constructor() {
    this.#clients = [];
  }

  static createInstance(key) {
    if (!EventTarget.#eventTargets[key]) {
      EventTarget.#eventTargets[key] = new EventTarget();
    }
    console.log(EventTarget.#eventTargets);
    return EventTarget.#eventTargets[key];
  }

  static getInstance(key) {
    return EventTarget.#eventTargets[key] || EventTarget.createInstance(key);
  }

  async addNewClient(req, res) {
    // console.log("open");
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };
    res.writeHead(200, headers);

    const clientId = Math.random();

    const newClient = {
      id: clientId,
      response: res,
    };
    console.log(EventTarget.getInstance("voters"), this);
    this.#clients.push(newClient);

    req.on("close", () => {
      this.#clients = this.#clients.filter((client) => client.id !== clientId);
    });
  }

  async sendToAll(data) {
    this.#clients.forEach((client) => {
      client.response.write(`data: ${JSON.stringify(data)}\n\n`);
    });
  }
}
