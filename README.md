# json-stub

Simple stub based on json-files on your filesystem.

## Setup

First, you should create directory structure that represents your API structure. For example:

```
.
+-- api
|   +-- v2
|       +-- auth
|           +-- get.json
|           +-- post.json
|       +-- friend
|           +-- :id
|               +-- get.json
```

Next you run:

```
npx json-stub ./api
```

This will start API server on port 3030 that responds to following requests:
- `GET /v2/auth`
- `POST /v2/auth`
- `GET /v2/friend/:id`

Directories starting with colon `:` would be considered parameters and passed to json-responses, which support handlebars templating.


