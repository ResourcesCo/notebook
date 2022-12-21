# Sandbox Example

This is an example using the sandbox component, which allows adding HTML, CSS, and JavaScript to the page.

It appears in a sandboxed iFrame, so it can't access the content of other pages or access content from other sites except for images.

With a postMessage, it can update its own text, but is limited to 50K characters so unless localStorage is crowded, won't cause localStorage data to get deleted by the browser by exceeding its 5MB limit!

[`Sandbox`](https://macchiato.dev/component/#Sandbox)

```html
<p class="hello">Hello, World.</p>
<p><button id="toggle-hello">Toggle</button></p>
```

[`Sandbox`](https://macchiato.dev/component/#Sandbox)

```css
.hello {
  color: #cd0dd5;
  filter: invert(0.4);
  transition: opacity 2s;
  font-size: 50px;
}
button#toggle-hello {
  background-color: green;
  color: goldenrod;
  border-radius: 3px;
  padding: 5px 20px;
}
.hide-me {
  opacity: 0;
}
```

[`Sandbox`](https://macchiato.dev/component/#Sandbox)

```js
document.querySelector('.hello').innerText = 'Hello, World!!!'
document.querySelector('#toggle-hello').addEventListener('click', () => {
  document.querySelector('.hello').classList.toggle('hide-me')
})
```

This is a demo for containers (in Settings). It will only show if `sandbox-example.md` is in a container that allows showing images from placekitten.com.

![](https://placekitten.com/200/300)
