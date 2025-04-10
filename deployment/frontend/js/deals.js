// Deals page JavaScript for Dealmaker CRM

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    
    // Initialize view toggle
    initViewToggle();
    
    // Initialize deal form handlers
    initDealForm();
    
    // Initialize filter handlers
    initFilters();
    
    // Initialize drag and drop for kanban view
    initDragAndDrop();
    
    // Load deals data
    loadDeals();
});

// Initialize view toggle between kanban and list
function initViewToggle() {
    const kanbanViewBtn = document.getElementById('kanbanViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const kanbanView = document.getElementById('kanbanView');
    const listView = document.getElementById('listView');
    
    if (kanbanViewBtn && listViewBtn) {
        kanbanViewBtn.addEventListener('click', function() {
            kanbanView.style.display = 'block';
            listView.style.display = 'none';
            kanbanViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        });
        
        listViewBtn.addEventListener('click', function() {
            kanbanView.style.display = 'none';
            listView.style.display = 'block';
            listViewBtn.classList.add('active');
            kanbanViewBtn.classList.remove('active');
        });
    }
}

// Initialize deal form
function initDealForm() {
    const saveButton = document.getElementById('saveDeal');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            saveDeal();
        });
    }
    
    // Add contact to deal
    const addContactButton = document.getElementById('addContactToDeal');
    if (addContactButton) {
        addContactButton.addEventListener('click', function() {
            addContactToDeal();
        });
    }
    
    // Show probability value
    const probabilitySlider = document.getElementById('probability');
    if (probabilitySlider) {
        probabilitySlider.addEventListener('input', function() {
            // Could add a visual indicator of the current value
            console.log('Probability:', this.value + '%');
        });
    }
    
    // Calculate success fee amount when deal value or percentage changes
    const dealValue = document.getElementById('dealValue');
    const successFeePercentage = document.getElementById('successFeePercentage');
    
    if (dealValue && successFeePercentage) {
        const updateSuccessFee = function() {
            const value = parseFloat(dealValue.value) || 0;
            const percentage = parseFloat(successFeePercentage.value) || 0;
            const successFee = (value * percentage / 100).toFixed(2);
            console.log('Success fee amount:', '$' + successFee);
        };
        
        dealValue.addEventListener('input', updateSuccessFee);
        successFeePercentage.addEventListener('input', updateSuccessFee);
    }
}

// Add contact to deal
function addContactToDeal() {
    const contactSelect = document.getElementById('contactSelect');
    const contactRole = document.getElementById('contactRole');
    const dealContactsList = document.getElementById('dealContactsList');
    
    if (contactSelect && contactRole && dealContactsList) {
        const contactId = contactSelect.value;
        const contactName = contactSelect.options[contactSelect.selectedIndex].text;
        const role = contactRole.value;
        const roleText = contactRole.options[contactRole.selectedIndex].text;
        
        if (contactId) {
            // Check if contact is already added
            const existingContact = dealContactsList.querySelector(`[data-contact-id="${contactId}"]`);
            if (existingContact) {
                showAlert('This contact is already added to the deal.', 'warning');
                return;
            }
            
            // Create contact item
            const contactItem = document.createElement('div');
            contactItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            contactItem.setAttribute('data-contact-id', contactId);
            contactItem.setAttribute('data-role', role);
            
            contactItem.innerHTML = `
                <div>
                    <strong>${contactName}</strong>
                    <span class="badge bg-secondary ms-2">${roleText}</span>
                </div>
                <button type="button" class="btn btn-sm btn-outline-danger remove-contact">
                    <i class="bi bi-x"></i>
                </button>
            `;
            
            // Add remove button handler
            const removeButton = contactItem.querySelector('.remove-contact');
            removeButton.addEventListener('click', function() {
                dealContactsList.removeChild(contactItem);
            });
            
            // Add to list
            dealContactsList.appendChild(contactItem);
            
            // Reset select
            contactSelect.value = '';
        }
    }
}

