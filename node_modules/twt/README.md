# twt

## install

With [npm](http://npmjs.org) do:

```
npm install -g twt
```

## setup

* create a twitter application [https://apps.twitter.com/](https://apps.twitter.com/)
* make sure to set your apps permissions to "Read, write, and direct messages"
* create consumer and access keys on the "Keys and Access Tokens" tab
* add the keys as environment variables in your .profile/.bash_profile...

```bash

export TWT_CONSUMER_KEY=<consumer_key>
export TWT_CONSUMER_SECRET=<consumer_secret>
export TWT_ACCESS_TOKEN=<access_token>
export TWT_ACCESS_TOKEN_SECRET=<access_token_secret>

export TWT_SCREEN_NAME=<screen_name>
# without @, for colouring
# example: export TWT_SCREEN_NAME=duivvv

```

* restart your terminal
* done.

*please be aware that most API calls are [rate limited](https://dev.twitter.com/rest/public/rate-limits)*

## usage

```bash

Usage: twt - cmdtwitter, a command line twitter client

$ twt {command} <argument> <options>

Commands:

  home|h                     display your home timeline, default action
  tweet|t <status>           tweet a new status
  mentions|m                 display your mentions
  directmesssages|d          display your direct messages
  search|s <search_query>    search tweets by query
  list|l <list_name>         display tweets in list
  user|u <screen_name>       display timeline of user
  own|o                      display your timeline
  follow|f <screen_name>     follow or request to follow a user
  unfollow|uf <screen_name>  unfollow a user
  whois|w <screen_name>      display information on user

Options:

  -h, --help             output usage information
  -V, --version          output the version number
  -l, --limit <limit>    limit results
  -w, --words <words>    words per line
  -e, --exclude <flags>  exclude tweets, pass r|replies or/and rt|retweets, comma separated

```

### examples

tweet a new status

```bash
$ twt t "my tweet"
```

display your home timeline

```bash
$ twt
```

display your timeline

```bash
$ twt o
```

display your mentions

```bash
$ twt m
```

display your direct messages

```bash
$ twt d
```

display timeline of user, in this example *@devine_howest*

```bash
$ twt u "devine_howest"
```

search tweets by query, in this example *#devinehowest* (first example shows 50, default is 15)

```bash
$ twt s "#devinehowest" -l 50
$ twt s "#devinehowest"
```

display information on user

```bash
$ twt w "duivvv"
```

follow a user

```bash
$ twt f "duivvv"
```

unfollow a user

```bash
$ twt uf "GeorgeWBush"
```

display timeline of one of your lists

```bash
$ twt l "cycling"
```

Tweets are displayed in reverse order (newest ones last).

## todo

* make environment variables step interactive (--set KEY_NAME --key ...)
* marking search results
* better url expanding
* better colouring (email - mention, hashtag - url problems)
* trends
* list '@username/list'
