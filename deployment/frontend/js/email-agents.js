// JavaScript for email-agents.js
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

    // Handle email agent creation
    document.getElementById('createAgentBtn').addEventListener('click', function() {
        const form = document.getElementById('createAgentForm');
        if (form.checkValidity()) {
            // Here you would normally send the data to the server
            // For now, we'll just show a success message and close the modal
            alert('Email agent created successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('createAgentModal'));
            modal.hide();
            
            // Add the new agent to the list (in a real app, this would come from the server)
            addAgentToList({
                id: Date.now(),
                name: document.getElementById('agentName').value,
                description: document.getElementById('agentDescription').value,
                model: document.getElementById('aiModel').value,
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
        const agentsList = document.getElementById('emailAgentsList');
        
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
                    <p class="text-muted small">AI Model: ${agent.model}</p>
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
        document.getElementById('editAiModel').value = 'deepseek_3.1';
        
        const modal = new bootstrap.Modal(document.getElementById('editAgentModal'));
        modal.show();
    }

    // Function to delete an agent
    function deleteAgent(agentId, agentCard) {
        if (confirm('Are you sure you want to delete this email agent?')) {
            // In a real app, you would send a delete request to the server
            // For now, we'll just remove the card from the DOM
            agentCard.remove();
            alert('Email agent deleted successfully!');
        }
    }

    // Handle email agent update
    document.getElementById('updateAgentBtn').addEventListener('click', function() {
        const form = document.getElementById('editAgentForm');
        if (form.checkValidity()) {
            // Here you would normally send the data to the server
            // For now, we'll just show a success message and close the modal
            alert('Email agent updated successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('editAgentModal'));
            modal.hide();
        } else {
            form.reportValidity();
        }
    });

    // Handle test email button
    const testEmailButtons = document.querySelectorAll('.test-email');
    testEmailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const agentId = this.getAttribute('data-id');
            alert(`Sending test email with agent ID: ${agentId}`);
            // In a real app, you would send a test email via the server
        });
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

    // Handle template selection
    document.getElementById('emailTemplate').addEventListener('change', function() {
        const emailContent = document.getElementById('emailContent');
        switch(this.value) {
            case 'introduction':
                emailContent.value = `Subject: Exploring Capital Raising Opportunities for [Company Name]

Dear [First Name],

I hope this email finds you well. My name is [Your Name] from Dealmaker Capital, and I'm reaching out because we've been following [Company Name]'s growth and believe we might be able to help with your capital raising needs.

Our firm specializes in helping companies like yours secure funding through our extensive network of investors who are actively looking for opportunities in the [Industry] space.

Would you be open to a brief 15-minute call next week to discuss how we might be able to support your growth plans? I'm available on [Day] or [Day] if either works for your schedule.

Looking forward to connecting,

[Your Name]
Dealmaker Capital
[Phone Number]`;
                break;
            case 'follow-up':
                emailContent.value = `Subject: Following Up - [Company Name] Capital Raising Discussion

Dear [First Name],

I wanted to follow up on my previous email regarding potential capital raising opportunities for [Company Name].

Given your company's impressive [mention specific achievement or metric], I believe there would be significant interest from our investor network. Many of our investors are specifically looking for companies with your profile and growth trajectory.

I'd welcome the opportunity to share more about how we've helped similar companies secure funding in the range of [Amount Range].

Would you be available for a quick call this week? I can work around your schedule.

Best regards,

[Your Name]
Dealmaker Capital
[Phone Number]`;
                break;
            case 'meeting-confirmation':
                emailContent.value = `Subject: Confirming Our Meeting - [Company Name] and Dealmaker Capital

Dear [First Name],

I'm writing to confirm our meeting scheduled for [Date] at [Time] [Timezone] to discuss capital raising opportunities for [Company Name].

To make our discussion as productive as possible, it would be helpful if you could share the following in advance:
1. Your current pitch deck (if available)
2. Key financial metrics
3. Amount of capital you're looking to raise
4. Intended use of funds

If you have any questions before our call, please don't hesitate to reach out.

Looking forward to our conversation,

[Your Name]
Dealmaker Capital
[Phone Number]`;
                break;
            case 'investor-introduction':
                emailContent.value = `Subject: Introducing [Company Name] to [Investor Name]

Dear [Investor First Name],

I hope this email finds you well. I wanted to introduce you to [Founder Name], the [Title] of [Company Name], a promising [Industry] company that aligns well with your investment criteria.

[Company Name] [brief description of what the company does and their unique value proposition]. They've achieved [mention key metrics or milestones] and are currently looking to raise [Amount] to [purpose of funding].

[Founder Name], I've copied you on this email to connect you directly with [Investor Name], who has a strong track record of investing in the [Industry] space and has expressed interest in opportunities like yours.

I'll leave it to both of you to coordinate a time to connect further.

Best regards,

[Your Name]
Dealmaker Capital
[Phone Number]`;
                break;
            case 'custom':
                emailContent.value = '';
                break;
        }
    });

    // Handle sequence creation
    document.getElementById('createSequenceBtn').addEventListener('click', function() {
        const form = document.getElementById('createSequenceForm');
        if (form.checkValidity()) {
            alert('Email sequence created successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('createSequenceModal'));
            modal.hide();
            
            // Add the new sequence to the list
            const sequencesList = document.getElementById('emailSequencesList');
            const sequenceCard = document.createElement('div');
            sequenceCard.className = 'col-md-6 mb-4';
            sequenceCard.innerHTML = `
                <div class="card h-100">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">${document.getElementById('sequenceName').value}</h5>
                        <span class="badge bg-success">Active</span>
                    </div>
                    <div class="card-body">
                        <p class="card-text">${document.getElementById('sequenceDescription').value}</p>
                        <p class="text-muted small">Emails: ${document.getElementById('emailCount').value} | Interval: ${document.getElementById('emailInterval').value} days</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-sm btn-outline-primary">Edit</button>
                        <button class="btn btn-sm btn-outline-danger">Delete</button>
                    </div>
                </div>
            `;
            
            sequencesList.appendChild(sequenceCard);
            
            // Reset the form
            form.reset();
        } else {
            form.reportValidity();
        }
    });
});
