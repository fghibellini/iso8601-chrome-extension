
# Chrome Annotation Extension Template

Create your own Chrome extension to augment values with tooltips showing extra information about them.

Example use cases include:

1. resolve UUID values to entity information (either static data or query your own server)
1. annotate unix timestamps and UTC ISO8601 time signatures with a more user-friendly local date
1. annotate currency values with conversions
1. add explanations on top of cryptic notation that you came up with

## Steps

### Step 1

Fork this repo

### Modify the [manifest.json](./manifest.json)

Specify what your extension's name is and add a brief description for your users.

### Define a matching function

Specify a function that extracts your values of interest out of HTML text nodes.
This function better be fast and it needs to return a list of matches.
It should return `[]` if the HTML node has no interesting values and a one-element
array if there is one. Currently only one value per text node is supported.

The returned value will then be passed to your resolution function.

### Define a resolution function

The values that we discover in the HTML document then need to be resolved into HTML snippets to display to the user in the tooltip.
The resolution function should be an asynchronous function that returns an HTML snippet (if the value does not correspond to any entity simply return an explanation to the user in HTML format).

### Pass the two functions to the `init()` function

```javascript
init({
  matchingFn: uuidMatchingFn,
  resolveFn: uuidResolveFn
})
```

### DONE!

You got yourself a Chrome extension!

## More

- See the accompanying [blog post](https://fghibellini.com/posts/2022-12-17-Leveraging-UUIDs-to-the-Max/index.html) with a deeper explanation.
