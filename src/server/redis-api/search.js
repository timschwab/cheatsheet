const tokenizeHandler = require('./tokenize');
const getHandler = require('./get');

function searchSnippet(client, query) {
	let promise, snippets;

	query = query.toLowerCase();

	// Tokenize the query
	let terms = tokenizeHandler.tokenizeString(query);

	// Translate into the set names
	let sets = terms.map(term => {
		return term + '-scores';
	});

	// Load the pre-calculated term scores into ~~results
	promise = client
		.zunionstoreAsync(['~~results', sets.length].concat(sets))

		// Then get them in order, with the score
		.then(result => {
			return client.zrevrangebyscoreAsync(
				'~~results',
				'+inf',
				'1',
				'WITHSCORES',
				'LIMIT',
				'0',
				'25'
			);
		})

		.then(results => {
			// Separate out IDs and scores
			snippets = results.reduce((soFar, nextValue, index) => {
				if (index % 2) {
					soFar[soFar.length - 1].score = nextValue;
				} else {
					soFar.push({id: nextValue});
				}

				return soFar;
			}, []);

			// Get all the snippets
			let getPromises = snippets.map(snippet => {
				return getHandler.get(client, snippet.id);
			});

			return Promise.all(getPromises);
		})

		// Parse and return
		.then(responses => {
			let parsed = responses.map((snippet, index) => {
				snippet.score = snippets[index].score;
				return snippet;
			});

			// Construct a promise that returns the parsed data
			return Promise.resolve(parsed);
		});

	return promise;
}

module.exports.search = searchSnippet;
