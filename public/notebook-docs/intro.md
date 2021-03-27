# Welcome

This is an object in a bucket. The bucket is called `notebook-docs` and the key of the object is `intro.md`. It is initialized with the `app`, which contains its own private namespace of buckets.

The bucket has three layers. The bottom layer is at `/notebook-docs` on the web. The middle layer is in the browser at `nb:notebook-docs` in `localStorage`. The top layer is generated from objects that have been loaded from the other two layers. For instance, a markdown file may contain a `package.json` embedded inside it that can be shown.

When the app loads this object, `intro.md`, it first checks the top layer for the key. Finding nothing, it goes to the middle layer and checks `localStorage` for the key `nb:notebook-docs/intro.md`. If that isn't found, it goes to the bottom layer and fetches the object from the web at `/notebook-docs/intro.md`. When you edit this file, it will put it into the middle layer at the localStorage key `nb:notebook-docs/intro.md`. If you are logged in and have permissions and have autosave turned on, it may also put it into the top layer at `/notebook-docs/intro.md` on the web, through [fetch].

The heading is `Welcome` but the title is `Introduction`. The title comes from a markdown list containing `props` at the bottom of this document. It is analagous to YAML frontmatter. Before the list, a shortcode appears. This type of shortcode is a *nanocode* which is activated with a link but has ordinary Markdown for its contents.

There is another bucket called `docs` that starts out empty and without a web layer. You can add objects to it and use it as a workspace. The data will be stored in localStorage unless it is too big. It is recommended to download them, until you add a writable remote layer (such as a web layer) to it so your data is stored in the cloud.

[props](https://nanocodes.dev/props)

- title: Introduction
- emoji: 📘

[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API