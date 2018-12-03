/*
	Extract the words that could be important for a search
*/

function tokenize(str) {
	// Lowercase everything
	str = str.toLowerCase()

	// Turn unneded characters into whitespace
	str = str.replace(/[^\s\da-z]|(\s)/g, ' ')

	// Get rid of unneeded words
	str = str.replace(/\b(the)\b|\b(and)\b|\b(is)\b|\b(to)\b|\b(by)\b|\b(is)\b|\b(in)\b|\b(with)\b/g, '')

	// Get rid of unneeded whitespace
	str = str.replace(/\s+/g, ' ')

	// Remove possible front and back spaces
	str = str.trim()

	// Tokenize
	let tokens = str.split(' ')

	return tokens
}

module.exports = tokenize