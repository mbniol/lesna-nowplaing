function sendEventsToAll(clients, data) {
  console.log(clients, 'sendall')
  clients.forEach((client) => {
    client.response.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}
export { sendEventsToAll };
