# Data

## Snippets

The data that we are storing and searching is essentially a list of snippets. A snippet is an object that contains a list of string keywords, a string problem, and a string solution. So, the data could look like this:

```
[
	{
		"problem": "Have an HTML link open a new tab",
		"solution": "<a href='foo.html' target='_blank'></a>",
		"keywords": ["html", "new", "tab", "link"]
	},
	{
		"problem": "Terminate code in C#",
		"solution": "Environment.Exit([exit code]);",
		"keywords": ["c#", "exit", "terminate", "stop", "halt", "execution"]
	},
	...
]
```

## Redis data

To store this data and quickly manipulate it, there are three groups of redis data.

### Snippet

The simplest of the three is just the snippet, stored in a redis string, in stringified JSON format. The key for this data is the id of the snippet, which is just a number. So if the data above was added to CheatSheet, then you could query redis like this:

```
get 1
"{\"keywords\":[\"html\",\"new\",\"tab\",\"link\"],\"problem\":\"Have an HTML link open a new tab\",\"solution\":\"<a href='' target='_blank'></a>\"}"
```

### Indices

When a snippet is added, it gets tokenized and indexed right away. The result of this indexing is three groups of redis sets. For every keyword from the snippet, the index of the snippet gets added to a redis set named `[keyword]-keywords`. If the set doesn't exist, it gets created here. For every token from the snippet problem, the index of the snippet gets added to `[token]-problems`. Same thing for the tokens for the solution - they create `[token]-solutions`.

### Searchable scores

When the new snippet is completely added to redis, indices and all, CheatSheet recalculates the scores for all the search terms it touched. These are stored in sorted sets named like so: `[token]-scores`. These are what actually get used by the search algorithm.

### Tokenizing history

The tokenizing process changes depending on the user's settings. So, a snippet might get indexed, and then the settings changed, and then the user wants to delete the snippet. This poses a problem because we can't be sure what tokens were created when the snippet got added, so we can't be sure that we can find all the places to remove the snippet's index.

To address this, there are two other redis sets for every snippet. They store the tokens that were produced for that snippet's problem and solution. Their keys are `[snippet index]-problem-tokens` and `[snippet index]-solution-tokens`.

### Special keys

There are several special system keys that are kept in redis. They all begin with `~~`. The first is `~~counter`. This is a simple counter string that is used to create snippet IDs.

Next, `~~results`. This is created by the search algorithm and contains a sorted set of the snippet indices that get returned as the result of a search. The weight of a member is the likelihood that it is what the user searched for.

## Settings

- list of ignored words
- list of allowed characters in tokens
- keyword/problem/solution weights
- amount of time to permanently delete snippet

# Tokenizing process

- lowercase everything (including keywords)
- turn unneeded characters into whitespace
	- replace(/[^\s\da-z]|(\s)/g, " ") - from list of allowed characters
- get rid of unneeded words
	- replace(/\b(the)\b|\b(and)\b|\b(is)\b|\b(to)\b|\b(by)\b|\b(is)\b|\b(in)\b|\b(with)\b/g, "") - built from list of ignored words
- get rid of unneeded whitespace
	- replace(/\s+/g, " ")
- end up with just tokens separated by spaces
	- split(" ")
- add to redis
- recalcuate scores

# Searching

When a query is received, it is tokenized, using whitespace as a separator. These tokens should have a precalculated sorted set of snippet indices and scores. So, we just combine all of those entries. If the search query had two tokens, the command would look like this: `ZUNIONSTORE ~~results 2 scores-[first token] scores-[second token]`.

Get the resulting snippet indices with this command: `ZREVRANGEBYSCORE ~~results +inf 1 WITHSCORES LIMIT 25`.

Finally, go through each snippet and get the stringified JSON data with a simple `GET [snippet index]`.

# Use cases

four main cases (CRUD), four rare cases

- create a snippet
	- type in problem description
	- type in solution
	- specify what sheets to attach to
	- asks for keywords
	- tokenize and add to DB
	- push changes to remote sheet
- find (retrieve) a snippet
	- type in description of problem
	- quickly finds top results - see above
- update a snippet
	- observe the delta and change redis accordingly
	- push changes to remote sheet
- delete a snippet
	- frontend: when reading the snippet, have a button that deletes it
	- go through all the keywords in the snippet and remove it from the sets
	- push changes to remote sheet
	- allow change to be undone for 24 hours
- install sheet
	- turn the json into the redis sets
- uninstall sheet
	- go through and delete every snippet from the redis sets
- create sheet
- edit settings
	- list of ignored words
	- list of allowed characters in tokens
	- keyword/problem/solution weights
	- amount of time to permanently delete snippet

