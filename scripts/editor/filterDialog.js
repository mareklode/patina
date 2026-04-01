/**
 * Manages the filter dialog for editing patina node filters
 * Accepts a node object and allows editing its filters in place
 */

const filterDialog = (() => {
    const $filterDialog = document.querySelector('.js-filter-dialog');
    let currentNode = null;
    let availableFilters = [];
    let addFilterButton = null;
    let filterSelect = null;

    if (!$filterDialog) {
        console.warn('js-filter-dialog element not found');
    }

    /**
     * Update the dialog form with the current node's filters
     * @param {Object} node - The patina node object with potential filters
     */
    const updateDialogForm = (node) => {
        let dialogHtml = `<form method="dialog"><button type="button" class="close-button" id="filter-close-btn">X</button>`;

        node.filter?.forEach((filter, index) => {
            dialogHtml += `<label for="filter-${index}">${filter.name}</label><input type="text" id="filter-${index}" class="filter-input" data-filter-index="${index}" data-filter-name="${filter.name}" value="${filter.value}" /><br>`;
        });

        dialogHtml += `<select id="add-select-filter"><option>select:</option>`;
        availableFilters.forEach((filter) => {
            dialogHtml += `<option>${filter}</option>`;
        });

        dialogHtml += '</select><button type="button" id="add-filter-btn">Add</button></form>';

        $filterDialog.innerHTML = dialogHtml;
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
     * Handle adding a new filter
     */
    const handleAddFilter = (event) => {
        event.preventDefault();
        if (!currentNode) return;

        const filterName = $filterDialog.querySelector("#add-select-filter").value;
        if (!filterName || filterName === "select:") return;

        currentNode.filter = currentNode.filter || [];
        currentNode.filter.push({ name: filterName, value: 0 });

        updateDialogForm(currentNode);
        attachFilterEventListeners();
    };

    /**
     * Attach event listeners to form elements
     */
    const attachFilterEventListeners = () => {
        const closeBtn = $filterDialog.querySelector('#filter-close-btn');
        const addBtn = $filterDialog.querySelector('#add-filter-btn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => $filterDialog.close());
        }

        if (addBtn) {
            addBtn.addEventListener('click', handleAddFilter);
        }

        const filterInputs = $filterDialog.querySelectorAll('.filter-input');
        filterInputs.forEach(input => {
            input.addEventListener('focusout', handleFilterInputChange);
        });
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
            attachFilterEventListeners();

            $filterDialog.showModal();

            const closeHandler = () => {
                $filterDialog.removeEventListener('close', closeHandler);
                $filterDialog.close();
                currentNode = null;
                resolve();
            };

            $filterDialog.addEventListener('close', closeHandler);
        });
    };

    return { show };
})();

export default filterDialog;
