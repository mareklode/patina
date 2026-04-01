/**
 * HTML Tree Builder Module
 * Handles rendering patina node trees to HTML
*/

import { getJsonFromLinkedNodeList } from "./utils.js";

// this function builds the html for the "root" node and then recursively for its children
export function htmlTree (node, branchForks, linkedNodeList, patterns, nodePurpose = false) {

  let patinaNodeHtml = (node) => {
    let htmlstring = "";

    if (node.type === "layers") {
      htmlstring += `<button class="patina-node__button-switch" data-node-name="${node.nodeName}">switch</button>\n`;
    }

    // too many IDs
    htmlstring += `<div id="${node.nodeName}" class='patina-node`;
    if (node.nodeName === "root") {
      htmlstring += ` js-module' data-module-name='patina' data-module-data='${JSON.stringify(getJsonFromLinkedNodeList(node, branchForks, linkedNodeList))}`;
    }
    htmlstring += `'>`;

    let types = ["select_Type", "reuseImage", "createPattern", "layers", "colors"];
    htmlstring += `<select name="type" id="${node.nodeName}" class="patina-node__type">`;
    types.forEach((type) => {
      htmlstring += `<option ${type === node.type ? "selected" : ""} value="${type}">${type}</option>`;
    });
    htmlstring += `</select>`;

    if (node.type === "createPattern") {
      htmlstring += `<label for="${node.nodeName}">name:</label><!--
                        --><select name="patternConfig" id="${node.nodeName}">`;
      let patternName = node.patternConfig?.name || node.patternName;
      patterns.forEach((pattern) => {
        htmlstring += `<option ${pattern === patternName ? "selected" : ""} value="${pattern}">${pattern}</option>`;
      });
      htmlstring += `</select>`;
      const directions = ["vertical", "horizontal", "concentric"];
      htmlstring += `<label for="${node.nodeName}">direction:</label><!--
                        --><select name="direction" id="${node.nodeName}">`;
      directions.forEach((direction) => {
        htmlstring += `<option ${direction === node.patternConfig?.direction ? "selected" : ""} value="${direction}">${direction}</option>`;
      });
      htmlstring += `</select>`;
      // htmlstring += `<input type="number" name="frequency" id="${node.nodeName}" value="${node.patternConfig?.frequency}">`;
    } else if (node.type === "layers") {
      let modes = ["overlay", "distort", "subtract", "multiply", "burn", "add"];
      htmlstring += `<label for="${node.nodeName}">mode:</label><!--
                        --><select name="combineMode" id="${node.nodeName}">`;
      modes.forEach((mode) => {
        htmlstring += `<option ${mode === node.combineMode?.name ? "selected" : ""} value="${mode}">${mode}</option>`;
      });
      htmlstring += `</select>`;
    }

    if (!!node.filter) {
      htmlstring += `<button class="patina-node__button-filter">filters: ${node.filter?.map((filter) => filter.name).join(' - ')}</button>\n`;
    } else {
      htmlstring += `<button class="patina-node__button-filter">+ filters</button>\n`;
    }

    Object.keys(node).forEach((key) => {
      let skipInfos = [...branchForks, "patternName", "filter", "nodeName", "type", "combineMode", "patternConfig", "direction"];
      if (skipInfos.includes(key)) return;
      console.log("add this to skipinfos:", key);
      htmlstring += `<p class="patina-node__${key}">${key}: ${node[key].name || node[key]}</p>`;
    });

    htmlstring += '</div>\n';
    if (nodePurpose) { htmlstring += `<p class="patina-node__purpose">${nodePurpose}</p>`; }

    return htmlstring;
  };

  // here the recursion happens
  let parentHtml = (node, nodePurpose) => {
    const subTree = htmlTree(node, branchForks, linkedNodeList, patterns, nodePurpose);
    return `
      <div class="parent">
        ${subTree}
      </div>
    `;
  };

  let childHtml = (node) => {
    return `<div class="child">\n${patinaNodeHtml(node)}\n</div>\n`;
  };

  if (node.type === "layers" || node.type === "colors" || node.type === "reuseImage") {
    let htmlstring = `<div class="subtree ${node.type}">\n`;

    branchForks.forEach((property) => {
      if (node[property]) {
        htmlstring += parentHtml(linkedNodeList[node[property]], property);
      }
    });
    htmlstring += childHtml(node);

    htmlstring += '</div><!-- .subtree -->\n';
    return htmlstring;
  }

  return patinaNodeHtml(node);
}
