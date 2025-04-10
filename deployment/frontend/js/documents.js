// JavaScript for documents.js
document.addEventListener('DOMContentLoaded', function() {
    // Toggle sidebar
    document.getElementById('sidebarCollapse').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Handle document upload
    document.getElementById('uploadDocumentBtn').addEventListener('click', function() {
        const form = document.getElementById('uploadDocumentForm');
        if (form.checkValidity()) {
            // Here you would normally send the data to the server
            // For now, we'll just show a success message and close the modal
            alert('Document uploaded successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('uploadDocumentModal'));
            modal.hide();
            
            // Add the new document to the list (in a real app, this would come from the server)
            addDocumentToList({
                id: Date.now(),
                name: document.getElementById('documentName').value,
                type: document.getElementById('documentType').value,
                relatedTo: document.getElementById('documentRelatedTo').value,
                uploadedBy: 'Current User',
                uploadDate: new Date().toISOString().split('T')[0],
                size: '1.2 MB' // Placeholder size
            });
            
            // Reset the form
            form.reset();
        } else {
            form.reportValidity();
        }
    });

    // Function to add a document to the list
    function addDocumentToList(document) {
        const documentsList = document.getElementById('documentsList');
        
        const documentRow = document.createElement('tr');
        documentRow.innerHTML = `
            <td>
                <span class="document-icon">
                    ${getDocumentIcon(document.type)}
                </span>
                ${document.name}
            </td>
            <td>${document.type}</td>
            <td>${document.relatedTo}</td>
            <td>${document.uploadedBy}</td>
            <td>${document.uploadDate}</td>
            <td>${document.size}</td>
            <td>
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-primary view-document" data-id="${document.id}">View</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary download-document" data-id="${document.id}">Download</button>
                    <button type="button" class="btn btn-sm btn-outline-danger delete-document" data-id="${document.id}">Delete</button>
                </div>
            </td>
        `;
        
        documentsList.appendChild(documentRow);
        
        // Add event listeners to the new buttons
        documentRow.querySelector('.view-document').addEventListener('click', function() {
            viewDocument(document.id);
        });
        
        documentRow.querySelector('.download-document').addEventListener('click', function() {
            downloadDocument(document.id);
        });
        
        documentRow.querySelector('.delete-document').addEventListener('click', function() {
            deleteDocument(document.id, documentRow);
        });
    }

    // Function to get the appropriate icon for a document type
    function getDocumentIcon(type) {
        switch(type) {
            case 'Contract':
                return '<i class="fas fa-file-contract text-primary"></i>';
            case 'Proposal':
                return '<i class="fas fa-file-powerpoint text-danger"></i>';
            case 'NDA':
                return '<i class="fas fa-file-signature text-warning"></i>';
            case 'Financial':
                return '<i class="fas fa-file-invoice-dollar text-success"></i>';
            case 'Legal':
                return '<i class="fas fa-file-alt text-info"></i>';
            case 'Other':
                return '<i class="fas fa-file text-secondary"></i>';
            default:
                return '<i class="fas fa-file text-dark"></i>';
        }
    }

    // Function to view a document
    function viewDocument(documentId) {
        // In a real app, you would fetch the document from the server and display it
        // For now, we'll just show a modal with a placeholder message
        alert(`Viewing document ${documentId}. In a real application, this would open the document in a viewer.`);
    }

    // Function to download a document
    function downloadDocument(documentId) {
        // In a real app, you would initiate a download of the document
        // For now, we'll just show a placeholder message
        alert(`Downloading document ${documentId}. In a real application, this would start the download.`);
    }

    // Function to delete a document
    function deleteDocument(documentId, documentRow) {
        if (confirm('Are you sure you want to delete this document?')) {
            // In a real app, you would send a delete request to the server
            // For now, we'll just remove the row from the DOM
            documentRow.remove();
            alert('Document deleted successfully!');
        }
    }

    // Initialize existing documents with event listeners
    document.querySelectorAll('.view-document').forEach(button => {
        button.addEventListener('click', function() {
            const documentId = this.getAttribute('data-id');
            viewDocument(documentId);
        });
    });

    document.querySelectorAll('.download-document').forEach(button => {
        button.addEventListener('click', function() {
            const documentId = this.getAttribute('data-id');
            downloadDocument(documentId);
        });
    });

    document.querySelectorAll('.delete-document').forEach(button => {
        button.addEventListener('click', function() {
            const documentId = this.getAttribute('data-id');
            const documentRow = this.closest('tr');
            deleteDocument(documentId, documentRow);
        });
    });

    // Handle document type filter
    document.getElementById('documentTypeFilter').addEventListener('change', function() {
        const filterValue = this.value.toLowerCase();
        const rows = document.querySelectorAll('#documentsList tr');
        
        rows.forEach(row => {
            const type = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            if (filterValue === 'all' || type === filterValue) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Handle document search
    document.getElementById('documentSearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#documentsList tr');
        
        rows.forEach(row => {
            const name = row.querySelector('td:first-child').textContent.trim().toLowerCase();
            const relatedTo = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
            
            if (name.includes(searchTerm) || relatedTo.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Handle document template selection
    document.getElementById('documentTemplate').addEventListener('change', function() {
        const documentName = document.getElementById('documentName');
        const documentType = document.getElementById('documentType');
        
        switch(this.value) {
            case 'engagement_agreement':
                documentName.value = 'Engagement Agreement';
                documentType.value = 'Contract';
                break;
            case 'nda':
                documentName.value = 'Non-Disclosure Agreement';
                documentType.value = 'NDA';
                break;
            case 'capital_raising_proposal':
                documentName.value = 'Capital Raising Proposal';
                documentType.value = 'Proposal';
                break;
            case 'ma_proposal':
                documentName.value = 'M&A Advisory Proposal';
                documentType.value = 'Proposal';
                break;
            case 'financial_model':
                documentName.value = 'Financial Model Template';
                documentType.value = 'Financial';
                break;
            case 'custom':
                documentName.value = '';
                documentType.value = 'Other';
                break;
        }
    });

    // Handle generate document button
    document.getElementById('generateDocumentBtn').addEventListener('click', function() {
        const form = document.getElementById('generateDocumentForm');
        if (form.checkValidity()) {
            alert('Document generated successfully! You can now download or edit it.');
            const modal = bootstrap.Modal.getInstance(document.getElementById('generateDocumentModal'));
            modal.hide();
            
            // Add the new document to the list
            addDocumentToList({
                id: Date.now(),
                name: document.getElementById('generatedDocumentName').value,
                type: document.getElementById('generatedDocumentType').value,
                relatedTo: document.getElementById('generatedDocumentRelatedTo').value,
                uploadedBy: 'Current User',
                uploadDate: new Date().toISOString().split('T')[0],
                size: '0.8 MB' // Placeholder size
            });
            
            // Reset the form
            form.reset();
        } else {
            form.reportValidity();
        }
    });

    // Handle bulk actions
    document.getElementById('bulkActionBtn').addEventListener('click', function() {
        const action = document.getElementById('bulkAction').value;
        const selectedRows = document.querySelectorAll('#documentsList tr input[type="checkbox"]:checked');
        
        if (selectedRows.length === 0) {
            alert('Please select at least one document.');
            return;
        }
        
        switch(action) {
            case 'download':
                alert(`Downloading ${selectedRows.length} documents. In a real application, this would start the downloads.`);
                selectedRows.forEach(checkbox => {
                    checkbox.checked = false;
                });
                break;
            case 'delete':
                if (confirm(`Are you sure you want to delete ${selectedRows.length} documents?`)) {
                    selectedRows.forEach(checkbox => {
                        const row = checkbox.closest('tr');
                        row.remove();
                    });
                    alert('Selected documents deleted successfully!');
                }
                break;
            case 'share':
                const recipient = prompt('Enter the email address to share these documents with:');
                if (recipient) {
                    alert(`Documents shared with ${recipient}!`);
                    selectedRows.forEach(checkbox => {
                        checkbox.checked = false;
                    });
                }
                break;
        }
    });

    // Handle select all checkbox
    document.getElementById('selectAllDocuments').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('#documentsList tr input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
});
