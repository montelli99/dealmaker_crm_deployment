// Main JavaScript for Dealmaker CRM

// Toggle sidebar
document.addEventListener('DOMContentLoaded', function() {
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarCollapse) {
        sidebarCollapse.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Initialize Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    
    // Initialize API connection
    initializeAPI();
});

// API connection
function initializeAPI() {
    const apiBaseUrl = 'http://localhost:5000/api';
    
    // Store API base URL for other scripts to use
    window.dealmakerAPI = {
        baseUrl: apiBaseUrl,
        
        // Helper method for GET requests
        async get(endpoint) {
            try {
                const response = await fetch(`${apiBaseUrl}/${endpoint}`);
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                console.error('API request failed:', error);
                return null;
            }
        },
        
        // Helper method for POST requests
        async post(endpoint, data) {
            try {
                const response = await fetch(`${apiBaseUrl}/${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                console.error('API request failed:', error);
                return null;
            }
        },
        
        // Helper method for PUT requests
        async put(endpoint, data) {
            try {
                const response = await fetch(`${apiBaseUrl}/${endpoint}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                console.error('API request failed:', error);
                return null;
            }
        },
        
        // Helper method for DELETE requests
        async delete(endpoint) {
            try {
                const response = await fetch(`${apiBaseUrl}/${endpoint}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }
                return true;
            } catch (error) {
                console.error('API request failed:', error);
                return false;
            }
        }
    };
    
    // Load dashboard data if we're on the dashboard page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        loadDashboardData();
    }
}

// Load dashboard data from API
async function loadDashboardData() {
    // This would normally fetch real data from the API
    // For the prototype, we'll use the static data already in the HTML
    
    // Example of how we would fetch deals for the pipeline
    /*
    const deals = await window.dealmakerAPI.get('deals');
    if (deals) {
        updatePipeline(deals);
    }
    
    const activities = await window.dealmakerAPI.get('activities');
    if (activities) {
        updateActivityFeed(activities);
    }
    */
    
    console.log('Dashboard data loaded (static data for prototype)');
}

// Update pipeline visualization with deal data
function updatePipeline(deals) {
    // Group deals by stage
    const dealsByStage = {};
    deals.forEach(deal => {
        if (!dealsByStage[deal.stage]) {
            dealsByStage[deal.stage] = [];
        }
        dealsByStage[deal.stage].push(deal);
    });
    
    // Update each pipeline stage
    Object.keys(dealsByStage).forEach(stage => {
        const stageDeals = dealsByStage[stage];
        const stageElement = document.querySelector(`.pipeline-stage[data-stage="${stage}"]`);
        
        if (stageElement) {
            // Update count
            const countElement = stageElement.querySelector('.pipeline-count');
            if (countElement) {
                countElement.textContent = stageDeals.length;
            }
            
            // Clear existing cards
            const cardsContainer = stageElement.querySelector('.pipeline-cards');
            if (cardsContainer) {
                cardsContainer.innerHTML = '';
                
                // Add deal cards
                stageDeals.forEach(deal => {
                    const card = document.createElement('div');
                    card.className = 'pipeline-card';
                    card.innerHTML = `
                        <div class="pipeline-card-title">${deal.name}</div>
                        <div class="pipeline-card-value">$${formatNumber(deal.value)}</div>
                    `;
                    cardsContainer.appendChild(card);
                });
            }
        }
    });
}

// Update activity feed with activity data
function updateActivityFeed(activities) {
    const feedElement = document.querySelector('.activity-feed');
    if (feedElement) {
        feedElement.innerHTML = '';
        
        activities.forEach(activity => {
            const item = document.createElement('li');
            item.className = 'list-group-item';
            item.innerHTML = `
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">${activity.type}: ${activity.subject}</h6>
                    <small>${formatDate(activity.created_at)}</small>
                </div>
                <p class="mb-1">${activity.description || ''}</p>
                <small>${activity.deal ? `Deal: ${activity.deal.name}` : ''}</small>
            `;
            feedElement.appendChild(item);
        });
    }
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
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
        return diffDay === 1 ? 'Yesterday' : `${diffDay} days ago`;
    } else if (diffHour > 0) {
        return `${diffHour} hours ago`;
    } else if (diffMin > 0) {
        return `${diffMin} minutes ago`;
    } else {
        return 'Just now';
    }
}
