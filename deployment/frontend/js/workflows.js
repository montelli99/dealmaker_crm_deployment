// JavaScript for workflows.js
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

    // Handle workflow creation
    document.getElementById('createWorkflowBtn').addEventListener('click', function() {
        const form = document.getElementById('createWorkflowForm');
        if (form.checkValidity()) {
            // Here you would normally send the data to the server
            // For now, we'll just show a success message and close the modal
            alert('Workflow created successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('createWorkflowModal'));
            modal.hide();
            
            // Add the new workflow to the list (in a real app, this would come from the server)
            addWorkflowToList({
                id: Date.now(),
                name: document.getElementById('workflowName').value,
                description: document.getElementById('workflowDescription').value,
                type: document.getElementById('workflowType').value,
                status: 'Active',
                steps: parseInt(document.getElementById('workflowSteps').value) || 3
            });
            
            // Reset the form
            form.reset();
        } else {
            form.reportValidity();
        }
    });

    // Function to add a workflow to the list
    function addWorkflowToList(workflow) {
        const workflowsList = document.getElementById('workflowsList');
        
        const workflowCard = document.createElement('div');
        workflowCard.className = 'col-md-6 col-lg-4 mb-4';
        workflowCard.innerHTML = `
            <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">${workflow.name}</h5>
                    <span class="badge bg-success">${workflow.status}</span>
                </div>
                <div class="card-body">
                    <p class="card-text">${workflow.description}</p>
                    <p class="text-muted small">Type: ${workflow.type} | Steps: ${workflow.steps}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-sm btn-outline-primary edit-workflow" data-id="${workflow.id}">Edit</button>
                    <button class="btn btn-sm btn-outline-danger delete-workflow" data-id="${workflow.id}">Delete</button>
                </div>
            </div>
        `;
        
        workflowsList.appendChild(workflowCard);
        
        // Add event listeners to the new buttons
        workflowCard.querySelector('.edit-workflow').addEventListener('click', function() {
            editWorkflow(workflow.id);
        });
        
        workflowCard.querySelector('.delete-workflow').addEventListener('click', function() {
            deleteWorkflow(workflow.id, workflowCard);
        });
    }

    // Function to edit a workflow
    function editWorkflow(workflowId) {
        // In a real app, you would fetch the workflow details from the server
        // For now, we'll just show a modal with some placeholder data
        document.getElementById('editWorkflowId').value = workflowId;
        document.getElementById('editWorkflowName').value = 'Workflow ' + workflowId;
        document.getElementById('editWorkflowDescription').value = 'This is workflow ' + workflowId;
        document.getElementById('editWorkflowType').value = 'deal_progression';
        document.getElementById('editWorkflowSteps').value = '3';
        
        const modal = new bootstrap.Modal(document.getElementById('editWorkflowModal'));
        modal.show();
    }

    // Function to delete a workflow
    function deleteWorkflow(workflowId, workflowCard) {
        if (confirm('Are you sure you want to delete this workflow?')) {
            // In a real app, you would send a delete request to the server
            // For now, we'll just remove the card from the DOM
            workflowCard.remove();
            alert('Workflow deleted successfully!');
        }
    }

    // Handle workflow update
    document.getElementById('updateWorkflowBtn').addEventListener('click', function() {
        const form = document.getElementById('editWorkflowForm');
        if (form.checkValidity()) {
            // Here you would normally send the data to the server
            // For now, we'll just show a success message and close the modal
            alert('Workflow updated successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('editWorkflowModal'));
            modal.hide();
        } else {
            form.reportValidity();
        }
    });

    // Initialize existing workflows with event listeners
    document.querySelectorAll('.edit-workflow').forEach(button => {
        button.addEventListener('click', function() {
            const workflowId = this.getAttribute('data-id');
            editWorkflow(workflowId);
        });
    });

    document.querySelectorAll('.delete-workflow').forEach(button => {
        button.addEventListener('click', function() {
            const workflowId = this.getAttribute('data-id');
            const workflowCard = this.closest('.col-md-6');
            deleteWorkflow(workflowId, workflowCard);
        });
    });

    // Handle workflow template selection
    document.getElementById('workflowTemplate').addEventListener('change', function() {
        const workflowName = document.getElementById('workflowName');
        const workflowDescription = document.getElementById('workflowDescription');
        const workflowType = document.getElementById('workflowType');
        const workflowSteps = document.getElementById('workflowSteps');
        
        switch(this.value) {
            case 'deal_progression':
                workflowName.value = 'Deal Progression Workflow';
                workflowDescription.value = 'Automates the progression of deals through various stages from initial contact to closing.';
                workflowType.value = 'deal_progression';
                workflowSteps.value = '5';
                break;
            case 'client_onboarding':
                workflowName.value = 'Client Onboarding Workflow';
                workflowDescription.value = 'Streamlines the process of onboarding new clients with automated document collection and welcome sequences.';
                workflowType.value = 'client_onboarding';
                workflowSteps.value = '4';
                break;
            case 'investor_matching':
                workflowName.value = 'Investor Matching Workflow';
                workflowDescription.value = 'Automatically matches potential investors with deals based on investment criteria and preferences.';
                workflowType.value = 'investor_matching';
                workflowSteps.value = '3';
                break;
            case 'follow_up_sequence':
                workflowName.value = 'Follow-up Sequence Workflow';
                workflowDescription.value = 'Manages timed follow-up communications with prospects and clients to maintain engagement.';
                workflowType.value = 'follow_up_sequence';
                workflowSteps.value = '6';
                break;
            case 'custom':
                workflowName.value = '';
                workflowDescription.value = '';
                workflowType.value = 'custom';
                workflowSteps.value = '3';
                break;
        }
    });

    // Handle workflow type change to show/hide relevant fields
    document.getElementById('workflowType').addEventListener('change', function() {
        const dealFields = document.getElementById('dealWorkflowFields');
        const clientFields = document.getElementById('clientWorkflowFields');
        
        // Hide all specific fields first
        dealFields.style.display = 'none';
        clientFields.style.display = 'none';
        
        // Show relevant fields based on selection
        if (this.value === 'deal_progression' || this.value === 'investor_matching') {
            dealFields.style.display = 'block';
        } else if (this.value === 'client_onboarding' || this.value === 'follow_up_sequence') {
            clientFields.style.display = 'block';
        }
    });

    // Initialize the workflow builder if it exists
    const workflowBuilder = document.getElementById('workflowBuilder');
    if (workflowBuilder) {
        initializeWorkflowBuilder();
    }

    function initializeWorkflowBuilder() {
        // Make workflow steps sortable
        new Sortable(document.getElementById('workflowStepsList'), {
            animation: 150,
            handle: '.drag-handle',
            onEnd: function() {
                // Renumber steps after sorting
                renumberWorkflowSteps();
            }
        });

        // Add step button
        document.getElementById('addStepBtn').addEventListener('click', function() {
            const stepsList = document.getElementById('workflowStepsList');
            const stepCount = stepsList.children.length + 1;
            
            const stepItem = document.createElement('li');
            stepItem.className = 'list-group-item workflow-step';
            stepItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <span class="drag-handle me-2"><i class="fas fa-grip-vertical"></i></span>
                    <span class="step-number me-2">Step ${stepCount}:</span>
                    <select class="form-select form-select-sm step-type me-2" style="width: 150px;">
                        <option value="email">Send Email</option>
                        <option value="call">Make Call</option>
                        <option value="task">Create Task</option>
                        <option value="wait">Wait</option>
                        <option value="condition">Condition</option>
                    </select>
                    <input type="text" class="form-control form-control-sm step-name" placeholder="Step name">
                    <div class="ms-auto">
                        <button type="button" class="btn btn-sm btn-outline-primary edit-step-btn"><i class="fas fa-cog"></i></button>
                        <button type="button" class="btn btn-sm btn-outline-danger delete-step-btn"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
            
            stepsList.appendChild(stepItem);
            
            // Add event listeners to the new buttons
            stepItem.querySelector('.edit-step-btn').addEventListener('click', function() {
                editWorkflowStep(stepItem);
            });
            
            stepItem.querySelector('.delete-step-btn').addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this step?')) {
                    stepItem.remove();
                    renumberWorkflowSteps();
                }
            });
            
            // Add event listener to step type select
            stepItem.querySelector('.step-type').addEventListener('change', function() {
                updateStepName(stepItem);
            });
            
            // Initialize the step name based on the type
            updateStepName(stepItem);
        });

        // Initialize existing step buttons
        document.querySelectorAll('.edit-step-btn').forEach(button => {
            button.addEventListener('click', function() {
                const stepItem = this.closest('.workflow-step');
                editWorkflowStep(stepItem);
            });
        });

        document.querySelectorAll('.delete-step-btn').forEach(button => {
            button.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this step?')) {
                    const stepItem = this.closest('.workflow-step');
                    stepItem.remove();
                    renumberWorkflowSteps();
                }
            });
        });

        // Initialize step type change listeners
        document.querySelectorAll('.step-type').forEach(select => {
            select.addEventListener('change', function() {
                const stepItem = this.closest('.workflow-step');
                updateStepName(stepItem);
            });
        });
    }

    function renumberWorkflowSteps() {
        const steps = document.querySelectorAll('.workflow-step');
        steps.forEach((step, index) => {
            step.querySelector('.step-number').textContent = `Step ${index + 1}:`;
        });
    }

    function updateStepName(stepItem) {
        const stepType = stepItem.querySelector('.step-type').value;
        const stepNameInput = stepItem.querySelector('.step-name');
        
        switch(stepType) {
            case 'email':
                stepNameInput.value = 'Send follow-up email';
                break;
            case 'call':
                stepNameInput.value = 'Schedule discovery call';
                break;
            case 'task':
                stepNameInput.value = 'Review proposal';
                break;
            case 'wait':
                stepNameInput.value = 'Wait 2 days';
                break;
            case 'condition':
                stepNameInput.value = 'Check if deal size > $1M';
                break;
        }
    }

    function editWorkflowStep(stepItem) {
        const stepType = stepItem.querySelector('.step-type').value;
        const stepName = stepItem.querySelector('.step-name').value;
        
        // Set modal fields based on step type
        document.getElementById('editStepType').value = stepType;
        document.getElementById('editStepName').value = stepName;
        
        // Show/hide relevant fields based on step type
        const emailFields = document.getElementById('emailStepFields');
        const callFields = document.getElementById('callStepFields');
        const taskFields = document.getElementById('taskStepFields');
        const waitFields = document.getElementById('waitStepFields');
        const conditionFields = document.getElementById('conditionStepFields');
        
        emailFields.style.display = 'none';
        callFields.style.display = 'none';
        taskFields.style.display = 'none';
        waitFields.style.display = 'none';
        conditionFields.style.display = 'none';
        
        switch(stepType) {
            case 'email':
                emailFields.style.display = 'block';
                break;
            case 'call':
                callFields.style.display = 'block';
                break;
            case 'task':
                taskFields.style.display = 'block';
                break;
            case 'wait':
                waitFields.style.display = 'block';
                break;
            case 'condition':
                conditionFields.style.display = 'block';
                break;
        }
        
        // Store reference to the step item being edited
        document.getElementById('editStepModal').setAttribute('data-step-item', stepItem);
        
        const modal = new bootstrap.Modal(document.getElementById('editStepModal'));
        modal.show();
    }

    // Handle step update
    document.getElementById('updateStepBtn').addEventListener('click', function() {
        const form = document.getElementById('editStepForm');
        if (form.checkValidity()) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('editStepModal'));
            const stepItem = document.getElementById('editStepModal').getAttribute('data-step-item');
            
            // Update the step name in the list
            stepItem.querySelector('.step-name').value = document.getElementById('editStepName').value;
            
            modal.hide();
            alert('Step updated successfully!');
        } else {
            form.reportValidity();
        }
    });

    // Handle save workflow button
    document.getElementById('saveWorkflowBtn').addEventListener('click', function() {
        alert('Workflow saved successfully!');
        // In a real app, you would save the workflow to the server
        window.location.href = 'workflows.html';
    });
});
