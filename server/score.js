function scoreTerm(client, term) {
	return client.zunionstoreAsync(
		term + '-scores',
		'3',
		term + '-keywords',
		term + '-problems',
		term + '-solutions',
		'WEIGHTS',
		'10',
		'3',
		'1'
	);
}

module.exports = scoreTerm;
