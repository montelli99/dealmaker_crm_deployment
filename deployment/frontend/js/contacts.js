// Contacts page JavaScript for Dealmaker CRM

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    
    // Initialize contact form handlers
    initContactForm();
    
    // Initialize filter handlers
    initFilters();
    
    // Load contacts data
    loadContacts();
});

// Initialize contact form
function initContactForm() {
    const saveButton = document.getElementById('saveContact');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            saveContact();
        });
    }
    
    // Show relationship strength value
    const strengthSlider = document.getElementById('relationshipStrength');
    if (strengthSlider) {
        strengthSlider.addEventListener('input', function() {
            // Could add a visual indicator of the current value
            console.log('Relationship strength:', this.value);
        });
    }
}

// Save contact to API
async function saveContact() {
    const form = document.getElementById('addContactForm');
    
    // Basic form validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Get form values
    const contactData = {
        type: document.getElementById('contactType').value,
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        company: document.getElementById('company').value,
        position: document.getElementById('position').value,
        industry: document.getElementById('industry').value,
        linkedin_url: document.getElementById('linkedinUrl').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        status: document.getElementById('contactStatus').value,
        relationship_strength: document.getElementById('relationshipStrength').value,
        notes: document.getElementById('notes').value
    };
    
    try {
        // For prototype, log the data instead of sending to API
        console.log('Saving contact:', contactData);
        
        // This would normally send to the API
        /*
        const response = await window.dealmakerAPI.post('contacts', contactData);
        if (response) {
            // Close modal and refresh contacts
            const modal = bootstrap.Modal.getInstance(document.getElementById('addContactModal'));
            modal.hide();
            loadContacts();
        }
        */
        
        // For prototype, simulate success
        const modal = bootstrap.Modal.getInstance(document.getElementById('addContactModal'));
        modal.hide();
        
        // Show success message
        showAlert('Contact saved successfully!', 'success');
        
        // Reset form
        form.reset();
        
    } catch (error) {
        console.error('Error saving contact:', error);
        showAlert('Error saving contact. Please try again.', 'danger');
    }
}

// Initialize filters
function initFilters() {
    const resetButton = document.getElementById('resetFilters');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // Reset all filter selects
            document.getElementById('contactTypeFilter').value = '';
            document.getElementById('industryFilter').value = '';
            document.getElementById('relationshipFilter').value = '';
            document.getElementById('statusFilter').value = '';
        });
    }
    
    const applyButton = document.getElementById('applyFilters');
    if (applyButton) {
        applyButton.addEventListener('click', function() {
            // Apply filters and reload contacts
            loadContacts();
        });
    }
}

// Load contacts from API
async function loadContacts() {
    // Get filter values
    const typeFilter = document.getElementById('contactTypeFilter').value;
    const industryFilter = document.getElementById('industryFilter').value;
    const relationshipFilter = document.getElementById('relationshipFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    try {
        // For prototype, we're using static data in the HTML
        // This would normally fetch from the API with filter parameters
        /*
        const queryParams = new URLSearchParams();
        if (typeFilter) queryParams.append('type', typeFilter);
        if (industryFilter) queryParams.append('industry', industryFilter);
        if (relationshipFilter) queryParams.append('relationship', relationshipFilter);
        if (statusFilter) queryParams.append('status', statusFilter);
        
        const contacts = await window.dealmakerAPI.get(`contacts?${queryParams.toString()}`);
        if (contacts) {
            updateContactsTable(contacts);
        }
        */
        
        console.log('Filters applied:', { typeFilter, industryFilter, relationshipFilter, statusFilter });
        console.log('Contacts loaded (static data for prototype)');
        
    } catch (error) {
        console.error('Error loading contacts:', error);
        showAlert('Error loading contacts. Please try again.', 'danger');
    }
}

// Update contacts table with data
function updateContactsTable(contacts) {
    const tableBody = document.querySelector('#contactsTable tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    contacts.forEach(contact => {
        const row = document.createElement('tr');
        
        // Determine badge class based on contact type
        let badgeClass = 'bg-secondary';
        switch (contact.type) {
            case 'Prospect':
                badgeClass = 'bg-warning';
                break;
            case 'Client':
                badgeClass = 'bg-primary';
                break;
            case 'Advisor':
                badgeClass = 'bg-info';
                break;
            case 'Partner':
                badgeClass = 'bg-success';
                break;
        }
        
        // Determine progress bar class based on relationship strength
        let progressClass = 'bg-danger';
        if (contact.relationship_strength >= 7) {
            progressClass = 'bg-success';
        } else if (contact.relationship_strength >= 4) {
            progressClass = 'bg-warning';
        }
        
        row.innerHTML = `
            <td>${contact.first_name} ${contact.last_name}</td>
            <td><span class="badge ${badgeClass}">${contact.type}</span></td>
            <td>${contact.company || ''}</td>
            <td>${contact.position || ''}</td>
            <td>${contact.industry || ''}</td>
            <td>${contact.email || ''}</td>
            <td>${contact.phone || ''}</td>
            <td>
                <div class="progress">
                    <div class="progress-bar ${progressClass}" role="progressbar" 
                         style="width: ${contact.relationship_strength * 10}%;" 
                         aria-valuenow="${contact.relationship_strength}" 
                         aria-valuemin="0" 
                         aria-valuemax="10">${contact.relationship_strength}</div>
                </div>
            </td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" data-bs-toggle="tooltip" title="View" 
                            onclick="viewContact(${contact.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="tooltip" title="Edit" 
                            onclick="editContact(${contact.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" data-bs-toggle="tooltip" title="Delete" 
                            onclick="deleteContact(${contact.id})">
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

// View contact details
function viewContact(contactId) {
    console.log('Viewing contact:', contactId);
    // This would normally fetch contact details and show in a modal
    showAlert('Contact details view not implemented in prototype', 'info');
}

// Edit contact
function editContact(contactId) {
    console.log('Editing contact:', contactId);
    // This would normally fetch contact details and populate the edit form
    showAlert('Contact editing not implemented in prototype', 'info');
}

// Delete contact
function deleteContact(contactId) {
    console.log('Deleting contact:', contactId);
    // This would normally show a confirmation dialog and then delete
    showAlert('Contact deletion not implemented in prototype', 'info');
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
