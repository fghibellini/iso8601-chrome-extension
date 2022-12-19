
# Chrome Annotation Extension Template

Create your own [Chrome extension](https://developer.chrome.com/docs/extensions/) to augment values with tooltips showing extra information about them.

Example use cases include:

1. resolve [UUID values to entity information](https://fghibellini.com/posts/2022-12-17-Leveraging-UUIDs-to-the-Max/index.html) (either static data or query your own server)
1. annotate [unix timestamps](https://en.wikipedia.org/wiki/Unix_time) and [UTC ISO8601](https://en.wikipedia.org/wiki/ISO_8601) time signatures with a more user-friendly local date
1. annotate currency values with conversions
1. add explanations on top of cryptic notation that you came up with

See the accompanying [blog post](https://fghibellini.com/posts/2022-12-17-Leveraging-UUIDs-to-the-Max/index.html) for a deeper explanation.

## Steps

### Step 1

[Fork](https://github.com/fghibellini/chrome-annotation-extension-template/fork) this repo.

### Step 2: Modify the [manifest.json](./manifest.json)

Specify what your extension's name is and add a brief description for your users.

### Step 3: Define a matching function

Specify a function that extracts your values of interest out of HTML text nodes.
This function better be fast and it needs to return a list of matches.
It should return `[]` if the HTML node has no interesting values and a one-element
array if there is one. Currently only one value per text node is supported.

The returned value will then be passed to your resolution function.

[UUID example](https://github.com/fghibellini/chrome-annotation-extension-template/blob/master/src/content.js#L14):

```javascript
function uuidMatchingFn(node) {
  // ignore very big text nodes
  // (we are periodically iterating over the whole document)
  if (node.data.length > 1000) {
    return false;
  } else {
    // we don't perform an exact match (/^...$/) since we want to be able
    // to annotate even text that might INCLUDE a UUID (e.g. per-entity resources)
    const uuidsInNode = node.data.match(new RegExp(uuidRegex, 'g')) || []
    // more than 1 match not interesting as it wouldn't be clear which UUID the tooltip is for
    // and splitting text nodes is beyond the scope for now
    return (uuidsInNode.length === 1) ? uuidsInNode : [];
  }
}
```

### Step 4: Define a resolution function

The values that we discover in the HTML document then need to be resolved into HTML snippets to display to the user in the tooltip.
The resolution function should be an asynchronous function that returns an HTML snippet (if the value does not correspond to any entity simply return an explanation to the user in HTML format).

[UUID example](https://github.com/fghibellini/chrome-annotation-extension-template/blob/master/src/content.js#L29):

```javascript
async function uuidResolveFn(uuid) {
  const knownUUIDs = [
    { uuid: '7a18a230-f4d0-4fbb-b706-0a16479409a5', html: `The best <b>UUID</b> ever!` }
  ]
  const matchingResult = knownUUIDs.find(x => x.uuid === uuid);
  const html = matchingResult ? matchingResult.html : `<i>UNKNOWN UUID</i>`;
  await randomDelay(200, 2000);
  return html;
}
```

### Step 5: Pass the two functions to the `init()` function

```javascript
init({
  matchingFn: uuidMatchingFn,
  resolveFn: uuidResolveFn
})
```

[UUID example](https://github.com/fghibellini/chrome-annotation-extension-template/blob/master/src/content.js#L56)

### Step 6: Profit!

You got yourself a Chrome extension!

Now you can [load your unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked).

### Step 7: Keep up to date

By only modifying [manifest.json](./manifest.json) and [content.js](src/content.js) and reguarly merging the changes from this upstream repository you can take full advantage of any future changes in this template!
