// Receive query, process it, and send back the results
function query(event, client, q) {
    client.get(q, (err, result) => {
        event.sender.send('q-result', result)
    })
}

module.exports = query
