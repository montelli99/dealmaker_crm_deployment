// JavaScript for activities.js
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

    // Handle activity creation
    document.getElementById('createActivityBtn').addEventListener('click', function() {
        const form = document.getElementById('createActivityForm');
        if (form.checkValidity()) {
            // Here you would normally send the data to the server
            // For now, we'll just show a success message and close the modal
            alert('Activity created successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('createActivityModal'));
            modal.hide();
            
            // Add the new activity to the list (in a real app, this would come from the server)
            addActivityToList({
                id: Date.now(),
                type: document.getElementById('activityType').value,
                subject: document.getElementById('activitySubject').value,
                relatedTo: document.getElementById('activityRelatedTo').value,
                dueDate: document.getElementById('activityDueDate').value,
                assignedTo: document.getElementById('activityAssignedTo').value,
                status: 'Pending'
            });
            
            // Reset the form
            form.reset();
        } else {
            form.reportValidity();
        }
    });

    // Function to add an activity to the list
    function addActivityToList(activity) {
        const activitiesList = document.getElementById('activitiesList');
        
        const activityRow = document.createElement('tr');
        activityRow.innerHTML = `
            <td>
                <span class="activity-icon">
                    ${getActivityIcon(activity.type)}
                </span>
                ${activity.type}
            </td>
            <td>${activity.subject}</td>
            <td>${activity.relatedTo}</td>
            <td>${activity.dueDate}</td>
            <td>${activity.assignedTo}</td>
            <td><span class="badge bg-warning">${activity.status}</span></td>
            <td>
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-primary complete-activity" data-id="${activity.id}">Complete</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary edit-activity" data-id="${activity.id}">Edit</button>
                    <button type="button" class="btn btn-sm btn-outline-danger delete-activity" data-id="${activity.id}">Delete</button>
                </div>
            </td>
        `;
        
        activitiesList.appendChild(activityRow);
        
        // Add event listeners to the new buttons
        activityRow.querySelector('.complete-activity').addEventListener('click', function() {
            completeActivity(activity.id, activityRow);
        });
        
        activityRow.querySelector('.edit-activity').addEventListener('click', function() {
            editActivity(activity.id);
        });
        
        activityRow.querySelector('.delete-activity').addEventListener('click', function() {
            deleteActivity(activity.id, activityRow);
        });
    }

    // Function to get the appropriate icon for an activity type
    function getActivityIcon(type) {
        switch(type) {
            case 'Call':
                return '<i class="fas fa-phone-alt text-primary"></i>';
            case 'Meeting':
                return '<i class="fas fa-users text-success"></i>';
            case 'Task':
                return '<i class="fas fa-tasks text-warning"></i>';
            case 'Email':
                return '<i class="fas fa-envelope text-info"></i>';
            case 'Note':
                return '<i class="fas fa-sticky-note text-secondary"></i>';
            default:
                return '<i class="fas fa-calendar-check text-dark"></i>';
        }
    }

    // Function to complete an activity
    function completeActivity(activityId, activityRow) {
        // In a real app, you would send a request to the server to update the activity status
        // For now, we'll just update the UI
        const statusCell = activityRow.querySelector('td:nth-child(6)');
        statusCell.innerHTML = '<span class="badge bg-success">Completed</span>';
        
        // Disable the complete button
        const completeButton = activityRow.querySelector('.complete-activity');
        completeButton.disabled = true;
        completeButton.classList.remove('btn-outline-primary');
        completeButton.classList.add('btn-outline-secondary');
        
        alert('Activity marked as completed!');
    }

    // Function to edit an activity
    function editActivity(activityId) {
        // In a real app, you would fetch the activity details from the server
        // For now, we'll just show a modal with some placeholder data
        document.getElementById('editActivityId').value = activityId;
        document.getElementById('editActivityType').value = 'Call';
        document.getElementById('editActivitySubject').value = 'Follow up with client';
        document.getElementById('editActivityRelatedTo').value = 'ABC Corp Deal';
        document.getElementById('editActivityDueDate').value = '2025-04-15';
        document.getElementById('editActivityAssignedTo').value = 'John Doe';
        
        const modal = new bootstrap.Modal(document.getElementById('editActivityModal'));
        modal.show();
    }

    // Function to delete an activity
    function deleteActivity(activityId, activityRow) {
        if (confirm('Are you sure you want to delete this activity?')) {
            // In a real app, you would send a delete request to the server
            // For now, we'll just remove the row from the DOM
            activityRow.remove();
            alert('Activity deleted successfully!');
        }
    }

    // Handle activity update
    document.getElementById('updateActivityBtn').addEventListener('click', function() {
        const form = document.getElementById('editActivityForm');
        if (form.checkValidity()) {
            // Here you would normally send the data to the server
            // For now, we'll just show a success message and close the modal
            alert('Activity updated successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('editActivityModal'));
            modal.hide();
            
            // In a real app, you would update the activity in the list based on the server response
            // For now, we'll just reload the page to simulate the update
            // location.reload();
        } else {
            form.reportValidity();
        }
    });

    // Initialize existing activities with event listeners
    document.querySelectorAll('.complete-activity').forEach(button => {
        button.addEventListener('click', function() {
            const activityId = this.getAttribute('data-id');
            const activityRow = this.closest('tr');
            completeActivity(activityId, activityRow);
        });
    });

    document.querySelectorAll('.edit-activity').forEach(button => {
        button.addEventListener('click', function() {
            const activityId = this.getAttribute('data-id');
            editActivity(activityId);
        });
    });

    document.querySelectorAll('.delete-activity').forEach(button => {
        button.addEventListener('click', function() {
            const activityId = this.getAttribute('data-id');
            const activityRow = this.closest('tr');
            deleteActivity(activityId, activityRow);
        });
    });

    // Handle filter change
    document.getElementById('activityFilter').addEventListener('change', function() {
        const filterValue = this.value.toLowerCase();
        const rows = document.querySelectorAll('#activitiesList tr');
        
        rows.forEach(row => {
            const type = row.querySelector('td:first-child').textContent.trim().toLowerCase();
            if (filterValue === 'all' || type === filterValue) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Handle date range filter
    document.getElementById('dateRangeFilter').addEventListener('change', function() {
        const filterValue = this.value;
        const today = new Date();
        const rows = document.querySelectorAll('#activitiesList tr');
        
        rows.forEach(row => {
            const dueDateStr = row.querySelector('td:nth-child(4)').textContent.trim();
            const dueDate = new Date(dueDateStr);
            
            let show = true;
            
            switch(filterValue) {
                case 'today':
                    show = dueDate.toDateString() === today.toDateString();
                    break;
                case 'tomorrow':
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    show = dueDate.toDateString() === tomorrow.toDateString();
                    break;
                case 'this_week':
                    const endOfWeek = new Date(today);
                    endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
                    show = dueDate >= today && dueDate <= endOfWeek;
                    break;
                case 'next_week':
                    const startOfNextWeek = new Date(today);
                    startOfNextWeek.setDate(startOfNextWeek.getDate() + (7 - startOfNextWeek.getDay() + 1));
                    const endOfNextWeek = new Date(startOfNextWeek);
                    endOfNextWeek.setDate(endOfNextWeek.getDate() + 6);
                    show = dueDate >= startOfNextWeek && dueDate <= endOfNextWeek;
                    break;
                case 'overdue':
                    show = dueDate < today;
                    break;
                // 'all' case - show everything
            }
            
            if (show) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Handle bulk actions
    document.getElementById('bulkActionBtn').addEventListener('click', function() {
        const action = document.getElementById('bulkAction').value;
        const selectedRows = document.querySelectorAll('#activitiesList tr input[type="checkbox"]:checked');
        
        if (selectedRows.length === 0) {
            alert('Please select at least one activity.');
            return;
        }
        
        switch(action) {
            case 'complete':
                if (confirm(`Are you sure you want to mark ${selectedRows.length} activities as completed?`)) {
                    selectedRows.forEach(checkbox => {
                        const row = checkbox.closest('tr');
                        const statusCell = row.querySelector('td:nth-child(6)');
                        statusCell.innerHTML = '<span class="badge bg-success">Completed</span>';
                        
                        const completeButton = row.querySelector('.complete-activity');
                        completeButton.disabled = true;
                        completeButton.classList.remove('btn-outline-primary');
                        completeButton.classList.add('btn-outline-secondary');
                        
                        checkbox.checked = false;
                    });
                    alert('Selected activities marked as completed!');
                }
                break;
            case 'delete':
                if (confirm(`Are you sure you want to delete ${selectedRows.length} activities?`)) {
                    selectedRows.forEach(checkbox => {
                        const row = checkbox.closest('tr');
                        row.remove();
                    });
                    alert('Selected activities deleted successfully!');
                }
                break;
            case 'reassign':
                const assignee = prompt('Enter the name of the person to reassign these activities to:');
                if (assignee) {
                    selectedRows.forEach(checkbox => {
                        const row = checkbox.closest('tr');
                        const assigneeCell = row.querySelector('td:nth-child(5)');
                        assigneeCell.textContent = assignee;
                        checkbox.checked = false;
                    });
                    alert(`Selected activities reassigned to ${assignee}!`);
                }
                break;
        }
    });

    // Handle select all checkbox
    document.getElementById('selectAllActivities').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('#activitiesList tr input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
});
