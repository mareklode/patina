/**
 * Manages the filter dialog for editing patina node filters
 * Accepts a node object and allows editing its filters in place
 */

const filterDialog = (() => {
    const $filterDialog = document.querySelector('.js-filter-dialog');
    let currentNode = null;
    let availableFilters = [];

    if (!$filterDialog) {
        console.warn('js-filter-dialog element not found');
    }

    /**
     * Update the dialog form with the current node's filters
     * @param {Object} node - The patina node object with potential filters
     */
    const updateDialogForm = (node) => {
        const nodeId = node.nodeName;
        const correspondingNode = document.querySelector(`.patina-node[data-node-id="${nodeId}"]`);
        console.log('correspondingNode for filter dialog:', correspondingNode);
        correspondingNode.classList.add('highlighted');
        console.log('Showing filter dialog for node:', node);
        let name = node.patternConfig?.name || node.combineMode?.name;
        if (name) { name = ` : ${name}`; } else { name = ''; }

        let dialogHtml = `
            <h2>Filter Editor</h2>
            <p>${node.type}${name}</p>
            <form method="dialog">
                <button type="button" class="close-button js-filter-close-btn">Apply</button>
        `;

        node.filter?.forEach((filter, index) => {
            dialogHtml += `
                <div class="filter-row" data-filter-index="${index}">
                    <label for="filter-${index}">${filter.name}</label>
                    <input type="text" id="filter-${index}" class="filter-input" data-filter-index="${index}" data-filter-name="${filter.name}" value="${filter.value}" />
                    <button type="button" class="filter-btn-up" data-filter-index="${index}" title="Move up">↑</button>
                    <button type="button" class="filter-btn-down" data-filter-index="${index}" title="Move down">↓</button>
                    <button type="button" class="filter-btn-delete" data-filter-index="${index}" title="Delete filter">✕</button>
                </div>`;
        });

        dialogHtml += `<select class="js-add-select-filter add-select-filter"><option>Add Filter:</option>`;
        availableFilters.forEach((filter) => {
            dialogHtml += `<option>${filter}</option>`;
        });

        dialogHtml += `
                </select>
            </form>
            <p class="very-small">${node.nodeName}</p>
        `;

        $filterDialog.innerHTML = dialogHtml;

        // Attach event listeners after updating the DOM
        const closeBtn = $filterDialog.querySelector('.js-filter-close-btn');
        closeBtn.addEventListener('click', () => $filterDialog.close());

        const filterInputs = $filterDialog.querySelectorAll('.filter-input');
        filterInputs.forEach(input => {
            input.addEventListener('focusout', handleFilterInputChange);
        });

        const deleteButtons = $filterDialog.querySelectorAll('.filter-btn-delete');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', handleDeleteFilter);
        });

        const upButtons = $filterDialog.querySelectorAll('.filter-btn-up');
        upButtons.forEach(btn => {
            btn.addEventListener('click', handleMoveFilterUp);
        });

        const downButtons = $filterDialog.querySelectorAll('.filter-btn-down');
        downButtons.forEach(btn => {
            btn.addEventListener('click', handleMoveFilterDown);
        });

        const addFilter = $filterDialog.querySelector(".js-add-select-filter");
        addFilter.addEventListener('change', (event) => {
            handleAddFilter(event);
        });
    };

    /**
     * Handle focus out on filter inputs
     */
    const handleFilterInputChange = (event) => {
        const elInput = event.target.closest('.filter-input');
        if (!elInput || !currentNode) return;

        const newValue = parseFloat(elInput.value);
        const filterIndex = parseInt(elInput.getAttribute('data-filter-index'));

        if (typeof newValue === "number" && currentNode.filter && currentNode.filter[filterIndex]) {
            currentNode.filter[filterIndex].value = newValue;
        }
    };

    /**
     * Handle deleting a filter
     */
    const handleDeleteFilter = (event) => {
        event.preventDefault();
        if (!currentNode) return;

        const filterIndex = parseInt(event.target.getAttribute('data-filter-index'));

        if (currentNode.filter && currentNode.filter[filterIndex] !== undefined) {
            currentNode.filter.splice(filterIndex, 1);
            updateDialogForm(currentNode);
        }
    };

    /**
     * Handle moving a filter up in the list
     */
    const handleMoveFilterUp = (event) => {
        event.preventDefault();
        if (!currentNode) return;

        const filterIndex = parseInt(event.target.getAttribute('data-filter-index'));

        if (currentNode.filter && filterIndex > 0) {
            // Swap with previous filter
            [currentNode.filter[filterIndex - 1], currentNode.filter[filterIndex]] =
                [currentNode.filter[filterIndex], currentNode.filter[filterIndex - 1]];
            updateDialogForm(currentNode);
        }
    };

    /**
     * Handle moving a filter down in the list
     */
    const handleMoveFilterDown = (event) => {
        event.preventDefault();
        if (!currentNode) return;

        const filterIndex = parseInt(event.target.getAttribute('data-filter-index'));

        if (currentNode.filter && filterIndex < currentNode.filter.length - 1) {
            // Swap with next filter
            [currentNode.filter[filterIndex], currentNode.filter[filterIndex + 1]] =
                [currentNode.filter[filterIndex + 1], currentNode.filter[filterIndex]];
            updateDialogForm(currentNode);
        }
    };

    /**
     * Handle adding a new filter
     */
    const handleAddFilter = (event) => {
        event.preventDefault();
        if (!currentNode) return;

        const filterName = $filterDialog.querySelector(".js-add-select-filter").value;
        if (!filterName || filterName === "select:") return;

        currentNode.filter = currentNode.filter || [];
        currentNode.filter.push({ name: filterName, value: 0 });

        updateDialogForm(currentNode);
    };

    /**
     * Show the filter dialog for a given node
     * @param {Object} node - The patina node object to edit
     * @param {Array} filters - List of available filters
     * @returns {Promise} Resolves when dialog is closed
     */
    const show = (node, filters) => {
        // is "show" the best name for this? it handles both showing and updating the dialog form
        return new Promise((resolve) => {
            if (!$filterDialog) {
                console.error('Filter dialog element not found');
                resolve();
                return;
            }

            currentNode = node;
            availableFilters = filters;

            updateDialogForm(node);

            document.body.classList.add('dialog-open');
            $filterDialog.showModal();

            const closeHandler = () => {
                $filterDialog.removeEventListener('close', closeHandler);
                $filterDialog.close();
                document.body.classList.remove('dialog-open');
                currentNode = null;
                resolve();
            };

            $filterDialog.addEventListener('close', closeHandler);
        });
    };

    return { show };
})();

export default filterDialog;
