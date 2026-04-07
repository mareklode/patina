/**
 * HTML Tree Builder Module
 * Handles rendering patina node trees to HTML
*/

import { getJsonFromLinkedNodeList } from "./utils.js";
import createPattern from "../modules/mel_createPattern.js";
import { combineLayersMetadata } from "../modules/mel_combineLayers.js"

const getSelectHtml = (name, nodeName, options, selectedValue, className = "") => {
    let html = `<label for="${nodeName}">name:</label><!--
        --><select name="${name}" id="${nodeName}" class="${className}">`;

    options.forEach((option) => {
        html += `<option ${option === selectedValue ? "selected" : ""} value="${option}">${option}</option>`;
    });

    html += `</select>`;
    return html;
};

// this function builds the html for the "root" node and then recursively for its children
export function htmlTree (node, branchForks, linkedNodeList, patterns, nodePurpose = false) {
    let patinaNodeHtml = (node) => {
        let htmlstring = "";

        if (node.type === "layers") {
            htmlstring += `<button class="patina-node__button-switch" data-node-name="${node.nodeName}">switch</button>\n`;
        }

        // too many IDs
        htmlstring += `<div id="${node.nodeName}" data-node-id="${node.nodeName}" class='patina-node`;
        if (node.nodeName === "root") {
            htmlstring += ` js-module' data-module-name='patina' data-module-data='${JSON.stringify(getJsonFromLinkedNodeList(node, branchForks, linkedNodeList))}`;
        }
        htmlstring += `'>`;

        let types = ["select_Type", "reuseImage", "createPattern", "layers", "colors"];
        htmlstring += getSelectHtml("type", node.nodeName, types, node.type, "patina-node__type");

        /*
        const pattern = createPattern.getAvailablePatterns();
        console.log(pattern);
        */

        if (node.type === "createPattern") {
            let patternName = node.patternConfig?.name || node.patternName;
            htmlstring += getSelectHtml("patternConfig", node.nodeName, patterns, patternName);

            const parameterForm = createPattern.generateParameterForm(patternName, node.patternConfig);
            if (parameterForm) {
                htmlstring += `
                    <div class="patina-node__patternConfig">
                        ${createPattern.generateParameterForm(patternName, node.patternConfig)}
                    </div>`;
            }
        }

        if (node.type === "layers") {
            let modes = Object.keys(combineLayersMetadata); //["overlay", "distort", "subtract", "multiply", "burn", "add"];
            htmlstring += getSelectHtml("combineMode", node.nodeName, modes, node.combineMode?.name, "patina-node__combineMode");

            console.log("Add input element for : ", node.combineMode?.name, Object.keys(combineLayersMetadata[node.combineMode?.name].parameters));
        }

        if (!!node.filter) {
            htmlstring += `<button class="patina-node__button-filter">filters: ${node.filter?.map((filter) => filter.name).join(' - ')}</button>\n`;
        } else {
            htmlstring += `<button class="patina-node__button-filter">+ filters</button>\n`;
        }

        // output all new properties so we remember to include them somehow
        Object.keys(node).forEach((key) => {
            let skipInfos = [...branchForks, "patternName", "filter", "nodeName", "type", "combineMode", "patternConfig", "direction"];
            if (skipInfos.includes(key)) return;
            console.log("add this to skipinfos:", key);
            htmlstring += `<p class="patina-node__${key}">${key}: ${node[key].name || node[key]}</p>`;
        });

        htmlstring += `</div>
            <p class="patina-node__purpose">${nodePurpose}</p>`;

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

    if (["layers", "colors", "reuseImage"].includes(node.type)) {
        /*
        *   <.subtree>
        *       <.parent />
        *       <.parent />
        *       <.child />
        *   </.subtree>
        */
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