// Save deal to API
async function saveDeal() {
    const form = document.getElementById('addDealForm');
    
    // Basic form validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Get form values
    const dealData = {
        name: document.getElementById('dealName').value,
        type: document.getElementById('dealType').value,
        stage: document.getElementById('dealStage').value,
        value: parseFloat(document.getElementById('dealValue').value) || 0,
        engagement_fee: parseFloat(document.getElementById('engagementFee').value) || 0,
        success_fee_percentage: parseFloat(document.getElementById('successFeePercentage').value) || 0,
        success_fee_amount: (parseFloat(document.getElementById('dealValue').value) || 0) * 
                           (parseFloat(document.getElementById('successFeePercentage').value) || 0) / 100,
        probability: parseInt(document.getElementById('probability').value) || 0,
        expected_close_date: document.getElementById('expectedCloseDate').value,
        description: document.getElementById('dealDescription').value,
        contacts: []
    };
    
    // Get contacts
    const contactItems = document.querySelectorAll('#dealContactsList .list-group-item');
    contactItems.forEach(item => {
        dealData.contacts.push({
            contact_id: item.getAttribute('data-contact-id'),
            role: item.getAttribute('data-role')
        });
    });
    
    try {
        // For prototype, log the data instead of sending to API
        console.log('Saving deal:', dealData);
        
        // This would normally send to the API
        /*
        const response = await window.dealmakerAPI.post('deals', dealData);
        if (response) {
            // Close modal and refresh deals
            const modal = bootstrap.Modal.getInstance(document.getElementById('addDealModal'));
            modal.hide();
            loadDeals();
        }
        */
        
        // For prototype, simulate success
        const modal = bootstrap.Modal.getInstance(document.getElementById('addDealModal'));
        modal.hide();
        
        // Show success message
        showAlert('Deal saved successfully!', 'success');
        
        // Reset form
        form.reset();
        document.getElementById('dealContactsList').innerHTML = '';
        
    } catch (error) {
        console.error('Error saving deal:', error);
        showAlert('Error saving deal. Please try again.', 'danger');
    }
}

// Initialize filters
function initFilters() {
    const resetButton = document.getElementById('resetDealFilters');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // Reset all filter selects
            document.getElementById('dealTypeFilter').value = '';
            document.getElementById('dealStageFilter').value = '';
            document.getElementById('dealValueFilter').value = '';
            document.getElementById('dealProbabilityFilter').value = '';
        });
    }
    
    const applyButton = document.getElementById('applyDealFilters');
    if (applyButton) {
        applyButton.addEventListener('click', function() {
            // Apply filters and reload deals
            loadDeals();
        });
    }
}

// Initialize drag and drop for kanban view
function initDragAndDrop() {
    // This would implement drag and drop functionality for the kanban cards
    // For the prototype, we'll just log the concept
    console.log('Drag and drop would be implemented here for production version');
    
    // Example of how it would work:
    // 1. Make cards draggable
    // 2. Add event listeners for dragstart, dragover, and drop
    // 3. When a card is dropped in a new stage, update the deal's stage in the database
}

// Load deals from API
async function loadDeals() {
    // Get filter values
    const typeFilter = document.getElementById('dealTypeFilter').value;
    const stageFilter = document.getElementById('dealStageFilter').value;
    const valueFilter = document.getElementById('dealValueFilter').value;
    const probabilityFilter = document.getElementById('dealProbabilityFilter').value;
    
    try {
        // For prototype, we're using static data in the HTML
        // This would normally fetch from the API with filter parameters
        /*
        const queryParams = new URLSearchParams();
        if (typeFilter) queryParams.append('type', typeFilter);
        if (stageFilter) queryParams.append('stage', stageFilter);
        if (valueFilter) queryParams.append('value', valueFilter);
        if (probabilityFilter) queryParams.append('probability', probabilityFilter);
        
        const deals = await window.dealmakerAPI.get(`deals?${queryParams.toString()}`);
        if (deals) {
            updateDealsTable(deals);
            updateKanbanView(deals);
        }
        */
        
        console.log('Filters applied:', { typeFilter, stageFilter, valueFilter, probabilityFilter });
        console.log('Deals loaded (static data for prototype)');
        
    } catch (error) {
        console.error('Error loading deals:', error);
        showAlert('Error loading deals. Please try again.', 'danger');
    }
}

