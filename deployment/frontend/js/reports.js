// JavaScript for reports.js
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

    // Initialize charts if they exist
    if (document.getElementById('dealsByStageChart')) {
        initializeDealsByStageChart();
    }
    
    if (document.getElementById('revenueByMonthChart')) {
        initializeRevenueByMonthChart();
    }
    
    if (document.getElementById('activityCompletionChart')) {
        initializeActivityCompletionChart();
    }
    
    if (document.getElementById('dealSourceChart')) {
        initializeDealSourceChart();
    }

    // Handle report generation
    document.getElementById('generateReportBtn').addEventListener('click', function() {
        const form = document.getElementById('generateReportForm');
        if (form.checkValidity()) {
            // Here you would normally send the data to the server
            // For now, we'll just show a success message and close the modal
            alert('Report generated successfully! You can now view or download it.');
            const modal = bootstrap.Modal.getInstance(document.getElementById('generateReportModal'));
            modal.hide();
            
            // Add the new report to the list (in a real app, this would come from the server)
            addReportToList({
                id: Date.now(),
                name: document.getElementById('reportName').value,
                type: document.getElementById('reportType').value,
                dateRange: `${document.getElementById('reportStartDate').value} to ${document.getElementById('reportEndDate').value}`,
                createdBy: 'Current User',
                createdDate: new Date().toISOString().split('T')[0],
                format: document.getElementById('reportFormat').value
            });
            
            // Reset the form
            form.reset();
        } else {
            form.reportValidity();
        }
    });

    // Function to add a report to the list
    function addReportToList(report) {
        const reportsList = document.getElementById('reportsList');
        
        const reportRow = document.createElement('tr');
        reportRow.innerHTML = `
            <td>
                <span class="report-icon">
                    ${getReportIcon(report.type)}
                </span>
                ${report.name}
            </td>
            <td>${report.type}</td>
            <td>${report.dateRange}</td>
            <td>${report.createdBy}</td>
            <td>${report.createdDate}</td>
            <td>${report.format.toUpperCase()}</td>
            <td>
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-primary view-report" data-id="${report.id}">View</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary download-report" data-id="${report.id}">Download</button>
                    <button type="button" class="btn btn-sm btn-outline-danger delete-report" data-id="${report.id}">Delete</button>
                </div>
            </td>
        `;
        
        reportsList.appendChild(reportRow);
        
        // Add event listeners to the new buttons
        reportRow.querySelector('.view-report').addEventListener('click', function() {
            viewReport(report.id);
        });
        
        reportRow.querySelector('.download-report').addEventListener('click', function() {
            downloadReport(report.id);
        });
        
        reportRow.querySelector('.delete-report').addEventListener('click', function() {
            deleteReport(report.id, reportRow);
        });
    }

    // Function to get the appropriate icon for a report type
    function getReportIcon(type) {
        switch(type) {
            case 'Deal Performance':
                return '<i class="fas fa-chart-line text-primary"></i>';
            case 'Revenue Analysis':
                return '<i class="fas fa-dollar-sign text-success"></i>';
            case 'Activity Summary':
                return '<i class="fas fa-tasks text-warning"></i>';
            case 'Pipeline Forecast':
                return '<i class="fas fa-project-diagram text-info"></i>';
            case 'Client Engagement':
                return '<i class="fas fa-users text-danger"></i>';
            default:
                return '<i class="fas fa-file-alt text-secondary"></i>';
        }
    }

    // Function to view a report
    function viewReport(reportId) {
        // In a real app, you would fetch the report from the server and display it
        // For now, we'll just show a modal with a placeholder message
        alert(`Viewing report ${reportId}. In a real application, this would open the report in a viewer.`);
    }

    // Function to download a report
    function downloadReport(reportId) {
        // In a real app, you would initiate a download of the report
        // For now, we'll just show a placeholder message
        alert(`Downloading report ${reportId}. In a real application, this would start the download.`);
    }

    // Function to delete a report
    function deleteReport(reportId, reportRow) {
        if (confirm('Are you sure you want to delete this report?')) {
            // In a real app, you would send a delete request to the server
            // For now, we'll just remove the row from the DOM
            reportRow.remove();
            alert('Report deleted successfully!');
        }
    }

    // Initialize existing reports with event listeners
    document.querySelectorAll('.view-report').forEach(button => {
        button.addEventListener('click', function() {
            const reportId = this.getAttribute('data-id');
            viewReport(reportId);
        });
    });

    document.querySelectorAll('.download-report').forEach(button => {
        button.addEventListener('click', function() {
            const reportId = this.getAttribute('data-id');
            downloadReport(reportId);
        });
    });

    document.querySelectorAll('.delete-report').forEach(button => {
        button.addEventListener('click', function() {
            const reportId = this.getAttribute('data-id');
            const reportRow = this.closest('tr');
            deleteReport(reportId, reportRow);
        });
    });

    // Handle report type filter
    document.getElementById('reportTypeFilter').addEventListener('change', function() {
        const filterValue = this.value.toLowerCase();
        const rows = document.querySelectorAll('#reportsList tr');
        
        rows.forEach(row => {
            const type = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            if (filterValue === 'all' || type.includes(filterValue)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Handle report search
    document.getElementById('reportSearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#reportsList tr');
        
        rows.forEach(row => {
            const name = row.querySelector('td:first-child').textContent.trim().toLowerCase();
            const type = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
            
            if (name.includes(searchTerm) || type.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Handle report template selection
    document.getElementById('reportTemplate').addEventListener('change', function() {
        const reportName = document.getElementById('reportName');
        const reportType = document.getElementById('reportType');
        const reportFormat = document.getElementById('reportFormat');
        
        // Set default dates to current month
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        document.getElementById('reportStartDate').value = firstDay.toISOString().split('T')[0];
        document.getElementById('reportEndDate').value = lastDay.toISOString().split('T')[0];
        
        switch(this.value) {
            case 'deal_performance':
                reportName.value = 'Deal Performance Report';
                reportType.value = 'Deal Performance';
                reportFormat.value = 'pdf';
                break;
            case 'revenue_analysis':
                reportName.value = 'Revenue Analysis Report';
                reportType.value = 'Revenue Analysis';
                reportFormat.value = 'excel';
                break;
            case 'activity_summary':
                reportName.value = 'Activity Summary Report';
                reportType.value = 'Activity Summary';
                reportFormat.value = 'pdf';
                break;
            case 'pipeline_forecast':
                reportName.value = 'Pipeline Forecast Report';
                reportType.value = 'Pipeline Forecast';
                reportFormat.value = 'excel';
                break;
            case 'client_engagement':
                reportName.value = 'Client Engagement Report';
                reportType.value = 'Client Engagement';
                reportFormat.value = 'pdf';
                break;
            case 'custom':
                reportName.value = '';
                reportType.value = '';
                reportFormat.value = 'pdf';
                break;
        }
    });

    // Handle schedule report button
    document.getElementById('scheduleReportBtn').addEventListener('click', function() {
        const form = document.getElementById('scheduleReportForm');
        if (form.checkValidity()) {
            alert('Report scheduled successfully! It will be generated and sent according to your schedule.');
            const modal = bootstrap.Modal.getInstance(document.getElementById('scheduleReportModal'));
            modal.hide();
            
            // Reset the form
            form.reset();
        } else {
            form.reportValidity();
        }
    });

    // Handle export dashboard button
    document.getElementById('exportDashboardBtn').addEventListener('click', function() {
        alert('Dashboard exported successfully! The file has been sent to your email.');
    });

    // Initialize charts
    function initializeDealsByStageChart() {
        const ctx = document.getElementById('dealsByStageChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Initial Contact', 'Discovery', 'Proposal', 'Negotiation', 'Closing'],
                datasets: [{
                    label: 'Number of Deals',
                    data: [12, 19, 8, 5, 3],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                        'rgba(153, 102, 255, 0.5)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function initializeRevenueByMonthChart() {
        const ctx = document.getElementById('revenueByMonthChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Engagement Fees',
                    data: [12000, 19000, 15000, 25000, 22000, 30000],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    tension: 0.1
                }, {
                    label: 'Success Fees',
                    data: [5000, 15000, 8000, 20000, 30000, 45000],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    function initializeActivityCompletionChart() {
        const ctx = document.getElementById('activityCompletionChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'In Progress', 'Overdue'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(255, 99, 132, 0.5)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true
            }
        });
    }

    function initializeDealSourceChart() {
        const ctx = document.getElementById('dealSourceChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Referrals', 'Direct Outreach', 'Website', 'Events', 'Partners'],
                datasets: [{
                    data: [40, 25, 15, 10, 10],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(153, 102, 255, 0.5)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true
            }
        });
    }
});
