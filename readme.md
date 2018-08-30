# Overview

A collection of short tidbits that I need to remember

standalone first - electron - https://github.com/electron/electron-quick-start

Slack app second

# Installation

	git clone git@github.com:timschwab/cheatsheet.git
	npm install
	npm start

# Data

three sets of redis sets

- every keyword
	- [keyword]-keywords
	- [keyword]-problems
	- [keyword]-solutions

The search page has a redis sorted set "\~\~search" of every matching tidbit with their score. With a new word, this list is updated with the various searches that are done. When finished updating, the page is updated with the most recent list.

JSON data structure

- settings
	- list of ignored words
	- list of allowed characters in tokens
- sheet
	- keywords
	- brief problem description (limited to 200 characters)
	- brief solution (limited to 1000 characters. any more is not suited for this tool.)

# Use cases

four main cases (CRUD), four rare cases

- create a snippet
	- type in problem description
	- type in solution
	- specify what sheets to attach to
	- asks for keywords
	- adds its own keywords from the problem and solution description
		- lowercase everything
		- turn unneeded characters into whitespace
			- replace(/[^\.\s\da-z]|(\.\s)/g, " ") - from list of allowed characters
		- get rid of unneeded words
			- replace(/\b(the)\b|\b(and)\b|\b(is)\b|\b(to)\b|\b(by)\b|\b(is)\b|\b(in)\b|\b(with)\b/g, "") - built from list of ignored words
		- get rid of unneeded whitespace
			- replace(/\s+/g, " ")
		- end up with just tokens separated by spaces
			- split(" ")
	- weights of keywords
		- manually inputted keyword - 10
		- from problem description - 3
		- from solution - 1
	- adds to json knowledge base and redis sets
	- push changes to remote sheet
- find (retrieve) a snippet
	- type in description of problem
	- quickly finds top results - see below
- update a snippet
	- observe the delta and change the JSON and redis accordingly
	- push changes to remote sheet
- delete a snippet
	- when reading it, have a button that deletes it
	- go through all the keywords in the snippet and remove it from the sets
	- remove it from the JSON
	- push changes to remote sheet
- install sheet
	- turn the json into the redis sets
- uninstall sheet
	- go through and delete every snippet from the redis sets
- create sheet
- edit settings
	- list of ignored words
	- list of allowed characters in tokens

# Searching

on every keystroke, calculate the delta and determine if a new keyword has been entered or removed

new keyword is entered:

	members = SMEMBERS [keyword]-keywords
	foreach member in members
		ZINCRBY ~~search 10 member

	members = SMEMBERS [keyword]-problems
	foreach member in members
		ZINCRBY ~~search 3 member

	members = SMEMBERS [keyword]-solutions
	foreach member in members
		ZINCRBY ~~search 1 member

	update display using ZREVRANGEBYSCORE ~~search +inf 1 WITHSCORES LIMIT 25

new keyword is removed - same as above, except negative numbers