// Update deals table with data
function updateDealsTable(deals) {
    const tableBody = document.querySelector('#dealsTable tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    deals.forEach(deal => {
        const row = document.createElement('tr');
        
        // Determine badge class based on deal type
        let badgeClass = 'bg-secondary';
        switch (deal.type) {
            case 'Equity':
                badgeClass = 'bg-primary';
                break;
            case 'Debt':
                badgeClass = 'bg-success';
                break;
            case 'M&A':
                badgeClass = 'bg-danger';
                break;
        }
        
        // Determine progress bar class based on probability
        let progressClass = 'bg-danger';
        if (deal.probability >= 70) {
            progressClass = 'bg-success';
        } else if (deal.probability >= 30) {
            progressClass = 'bg-warning';
        }
        
        // Format stage name for display
        let stageName = deal.stage.replace(/([A-Z])/g, ' $1').trim();
        stageName = stageName.charAt(0).toUpperCase() + stageName.slice(1);
        
        row.innerHTML = `
            <td>${deal.name}</td>
            <td><span class="badge ${badgeClass}">${deal.type}</span></td>
            <td>${stageName}</td>
            <td>$${formatNumber(deal.value)}</td>
            <td>$${formatNumber(deal.engagement_fee)}</td>
            <td>$${formatNumber(deal.success_fee_amount)} (${deal.success_fee_percentage}%)</td>
            <td>
                <div class="progress">
                    <div class="progress-bar ${progressClass}" role="progressbar" 
                         style="width: ${deal.probability}%;" 
                         aria-valuenow="${deal.probability}" 
                         aria-valuemin="0" 
                         aria-valuemax="100">${deal.probability}%</div>
                </div>
            </td>
            <td>${formatDate(deal.expected_close_date)}</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" data-bs-toggle="tooltip" title="View" 
                            onclick="viewDeal(${deal.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="tooltip" title="Edit" 
                            onclick="editDeal(${deal.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" data-bs-toggle="tooltip" title="Delete" 
                            onclick="deleteDeal(${deal.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Reinitialize tooltips for new buttons
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
}

// Update kanban view with data
function updateKanbanView(deals) {
    // Group deals by stage
    const dealsByStage = {};
    deals.forEach(deal => {
        if (!dealsByStage[deal.stage]) {
            dealsByStage[deal.stage] = [];
        }
        dealsByStage[deal.stage].push(deal);
    });
    
    // Update each pipeline stage
    const stages = ['identification', 'qualification', 'proposal', 'active', 'closed'];
    stages.forEach(stage => {
        const stageDeals = dealsByStage[stage] || [];
        const stageElement = document.querySelector(`.pipeline-stage[data-stage="${stage}"]`);
        
        if (stageElement) {
            // Update count
            const countElement = stageElement.querySelector('.pipeline-count');
            if (countElement) {
                countElement.textContent = stageDeals.length;
            }
            
            // Clear existing cards
            const cards = stageElement.querySelectorAll('.pipeline-card');
            cards.forEach(card => card.remove());
            
            // Add deal cards
            stageDeals.forEach(deal => {
                // Determine badge class based on deal type
                let badgeClass = 'bg-secondary';
                switch (deal.type) {
                    case 'Equity':
                        badgeClass = 'bg-primary';
                        break;
                    case 'Debt':
                        badgeClass = 'bg-success';
                        break;
                    case 'M&A':
                        badgeClass = 'bg-danger';
                        break;
                }
                
                const card = document.createElement('div');
                card.className = 'pipeline-card';
                card.setAttribute('data-deal-id', deal.id);
                card.setAttribute('draggable', 'true');
                card.innerHTML = `
                    <div class="pipeline-card-title">${deal.name}</div>
                    <div class="pipeline-card-value">$${formatNumber(deal.value)}</div>
                    <div class="pipeline-card-type"><span class="badge ${badgeClass}">${deal.type}</span></div>
                    <div class="pipeline-card-probability">Probability: ${deal.probability}%</div>
                `;
                
                // Add drag events
                card.addEventListener('dragstart', function(e) {
                    e.dataTransfer.setData('text/plain', deal.id);
                    e.dataTransfer.effectAllowed = 'move';
                });
                
                stageElement.appendChild(card);
            });
        }
    });
}

// View deal details
function viewDeal(dealId) {
    console.log('Viewing deal:', dealId);
    // This would normally fetch deal details and show in a modal
    showAlert('Deal details view not implemented in prototype', 'info');
}

// Edit deal
function editDeal(dealId) {
    console.log('Editing deal:', dealId);
    // This would normally fetch deal details and populate the edit form
    showAlert('Deal editing not implemented in prototype', 'info');
}

// Delete deal
function deleteDeal(dealId) {
    console.log('Deleting deal:', dealId);
    // This would normally show a confirmation dialog and then delete
    showAlert('Deal deletion not implemented in prototype', 'info');
}

// Helper function to format numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Helper function to format dates
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Show alert message
function showAlert(message, type = 'info') {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add to page
    const content = document.getElementById('content');
    content.insertBefore(alertDiv, content.firstChild);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, 5000);
}
