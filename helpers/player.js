function sendEventsToAll(data) {
  clients.forEach((client) => {
    client.response.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}
export { sendEventsToAll };
