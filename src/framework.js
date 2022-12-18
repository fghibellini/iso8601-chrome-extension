
/*******************************************************
 *            !DO NOT MODIFY THIS FILE!                *
 *            =========================                *
 * This file should be modified only in the "upstream" *
 * repository. That way you can always "update" your   *
 * extension simply by merging the upstream changes.   *
 *******************************************************/

import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

import './framework.css';

const defaultCheckIntervalMs = 200;

export function init({ matchingFn, resolveFn, checkIntervalMs }) {
  setInterval(() => {
    const iterator = document.createNodeIterator(
      document.getRootNode(),
      NodeFilter.SHOW_TEXT,
      n => matchingFn(n).length ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    )

    while (currentNode = iterator.nextNode()) {
      const parent = currentNode.parentElement
      if (!isDecorated(parent)) {
        const matchedValue = matchingFn(currentNode)[0];
        const tooltipHtmlContents = resolveFn(matchedValue);
        const actionIcon = createActionIcon()
        parent.appendChild(actionIcon);
        tippy(actionIcon, {
          content: tooltipHtmlContents,
          allowHTML: true,
          interactive: true
        });
      }
    }
  }, checkIntervalMs || defaultCheckIntervalMs)
}

function isDecorated(element) {
  return Array.from(element.children).some(x => x.classList.contains(`arl-action-icon`))
}

function createActionIcon() {
  const actionIcon = document.createElement("div")
  actionIcon.classList.add(`arl-action-icon`);
  actionIcon.textContent = `ℹ️`;
  return actionIcon;
}

