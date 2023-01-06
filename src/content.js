
/****************************************************
 *               MODIFY THIS FILE                   *
 *               ================                   *
 * This file is where you should specify the logic  *
 * specific to your extension.                      *
 ****************************************************/

import { init } from './framework';

// https://stackoverflow.com/a/14322189
const iso8601Regex = /([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?/


function iso8601MatchingFn(node) {
  // ignore very big text nodes
  // (we are periodically iterating over the whole document)
  if (node.data.length > 1000) {
    return false;
  } else {
    // we don't perform an exact match (/^...$/) since we want to be able
    // to annotate even text that might INCLUDE a date (e.g. per-entity resources)
    const datesInNode = node.data.match(new RegExp(iso8601Regex, 'g')) || []
    // more than 1 match not interesting as it wouldn't be clear which date the tooltip is for
    // and splitting text nodes is beyond the scope for now
    return (datesInNode.length === 1) ? datesInNode : [];
  }
}

async function uuidResolveFn(strDate) {
  const matchingResult = new Date(strDate);
  const html = matchingResult ? matchingResult.toLocaleDateString() : `<i>UNKNOWN UUID</i>`;
  await randomDelay(200, 300);
  return html;
}


// to simulate network latency
async function randomDelay(minMs, maxMs) {
  const delay = minMs + Math.random() * (maxMs - minMs);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
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

