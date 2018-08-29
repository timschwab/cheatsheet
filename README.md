# Overview

A collection of short tidbits that I need to remember

standalone first - electron - https://github.com/electron/electron-quick-start

Slack app second

# Data

three sets of redis sets

- every keyword
  - [keyword]-keywords
  - [keyword]-problems
  - [keyword]-solutions

The search page has a redis sorted set "~~search" of every matching tidbit with their score. With a new word, this list is updated with the various searches that are done. When finished updating, the page is updated with the most recent list.

JSON data structure

- settings
  - list of ignored words
  - list of allowed characters in tokens
- library
  - keywords
  - brief problem description (limited to 200 characters)
  - brief solution (limited to 1000 characters. any more is not suited for this tool.)

# Use cases

two main use cases, two rare

- find a snippet
  - type in description of problem
  - quickly finds top results - see below
- create a snippet
  - type in problem description
  - type in solution
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
- install knowledge base
  - turn the json into the redis sets
- edit settings
  - list of ignored words
  - list of allowed characters in tokens

# Pseudocode

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

	update display using ZREVRANGEBYSCORE ~~search +inf 0 WITHSCORES LIMIT 25

new keyword is removed - same as above, except negative numbers


