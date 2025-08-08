/**
 * FilterDialog Module
 * Handles all filter dialog functionality including UI creation, event handling, and data management
 */
export class FilterDialog {
    constructor(linkedNodeList, filters, drawJsonPatina, patinaToTextarea) {
        this.linkedNodeList = linkedNodeList;
        this.filters = filters;
        this.drawJsonPatina = drawJsonPatina;
        this.patinaToTextarea = patinaToTextarea;
        this.elFilterDialog = null;
        
        this.init();
    }

    /**
     * Initialize the FilterDialog
     */
    init() {
        this.createDialogElement();
        this.setupEventListeners();
        
        // Make addFilter available globally for onclick handlers
        window.addFilter = this.addFilter.bind(this);
    }

    /**
     * Create the dialog HTML element and append it to the main element
     */
    createDialogElement() {
        const main = document.querySelector('main');
        if (main) {
            const dialogHTML = `<dialog class="js-filter-dialog filter-dialog" closedby="any">
                <form action="#" method="dialog">
                </form>
            </dialog>`;
            
            main.insertAdjacentHTML('beforeend', dialogHTML);
            this.elFilterDialog = document.querySelector('.js-filter-dialog');
        }
    }

    /**
     * Setup all filter dialog event listeners
     */
    setupEventListeners() {
        if (this.elFilterDialog) {
            this.elFilterDialog.addEventListener('focusout', this.handleFilterDialogFocusOut.bind(this));
            this.elFilterDialog.addEventListener('input', this.handleFilterDialogInput.bind(this));
        }
    }

    /**
     * Handle focus out events in filter dialog
     */
    handleFilterDialogFocusOut(event) {
        const elInput = event.target.closest('input');

        if (!elInput) return;

        const patinaNodeId = this.elFilterDialog.getAttribute("data-node-id");
        const newValue = parseFloat(elInput.value);

        if (typeof newValue === "number" && patinaNodeId) {
            if (!this.linkedNodeList[patinaNodeId].filter) {
                this.linkedNodeList[patinaNodeId].filter = {};
            }

            this.linkedNodeList[patinaNodeId].filter[elInput.id] = {
                "name": elInput.getAttribute("data-filter-name"),
                "value": newValue
            };
        }
    }

    /**
     * Handle input events in filter dialog
     */
    handleFilterDialogInput(event) {
        const selectElement = event.target.closest('select');

        if (selectElement) {
            // TODO: Implement select handling in filter dialog
            console.log('Filter dialog select changed:', event);
        }
    }

    /**
     * Update the filter dialog content based on the patina node
     */
    updateFilterDialog(patinaNodeId) {
        let dialogHtml = `<form method="dialog"><button class="close-button" onclick="this.closest('dialog').close()">X</button>`;
        this.linkedNodeList[patinaNodeId].filter?.forEach((filter, index) => {
            dialogHtml += `<label for="${filter.name}">${filter.name}</label><input type=text id=${index} data-filter-name=${filter.name} value="${filter.value}" /><br>`;
            // type="number" min="0" max="1000" step="0.01"
        });
        dialogHtml += `<select id="add-select-filter"><option>select:</option>`;
        this.filters.forEach((filter) => {
            dialogHtml += `<option>${filter}</option>`;
        });
        this.elFilterDialog.innerHTML = dialogHtml + '</select><button onclick="addFilter(event)">Add</button></form>';
    }

    /**
     * Add a new filter to the current patina node
     */
    addFilter(event) {
        event.preventDefault(); // preventing closing the dialog
        const filterName = event.target.parentElement.querySelector("#add-select-filter").value;

        const patinaNodeId = event.target.closest(".js-filter-dialog").getAttribute("data-node-id");
        this.linkedNodeList[patinaNodeId].filter = this.linkedNodeList[patinaNodeId].filter || [];
        this.linkedNodeList[patinaNodeId].filter.push({ name: filterName, value: 0 });

        this.updateFilterDialog(patinaNodeId);
    }

    /**
     * Handle filter button clicks from patina nodes
     */
    clickButtonFilters(event) {
        let buttonElement = event.target;
        buttonElement.classList.add("active");

        const patinaNodeId = buttonElement.closest(".patina-node").id;

        this.elFilterDialog.setAttribute("data-node-id", patinaNodeId);

        this.updateFilterDialog(patinaNodeId);

        this.elFilterDialog.show();

        // Remove active class and update data when dialog closes
        const closeHandler = (event) => {
            buttonElement.classList.remove("active");
            this.drawJsonPatina();
            this.patinaToTextarea();
            this.elFilterDialog.removeEventListener('close', closeHandler);
        };

        this.elFilterDialog.addEventListener('close', closeHandler);
    }

    /**
     * Get the filter dialog element
     */
    getDialogElement() {
        return this.elFilterDialog;
    }
}
