/*
	Extract the words that could be important for a search
*/

function tokenizeID(client, id) {
	// Get data, convert to object, then tokenizeData()
}

// If we already have the data available, do not re-query redis
function tokenizeData(client, id, data) {
	let promise

	// Prep data
	let problem = data.problem
	let solution = data.solution
	let keywords = data.keywords.map(keyword => {
		return keyword.toLowerCase()
	})

	let problemTokens = tokenizeString(problem)
	let solutionTokens = tokenizeString(solution)

	// In the future: store tokenization history

	// Construct a promise that provides the tokenized data
	promise = new Promise((resolve, reject) => {
		resolve({
			problemTokens: problemTokens,
			solutionTokens: solutionTokens,
			keywords: keywords
		})
	})

	return promise
}

function tokenizeString(str) {
	// Lowercase everything
	str = str.toLowerCase()

	// Turn unneeded characters into whitespace
	str = str.replace(/[^\s\da-z]|(\s)/g, ' ')

	// Get rid of unneeded words
	str = str.replace(
		/\b(the)\b|\b(and)\b|\b(is)\b|\b(to)\b|\b(by)\b|\b(is)\b|\b(in)\b|\b(with)\b/g,
		''
	)

	// Get rid of unneeded whitespace
	str = str.replace(/\s+/g, ' ')

	// Remove possible front and back spaces
	str = str.trim()

	// Tokenize
	let tokens = str.split(' ')

	return tokens
}

module.exports = {
	tokenizeID: tokenizeID,
	tokenizeData: tokenizeData,
	tokenizeString: tokenizeString
}
