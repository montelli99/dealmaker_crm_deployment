// JavaScript for settings.js
document.addEventListener('DOMContentLoaded', function() {
    // Toggle sidebar
    document.getElementById('sidebarCollapse').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });

    // Email provider change handler
    document.getElementById('emailProvider').addEventListener('change', function() {
        const smtpSettings = document.getElementById('smtpSettings');
        if (this.value === 'smtp') {
            smtpSettings.style.display = 'block';
        } else {
            smtpSettings.style.display = 'none';
        }
    });

    // Save new user
    document.getElementById('saveNewUser').addEventListener('click', function() {
        const form = document.getElementById('addUserForm');
        if (form.checkValidity()) {
            // Here you would normally send the data to the server
            // For now, we'll just show a success message and close the modal
            alert('User added successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
            modal.hide();
        } else {
            form.reportValidity();
        }
    });

    // Save new team
    document.getElementById('saveNewTeam').addEventListener('click', function() {
        const form = document.getElementById('addTeamForm');
        if (form.checkValidity()) {
            // Here you would normally send the data to the server
            // For now, we'll just show a success message and close the modal
            alert('Team added successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('addTeamModal'));
            modal.hide();
        } else {
            form.reportValidity();
        }
    });

    // Handle form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (form.checkValidity()) {
                alert('Settings saved successfully!');
            } else {
                form.reportValidity();
            }
        });
    });

    // Handle integration toggles
    const integrationSwitches = document.querySelectorAll('.form-check-input');
    integrationSwitches.forEach(switchEl => {
        switchEl.addEventListener('change', function() {
            const integrationName = this.id.replace('Switch', '');
            if (this.checked) {
                console.log(`${integrationName} integration enabled`);
            } else {
                console.log(`${integrationName} integration disabled`);
            }
        });
    });

    // Handle account deletion button
    document.getElementById('accountDeletion').addEventListener('click', function() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            alert('Account deletion request submitted. You will receive a confirmation email.');
        }
    });

    // Handle data export button
    document.getElementById('dataExport').addEventListener('click', function() {
        alert('Data export initiated. You will receive an email with download instructions when ready.');
    });

    // Handle session revocation
    const revokeButtons = document.querySelectorAll('.btn-outline-danger');
    revokeButtons.forEach(button => {
        if (button.textContent.trim() === 'Revoke') {
            button.addEventListener('click', function() {
                const sessionElement = this.closest('.list-group-item');
                const sessionName = sessionElement.querySelector('h6').textContent;
                if (confirm(`Are you sure you want to revoke the session "${sessionName}"?`)) {
                    alert(`Session "${sessionName}" revoked successfully!`);
                    sessionElement.remove();
                }
            });
        }
    });

    // Handle "Revoke All Other Sessions" button
    const revokeAllButton = document.querySelector('.btn-danger');
    if (revokeAllButton && revokeAllButton.textContent.trim() === 'Revoke All Other Sessions') {
        revokeAllButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to revoke all other sessions? You will remain logged in on this device only.')) {
                alert('All other sessions revoked successfully!');
                const sessionElements = document.querySelectorAll('.list-group-item:not(:first-child)');
                sessionElements.forEach(element => element.remove());
            }
        });
    }
});
