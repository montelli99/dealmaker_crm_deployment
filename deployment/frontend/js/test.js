// JavaScript for testing the CRM system
document.addEventListener('DOMContentLoaded', function() {
    console.log('Starting CRM system test...');
    
    // Test navigation links
    testNavigation();
    
    // Test voice agent functionality
    testVoiceAgents();
    
    // Test email agent functionality
    testEmailAgents();
    
    // Test workflow functionality
    testWorkflows();
    
    // Test knowledge base functionality
    testKnowledgeBase();
    
    // Test activities functionality
    testActivities();
    
    // Test documents functionality
    testDocuments();
    
    // Test reports functionality
    testReports();
    
    // Test settings functionality
    testSettings();
    
    console.log('CRM system test completed successfully!');
});

// Function to test navigation links
function testNavigation() {
    console.log('Testing navigation links...');
    
    // Get all navigation links
    const navLinks = document.querySelectorAll('#sidebar .nav-link');
    
    // Check if all expected navigation links exist
    const expectedLinks = [
        'Dashboard', 'Contacts', 'Deals', 'Voice Agents', 
        'Email Agents', 'Workflows', 'Knowledge Base', 
        'Activities', 'Documents', 'Reports', 'Settings'
    ];
    
    let allLinksFound = true;
    expectedLinks.forEach(linkText => {
        let found = false;
        navLinks.forEach(link => {
            if (link.textContent.trim().includes(linkText)) {
                found = true;
            }
        });
        
        if (!found) {
            console.error(`Navigation link "${linkText}" not found!`);
            allLinksFound = false;
        }
    });
    
    if (allLinksFound) {
        console.log('All navigation links found successfully!');
    }
    
    // Test that each link has the correct href
    navLinks.forEach(link => {
        const linkText = link.textContent.trim();
        const href = link.getAttribute('href');
        
        if (!href) {
            console.error(`Navigation link "${linkText}" has no href attribute!`);
        } else {
            console.log(`Navigation link "${linkText}" has href: ${href}`);
        }
    });
}

// Function to test voice agent functionality
function testVoiceAgents() {
    console.log('Testing voice agent functionality...');
    
    if (window.location.pathname.includes('voice-agents.html')) {
        // Test voice agent creation
        const createBtn = document.getElementById('createVoiceAgentBtn');
        if (createBtn) {
            console.log('Voice agent creation button found!');
        } else {
            console.error('Voice agent creation button not found!');
        }
        
        // Test voice agent templates
        const templateSelect = document.getElementById('voiceAgentTemplate');
        if (templateSelect) {
            console.log('Voice agent template selection found!');
        } else {
            console.error('Voice agent template selection not found!');
        }
        
        // Test voice agent list
        const agentsList = document.getElementById('voiceAgentsList');
        if (agentsList) {
            console.log('Voice agents list found!');
        } else {
            console.error('Voice agents list not found!');
        }
    } else {
        console.log('Not on voice agents page, skipping detailed tests.');
    }
}

// Function to test email agent functionality
function testEmailAgents() {
    console.log('Testing email agent functionality...');
    
    if (window.location.pathname.includes('email-agents.html')) {
        // Test email agent creation
        const createBtn = document.getElementById('createEmailAgentBtn');
        if (createBtn) {
            console.log('Email agent creation button found!');
        } else {
            console.error('Email agent creation button not found!');
        }
        
        // Test email agent templates
        const templateSelect = document.getElementById('emailAgentTemplate');
        if (templateSelect) {
            console.log('Email agent template selection found!');
        } else {
            console.error('Email agent template selection not found!');
        }
        
        // Test email agent list
        const agentsList = document.getElementById('emailAgentsList');
        if (agentsList) {
            console.log('Email agents list found!');
        } else {
            console.error('Email agents list not found!');
        }
    } else {
        console.log('Not on email agents page, skipping detailed tests.');
    }
}

// Function to test workflow functionality
function testWorkflows() {
    console.log('Testing workflow functionality...');
    
    if (window.location.pathname.includes('workflows.html')) {
        // Test workflow creation
        const createBtn = document.getElementById('createWorkflowBtn');
        if (createBtn) {
            console.log('Workflow creation button found!');
        } else {
            console.error('Workflow creation button not found!');
        }
        
        // Test workflow templates
        const templateSelect = document.getElementById('workflowTemplate');
        if (templateSelect) {
            console.log('Workflow template selection found!');
        } else {
            console.error('Workflow template selection not found!');
        }
        
        // Test workflow list
        const workflowsList = document.getElementById('workflowsList');
        if (workflowsList) {
            console.log('Workflows list found!');
        } else {
            console.error('Workflows list not found!');
        }
    } else {
        console.log('Not on workflows page, skipping detailed tests.');
    }
}

