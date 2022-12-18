
/****************************************************
 *               MODIFY THIS FILE                   *
 *               ================                   *
 * This file is where you should specify the logic  *
 * specific to your extension.                      *
 ****************************************************/

import { init } from './framework';

// https://stackoverflow.com/a/6640851
const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/

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

function uuidResolveFn(uuid) {
  return new Promise(resolve => {
    const knownUUIDs = [
      { uuid: '7a18a230-f4d0-4fbb-b706-0a16479409a5', html: `The best <b>UUID</b> ever!` }
    ]
    const matchingResult = knownUUIDs.find(x => x.uuid === uuid);
    const html = matchingResult ? matchingResult.html : `<i>UNKNOWN UUID</i>`;
    const delay = 200 + Math.random() * 2000; // 200..2200 ms of delay
    setTimeout(() => {
      resolve(html);
    }, delay);
  });
}

// ========
// = MAIN =
// ========

console.log("{{ your extension name }} loaded!")

init({
  matchingFn: uuidMatchingFn,
  resolveFn: uuidResolveFn
})

