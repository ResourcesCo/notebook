# Request Example

Send a request with the body and output in the specified `data` elements.

[`input`](https://macchiato.dev/data)

```json
{
  "hello": "page"
}
```

[`request`](https://macchiato.dev/request)

```json
{
  "method": "patch",
  "url": "https://httpbin.org/post",
  "input": {"data": "input"},
  "output": {"data": "output"},
  "headers": {
    "Authorization": "`Bearer ${api_key}`"
  }
}
```

[`output`](https://macchiato.dev/data)

```json
{
  "hello": "page"
}
```