// Function to test knowledge base functionality
function testKnowledgeBase() {
    console.log('Testing knowledge base functionality...');
    
    if (window.location.pathname.includes('knowledge-base.html')) {
        // Test article creation
        const createBtn = document.getElementById('createArticleBtn');
        if (createBtn) {
            console.log('Article creation button found!');
        } else {
            console.error('Article creation button not found!');
        }
        
        // Test article categories
        const categorySelect = document.getElementById('articleCategory');
        if (categorySelect) {
            console.log('Article category selection found!');
        } else {
            console.error('Article category selection not found!');
        }
        
        // Test article list
        const articlesList = document.getElementById('articlesList');
        if (articlesList) {
            console.log('Articles list found!');
        } else {
            console.error('Articles list not found!');
        }
        
        // Test search functionality
        const searchInput = document.getElementById('knowledgeSearch');
        if (searchInput) {
            console.log('Knowledge base search input found!');
        } else {
            console.error('Knowledge base search input not found!');
        }
    } else {
        console.log('Not on knowledge base page, skipping detailed tests.');
    }
}

// Function to test activities functionality
function testActivities() {
    console.log('Testing activities functionality...');
    
    if (window.location.pathname.includes('activities.html')) {
        // Test activity creation
        const createBtn = document.getElementById('createActivityBtn');
        if (createBtn) {
            console.log('Activity creation button found!');
        } else {
            console.error('Activity creation button not found!');
        }
        
        // Test activity type selection
        const typeSelect = document.getElementById('activityType');
        if (typeSelect) {
            console.log('Activity type selection found!');
        } else {
            console.error('Activity type selection not found!');
        }
        
        // Test activities list
        const activitiesList = document.getElementById('activitiesList');
        if (activitiesList) {
            console.log('Activities list found!');
        } else {
            console.error('Activities list not found!');
        }
        
        // Test filter functionality
        const filterSelect = document.getElementById('activityFilter');
        if (filterSelect) {
            console.log('Activity filter selection found!');
        } else {
            console.error('Activity filter selection not found!');
        }
    } else {
        console.log('Not on activities page, skipping detailed tests.');
    }
}

// Function to test documents functionality
function testDocuments() {
    console.log('Testing documents functionality...');
    
    if (window.location.pathname.includes('documents.html')) {
        // Test document upload
        const uploadBtn = document.getElementById('uploadDocumentBtn');
        if (uploadBtn) {
            console.log('Document upload button found!');
        } else {
            console.error('Document upload button not found!');
        }
        
        // Test document generation
        const generateBtn = document.getElementById('generateDocumentBtn');
        if (generateBtn) {
            console.log('Document generation button found!');
        } else {
            console.error('Document generation button not found!');
        }
        
        // Test documents list
        const documentsList = document.getElementById('documentsList');
        if (documentsList) {
            console.log('Documents list found!');
        } else {
            console.error('Documents list not found!');
        }
        
        // Test document templates
        const templateSelect = document.getElementById('documentTemplate');
        if (templateSelect) {
            console.log('Document template selection found!');
        } else {
            console.error('Document template selection not found!');
        }
    } else {
        console.log('Not on documents page, skipping detailed tests.');
    }
}

// Function to test reports functionality
function testReports() {
    console.log('Testing reports functionality...');
    
    if (window.location.pathname.includes('reports.html')) {
        // Test report generation
        const generateBtn = document.getElementById('generateReportBtn');
        if (generateBtn) {
            console.log('Report generation button found!');
        } else {
            console.error('Report generation button not found!');
        }
        
        // Test report scheduling
        const scheduleBtn = document.getElementById('scheduleReportBtn');
        if (scheduleBtn) {
            console.log('Report scheduling button found!');
        } else {
            console.error('Report scheduling button not found!');
        }
        
        // Test reports list
        const reportsList = document.getElementById('reportsList');
        if (reportsList) {
            console.log('Reports list found!');
        } else {
            console.error('Reports list not found!');
        }
        
        // Test charts
        const charts = document.querySelectorAll('canvas');
        if (charts.length > 0) {
            console.log(`Found ${charts.length} charts!`);
        } else {
            console.error('No charts found!');
        }
    } else {
        console.log('Not on reports page, skipping detailed tests.');
    }
}

// Function to test settings functionality
function testSettings() {
    console.log('Testing settings functionality...');
    
    if (window.location.pathname.includes('settings.html')) {
        // Test profile settings
        const profileForm = document.getElementById('profileSettingsForm');
        if (profileForm) {
            console.log('Profile settings form found!');
        } else {
            console.error('Profile settings form not found!');
        }
        
        // Test integration settings
        const integrationForm = document.getElementById('integrationSettingsForm');
        if (integrationForm) {
            console.log('Integration settings form found!');
        } else {
            console.error('Integration settings form not found!');
        }
        
        // Test notification settings
        const notificationForm = document.getElementById('notificationSettingsForm');
        if (notificationForm) {
            console.log('Notification settings form found!');
        } else {
            console.error('Notification settings form not found!');
        }
        
        // Test save buttons
        const saveButtons = document.querySelectorAll('button[type="submit"]');
        if (saveButtons.length > 0) {
            console.log(`Found ${saveButtons.length} save buttons!`);
        } else {
            console.error('No save buttons found!');
        }
    } else {
        console.log('Not on settings page, skipping detailed tests.');
    }
}
