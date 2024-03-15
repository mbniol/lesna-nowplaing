function sendEventsToAll(clients, data) {
  
  clients.forEach((client) => {
    client.response.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}
export { sendEventsToAll };
