// JavaScript for knowledge-base.js
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

    // Handle search functionality
    document.getElementById('searchKnowledge').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const articles = document.querySelectorAll('.knowledge-article');
        
        articles.forEach(article => {
            const title = article.querySelector('h5').textContent.toLowerCase();
            const content = article.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                article.style.display = 'block';
            } else {
                article.style.display = 'none';
            }
        });
    });

    // Handle category filter
    document.querySelectorAll('.category-filter').forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all filters
            document.querySelectorAll('.category-filter').forEach(f => {
                f.classList.remove('active');
            });
            
            // Add active class to clicked filter
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            const articles = document.querySelectorAll('.knowledge-article');
            
            articles.forEach(article => {
                if (category === 'all' || article.getAttribute('data-category') === category) {
                    article.style.display = 'block';
                } else {
                    article.style.display = 'none';
                }
            });
        });
    });

    // Handle article creation
    document.getElementById('createArticleBtn').addEventListener('click', function() {
        const form = document.getElementById('createArticleForm');
        if (form.checkValidity()) {
            // Here you would normally send the data to the server
            // For now, we'll just show a success message and close the modal
            alert('Article created successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('createArticleModal'));
            modal.hide();
            
            // Add the new article to the list (in a real app, this would come from the server)
            addArticleToList({
                id: Date.now(),
                title: document.getElementById('articleTitle').value,
                content: document.getElementById('articleContent').value,
                category: document.getElementById('articleCategory').value,
                tags: document.getElementById('articleTags').value.split(',').map(tag => tag.trim())
            });
            
            // Reset the form
            form.reset();
        } else {
            form.reportValidity();
        }
    });

    // Function to add an article to the list
    function addArticleToList(article) {
        const articlesList = document.getElementById('knowledgeArticlesList');
        
        const articleCard = document.createElement('div');
        articleCard.className = 'col-md-6 col-lg-4 mb-4 knowledge-article';
        articleCard.setAttribute('data-category', article.category);
        articleCard.innerHTML = `
            <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">${article.title}</h5>
                    <span class="badge bg-primary">${article.category}</span>
                </div>
                <div class="card-body">
                    <p class="card-text">${article.content.substring(0, 150)}${article.content.length > 150 ? '...' : ''}</p>
                    <div class="mt-2">
                        ${article.tags.map(tag => `<span class="badge bg-secondary me-1">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-sm btn-outline-primary view-article" data-id="${article.id}">View</button>
                    <button class="btn btn-sm btn-outline-danger delete-article" data-id="${article.id}">Delete</button>
                </div>
            </div>
        `;
        
        articlesList.appendChild(articleCard);
        
        // Add event listeners to the new buttons
        articleCard.querySelector('.view-article').addEventListener('click', function() {
            viewArticle(article.id);
        });
        
        articleCard.querySelector('.delete-article').addEventListener('click', function() {
            deleteArticle(article.id, articleCard);
        });
    }

    // Function to view an article
    function viewArticle(articleId) {
        // In a real app, you would fetch the article details from the server
        // For now, we'll just show a modal with some placeholder data
        document.getElementById('viewArticleTitle').textContent = 'Article ' + articleId;
        document.getElementById('viewArticleCategory').textContent = 'Business Model';
        document.getElementById('viewArticleContent').innerHTML = `
            <p>This is the full content of article ${articleId}. In a real application, this would contain the complete article text with formatting.</p>
            <p>The Dealmaker methodology focuses on building credible presence, leveraging advisors, and implementing a structured sales process to close high-value deals.</p>
            <p>Key components include:</p>
            <ul>
                <li>Establishing authority in your niche</li>
                <li>Creating a network of advisors with specialized expertise</li>
                <li>Implementing a dual revenue stream model with engagement fees and success fees</li>
                <li>Following a structured sales process with clear qualification criteria</li>
            </ul>
        `;
        document.getElementById('viewArticleTags').innerHTML = `
            <span class="badge bg-secondary me-1">business model</span>
            <span class="badge bg-secondary me-1">revenue</span>
            <span class="badge bg-secondary me-1">dealmaker</span>
        `;
        
        const modal = new bootstrap.Modal(document.getElementById('viewArticleModal'));
        modal.show();
    }

    // Function to delete an article
    function deleteArticle(articleId, articleCard) {
        if (confirm('Are you sure you want to delete this article?')) {
            // In a real app, you would send a delete request to the server
            // For now, we'll just remove the card from the DOM
            articleCard.remove();
            alert('Article deleted successfully!');
        }
    }

    // Initialize existing articles with event listeners
    document.querySelectorAll('.view-article').forEach(button => {
        button.addEventListener('click', function() {
            const articleId = this.getAttribute('data-id');
            viewArticle(articleId);
        });
    });

    document.querySelectorAll('.delete-article').forEach(button => {
        button.addEventListener('click', function() {
            const articleId = this.getAttribute('data-id');
            const articleCard = this.closest('.knowledge-article');
            deleteArticle(articleId, articleCard);
        });
    });

    // Handle article template selection
    document.getElementById('articleTemplate').addEventListener('change', function() {
        const articleTitle = document.getElementById('articleTitle');
        const articleContent = document.getElementById('articleContent');
        const articleCategory = document.getElementById('articleCategory');
        const articleTags = document.getElementById('articleTags');
        
        switch(this.value) {
            case 'business_model':
                articleTitle.value = 'Dealmaker Business Model Overview';
                articleContent.value = `The Dealmaker business model is built on a dual revenue stream approach that maximizes both cash flow stability and upside potential.

Key components of the model include:

1. Engagement Fees: Upfront fees charged for initial advisory work, typically ranging from $10,000 to $50,000 depending on deal complexity. These fees ensure consistent cash flow and client commitment.

2. Success Fees: Performance-based compensation calculated as a percentage of the total deal value, typically 1-5% for capital raising and 3-10% for M&A transactions. These fees provide significant upside potential.

3. Tiered Service Offerings: Multiple service levels to accommodate different client needs and budgets, from basic advisory to comprehensive deal management.

4. Advisor Network Leverage: Building a network of specialized advisors who can be brought in on specific deals, with fee-sharing arrangements that create win-win scenarios.

This model allows for scalable growth while maintaining high margins and creating alignment between advisor and client interests.`;
                articleCategory.value = 'business_model';
                articleTags.value = 'business model, revenue, engagement fees, success fees, advisor network';
                break;
            case 'client_acquisition':
                articleTitle.value = 'Client Acquisition Framework';
                articleContent.value = `The Dealmaker client acquisition framework is a systematic approach to attracting and converting high-value clients.

The framework consists of four primary components:

1. Authority Positioning: Establishing credibility through content creation, speaking engagements, and media appearances. This positions you as an expert in your niche and attracts inbound interest.

2. Referral Partner Development: Building relationships with strategic partners who can refer qualified prospects. This includes accountants, attorneys, wealth managers, and industry specialists.

3. Direct Outreach: Targeted outreach to potential clients using a combination of email, phone, and social media. This approach uses a value-first methodology that focuses on providing insights before asking for business.

4. Qualification Process: A structured approach to evaluating potential clients based on deal size, timeline, motivation, and fit. This ensures you focus resources on opportunities with the highest probability of success.

The framework emphasizes quality over quantity, focusing on securing fewer but larger deals rather than a high volume of small transactions.`;
                articleCategory.value = 'client_acquisition';
                articleTags.value = 'client acquisition, authority positioning, referrals, outreach, qualification';
                break;
            case 'deal_management':
                articleTitle.value = 'Deal Management Process';
                articleContent.value = `The Dealmaker deal management process provides a structured approach to guiding transactions from initiation to closing.

The process consists of five key stages:

1. Discovery & Assessment: Comprehensive analysis of the client's business, including financial review, market positioning, and growth potential. This stage establishes the foundation for the entire deal process.

2. Strategy Development: Creating a customized deal strategy based on the client's objectives, market conditions, and potential buyer/investor profiles. This includes determining optimal deal structures and valuation ranges.

3. Preparation & Packaging: Developing professional deal documentation, including teasers, information memorandums, and data room materials. This stage ensures the business is presented in the most compelling way.

4. Market Execution: Implementing the go-to-market strategy through targeted outreach to potential buyers/investors, managing initial inquiries, and coordinating preliminary discussions.

5. Negotiation & Closing: Managing the offer process, facilitating due diligence, negotiating final terms, and coordinating with legal and accounting advisors to ensure successful closing.

Throughout this process, regular client communication and expectation management are essential to maintaining trust and momentum.`;
                articleCategory.value = 'deal_management';
                articleTags.value = 'deal management, discovery, strategy, preparation, execution, negotiation, closing';
                break;
            case 'advisor_network':
                articleTitle.value = 'Building and Leveraging an Advisor Network';
                articleContent.value = `The Dealmaker methodology places significant emphasis on building and leveraging a network of specialized advisors to enhance deal capabilities and credibility.

Key aspects of the advisor network approach include:

1. Advisor Identification: Targeting professionals with specialized expertise in areas such as specific industries, financial modeling, legal structures, tax optimization, and technical due diligence.

2. Relationship Development: Building mutually beneficial relationships with advisors through value exchange, including referrals, content collaboration, and fee-sharing opportunities.

3. Engagement Structure: Creating flexible engagement models that allow advisors to participate in deals based on their expertise and availability, with clear compensation arrangements.

4. Client Presentation: Strategically introducing advisors to clients to enhance credibility and demonstrate access to specialized expertise that addresses specific client needs.

5. Knowledge Integration: Systematically capturing and organizing advisor insights to build a proprietary knowledge base that benefits all clients.

A well-developed advisor network creates a virtuous cycle where each successful deal strengthens relationships and attracts both new advisors and clients.`;
                articleCategory.value = 'advisor_network';
                articleTags.value = 'advisor network, expertise, relationships, engagement, credibility';
                break;
            case 'custom':
                articleTitle.value = '';
                articleContent.value = '';
                articleCategory.value = '';
                articleTags.value = '';
                break;
        }
    });

    // Handle article export
    document.getElementById('exportKnowledgeBtn').addEventListener('click', function() {
        alert('Knowledge base exported successfully! The file has been sent to your email.');
    });

    // Handle article import
    document.getElementById('importKnowledgeBtn').addEventListener('click', function() {
        document.getElementById('knowledgeImportFile').click();
    });

    document.getElementById('knowledgeImportFile').addEventListener('change', function() {
        if (this.files.length > 0) {
            alert('Knowledge base imported successfully! New articles have been added to the system.');
            this.value = '';
        }
    });
});
