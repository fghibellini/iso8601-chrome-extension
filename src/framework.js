
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
        const actionIcon = createActionIcon()
        const loaderHtml = createLoaderDom()
        parent.appendChild(actionIcon);
        let triggered = false;
        tippy(actionIcon, {
          content: loaderHtml,
          allowHTML: true,
          interactive: true,
          onShow: instance => {
            if (!triggered) {
              triggered = true;
              refreshContents();
            }
          }
        });
        let invalidationId = 0;
        function refreshContents() {
          const reqId = ++invalidationId
          resolveFn(matchedValue)
            .then(tooltipHtmlContents => {
              if (reqId === invalidationId) {
                loaderHtml.innerHTML = tooltipHtmlContents;
              }
            }, err => {
              if (reqId === invalidationId) {
                // TODO show error information
                // TODO add a retry button
                loaderHtml.innerHTML = `Error!`;
              }
            });
        }
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

function createLoaderDom() {
  const root = document.createElement("div")
  root.classList.add(`arl-loading-view`);
  root.innerHTML = `Loading...`;
  return root;
}

