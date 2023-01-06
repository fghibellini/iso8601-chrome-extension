
/****************************************************
 *               MODIFY THIS FILE                   *
 *               ================                   *
 * This file is where you should specify the logic  *
 * specific to your extension.                      *
 ****************************************************/

import { init, stringTrigger } from './framework';

// https://stackoverflow.com/a/3143231/3343425
const iso8601Regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/


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

async function iso8601ResolveFn(strDate) {
  const matchingResult = new Date(strDate);
  const html = `
    Local: ${matchingResult.toLocaleString()}<br>
    UTC: ${matchingResult.toISOString()}
  `;
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

console.log("ISO8601 datetime formatter loaded!")

init({
  matchingFn: iso8601MatchingFn,
  resolveFn: iso8601ResolveFn,
  triggerConfig: stringTrigger('🕑'),
  nestedCheck: true
})

