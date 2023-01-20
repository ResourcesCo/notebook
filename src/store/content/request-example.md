# Request Example

Send a request with the body and output in the specified `data` elements.

[`input`](https://macchiato.dev/data)

```json
{
  "title": "foo",
  "body": "bar",
  "userId": 1
}
```

[`request`](https://macchiato.dev/request)

```json
{
  "method": "post",
  "url": "https://jsonplaceholder.typicode.com/posts",
  "input": {"$ref": "input"},
  "output": {"$ref": "output"},
  "headers": {
    "Authorization": "Bearer ${API_KEY}"
  }
}
```

[`output`](https://macchiato.dev/data)

```json
{
  "title": "foo",
  "body": "bar",
  "userId": 1,
  "id": 101
}
```