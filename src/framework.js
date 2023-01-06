
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

export function init({ matchingFn, resolveFn, checkIntervalMs, triggerConfig, nestedCheck }) {

  const _triggerConfig = triggerConfig || stringTrigger(`ℹ️`);

  setInterval(() => {
    const iterator = document.createNodeIterator(
      document.getRootNode(),
      NodeFilter.SHOW_TEXT,
      n => matchingFn(n).length ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    )

    while (currentNode = iterator.nextNode()) {
      if (!_triggerConfig.hasTrigger(currentNode) && (!nestedCheck || !isTooltipDescendant(currentNode))) {
        const matchedValue = matchingFn(currentNode)[0];
        const trigger = _triggerConfig.createTrigger(currentNode)
        const loaderHtml = createLoaderDom()
        let triggered = false;
        tippy(trigger.triggerElement, {
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

function createLoaderDom() {
  const root = document.createElement("div")
  root.classList.add(`arl-loading-view`);
  root.innerHTML = `Loading...`;
  return root;
}

function isTooltipDescendant(node) {
  const parent = node.parentElement
  return !!(parent.matches("*[data-tippy-root]") || parent.closest("*[data-tippy-root]"));
}

export function stringTrigger(triggerText) {

  function createActionIcon(matchedElement) {
    const parent = matchedElement.parentElement
    const actionIcon = document.createElement("div")
    actionIcon.classList.add(`arl-action-icon`);
    actionIcon.textContent = triggerText;
    parent.appendChild(actionIcon);
    return {
      triggerElement: actionIcon
    }
  }

  function isDecorated(node) {
    const parent = node.parentElement
    return Array.from(parent.children).some(x => x.classList.contains(`arl-action-icon`))
  }

  return {
    createTrigger: createActionIcon,
    hasTrigger: isDecorated
  }

}

