# Overview

A knowledge base for short snippets

Standalone first

Slack app second

Web interface third

# Concept Threats

## Competition

Big ones are Bloomfire, Helpjuice, and Shelf. They are used by some massive companies, but are not the specific type of knowledge base we are trying to implement. I haven't seen any large KBs that are geared around very short, quick QA. But, I believe that there is a huge market for it. (Assumption that needs to be tested.)

## It is yet another tool

Thus, integration must be very easy and simple. Must be flawless and smooth. Must integrate without effort. Solution: Slack app. Instant integration into nearly every workspace, especially the big ones.

Perhaps, eventually design absorption of other knowledge bases (best one to start with: SO). This would be a heavy task, especially since our KB is designed to fill in the gaps of other KBs.

## Will it be used?

If a company adopts it, will the individual employees be motivated to use it? Several ways of ensuring the answer is yes: Have stats that show users with the most creates, edits, and deletions. Seeing stats like this presented in a pretty way taps into the human psyche, even if it is a little bit childish. We innately desire to be at the top of that list, because we are innately competitive (somewhat of an assumption, but also verified by modern psychology). Plus, managers can use this information to reward the top three players in each category, for example.

Once a sheet grows to be big enough, it will have critical momentum. Once it has been adopted and contributing to it is habit, it will be extremely useful. The difficulty is adoption.

The concept of crowdsourcing has been proven time and time again. For large projects, this will certainly work. Open source projects live off of the small desires of thousands to contribute. This is how the sheets will be built.

## Financials

I would prefer it to be open source, because that would skyrocket its trustworthiness in the tech world, and thus its popularity. However, this may not garner enough revenue. We could do service levels and hosting of public sheets, but we will have to work that out. That is for Justin to figure out.

# Installation

Assumes you have redis installed and running, git installed, and nodejs/npm installed.

```
git clone git@github.com:timschwab/cheatsheet.git
npm install
npm start
```

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
			- replace(/[^\s\da-z]|(\s)/g, " ") - from list of allowed characters
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

	ZUNIONSTORE ~~scores 3 [keyword]-keywords [keyword]-problems [keyword]-solutions WEIGHTS 10 3 1
	ZUNIONSTORE ~~results 2 ~~scores ~~results

	update display using ZREVRANGEBYSCORE ~~results +inf 1 WITHSCORES LIMIT 25

new keyword is removed - same as above, except negative weights

empty string - `DEL ~~results`


