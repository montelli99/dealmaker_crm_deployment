// JavaScript for voice-agents.js
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

    // Handle voice agent creation
    document.getElementById('createAgentBtn').addEventListener('click', function() {
        const form = document.getElementById('createAgentForm');
        if (form.checkValidity()) {
            // Here you would normally send the data to the server
            // For now, we'll just show a success message and close the modal
            alert('Voice agent created successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('createAgentModal'));
            modal.hide();
            
            // Add the new agent to the list (in a real app, this would come from the server)
            addAgentToList({
                id: Date.now(),
                name: document.getElementById('agentName').value,
                description: document.getElementById('agentDescription').value,
                voice: document.getElementById('voiceModel').value,
                status: 'Active'
            });
            
            // Reset the form
            form.reset();
        } else {
            form.reportValidity();
        }
    });

    // Function to add an agent to the list
    function addAgentToList(agent) {
        const agentsList = document.getElementById('voiceAgentsList');
        
        const agentCard = document.createElement('div');
        agentCard.className = 'col-md-6 col-lg-4 mb-4';
        agentCard.innerHTML = `
            <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">${agent.name}</h5>
                    <span class="badge bg-success">${agent.status}</span>
                </div>
                <div class="card-body">
                    <p class="card-text">${agent.description}</p>
                    <p class="text-muted small">Voice Model: ${agent.voice}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-sm btn-outline-primary edit-agent" data-id="${agent.id}">Edit</button>
                    <button class="btn btn-sm btn-outline-danger delete-agent" data-id="${agent.id}">Delete</button>
                </div>
            </div>
        `;
        
        agentsList.appendChild(agentCard);
        
        // Add event listeners to the new buttons
        agentCard.querySelector('.edit-agent').addEventListener('click', function() {
            editAgent(agent.id);
        });
        
        agentCard.querySelector('.delete-agent').addEventListener('click', function() {
            deleteAgent(agent.id, agentCard);
        });
    }

    // Function to edit an agent
    function editAgent(agentId) {
        // In a real app, you would fetch the agent details from the server
        // For now, we'll just show a modal with some placeholder data
        document.getElementById('editAgentId').value = agentId;
        document.getElementById('editAgentName').value = 'Agent ' + agentId;
        document.getElementById('editAgentDescription').value = 'This is agent ' + agentId;
        document.getElementById('editVoiceModel').value = 'eleven_monolingual_v1';
        
        const modal = new bootstrap.Modal(document.getElementById('editAgentModal'));
        modal.show();
    }

    // Function to delete an agent
    function deleteAgent(agentId, agentCard) {
        if (confirm('Are you sure you want to delete this voice agent?')) {
            // In a real app, you would send a delete request to the server
            // For now, we'll just remove the card from the DOM
            agentCard.remove();
            alert('Voice agent deleted successfully!');
        }
    }

    // Handle voice agent update
    document.getElementById('updateAgentBtn').addEventListener('click', function() {
        const form = document.getElementById('editAgentForm');
        if (form.checkValidity()) {
            // Here you would normally send the data to the server
            // For now, we'll just show a success message and close the modal
            alert('Voice agent updated successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('editAgentModal'));
            modal.hide();
            
            // In a real app, you would update the agent in the list based on the server response
            // For now, we'll just reload the page to simulate the update
            // location.reload();
        } else {
            form.reportValidity();
        }
    });

    // Handle test call button
    const testCallButtons = document.querySelectorAll('.test-call');
    testCallButtons.forEach(button => {
        button.addEventListener('click', function() {
            const agentId = this.getAttribute('data-id');
            alert(`Initiating test call with agent ID: ${agentId}`);
            // In a real app, you would initiate a test call via the server
        });
    });

    // Handle voice model change
    document.getElementById('voiceModel').addEventListener('change', function() {
        const customVoiceSettings = document.getElementById('customVoiceSettings');
        if (this.value === 'custom') {
            customVoiceSettings.style.display = 'block';
        } else {
            customVoiceSettings.style.display = 'none';
        }
    });

    // Initialize existing agents with event listeners
    document.querySelectorAll('.edit-agent').forEach(button => {
        button.addEventListener('click', function() {
            const agentId = this.getAttribute('data-id');
            editAgent(agentId);
        });
    });

    document.querySelectorAll('.delete-agent').forEach(button => {
        button.addEventListener('click', function() {
            const agentId = this.getAttribute('data-id');
            const agentCard = this.closest('.col-md-6');
            deleteAgent(agentId, agentCard);
        });
    });

    // Handle script template selection
    document.getElementById('scriptTemplate').addEventListener('change', function() {
        const scriptContent = document.getElementById('scriptContent');
        switch(this.value) {
            case 'introduction':
                scriptContent.value = 'Hello, this is [Agent Name] from Dealmaker Capital. I'm reaching out regarding potential capital raising or M&A opportunities for your business. Based on our research, we believe we might be able to help you [specific value proposition]. Would you be open to a brief conversation to explore if there's a fit?';
                break;
            case 'qualification':
                scriptContent.value = 'I'd like to understand more about your business to see if we can add value. Could you tell me about your current revenue, growth rate, and any capital raising plans you might have for the next 12-18 months?';
                break;
            case 'objection':
                scriptContent.value = 'I understand your hesitation. Many of our most successful clients initially felt the same way. What specifically concerns you about moving forward? [Listen carefully] That's a valid concern. Here's how we've addressed that with similar clients in the past...';
                break;
            case 'closing':
                scriptContent.value = 'Based on what you've shared, I believe we can help you [specific value proposition]. The next step would be to schedule a more detailed discovery call with one of our senior advisors who specializes in your industry. How does your calendar look next Tuesday or Wednesday?';
                break;
            case 'custom':
                scriptContent.value = '';
                break;
        }
    });
});
