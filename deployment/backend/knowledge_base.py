from app import db
from datetime import datetime

class KnowledgeCategory(db.Model):
    __tablename__ = 'knowledge_categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    parent_id = db.Column(db.Integer, db.ForeignKey('knowledge_categories.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Self-referential relationship for hierarchical categories
    subcategories = db.relationship('KnowledgeCategory', backref=db.backref('parent', remote_side=[id]))
    # Relationship with knowledge articles
    articles = db.relationship('KnowledgeArticle', backref='category', lazy='dynamic')
    
    def __repr__(self):
        return f'<KnowledgeCategory {self.name}>'

class KnowledgeArticle(db.Model):
    __tablename__ = 'knowledge_articles'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('knowledge_categories.id'))
    source = db.Column(db.String(100))  # e.g., "Video 1: Setting the Standard"
    tags = db.Column(db.String(255))  # Comma-separated tags
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<KnowledgeArticle {self.title}>'

class VoiceAgentScript(db.Model):
    __tablename__ = 'voice_agent_scripts'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    script_type = db.Column(db.String(50), nullable=False)  # e.g., "Initial Outreach", "Qualification", "Process Explanation"
    script_content = db.Column(db.Text, nullable=False)
    variables = db.Column(db.Text)  # JSON string of variable names and descriptions
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<VoiceAgentScript {self.name}>'

class EmailTemplate(db.Model):
    __tablename__ = 'email_templates'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    subject = db.Column(db.String(200), nullable=False)
    body = db.Column(db.Text, nullable=False)
    template_type = db.Column(db.String(50), nullable=False)  # e.g., "Outreach", "Follow-up", "Document Request"
    variables = db.Column(db.Text)  # JSON string of variable names and descriptions
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<EmailTemplate {self.name}>'

class WorkflowTemplate(db.Model):
    __tablename__ = 'workflow_templates'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    workflow_type = db.Column(db.String(50), nullable=False)  # e.g., "Client Acquisition", "Deal Management"
    stages = db.Column(db.Text)  # JSON string of workflow stages
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with workflow steps
    steps = db.relationship('WorkflowStep', backref='workflow', lazy='dynamic')
    
    def __repr__(self):
        return f'<WorkflowTemplate {self.name}>'

class WorkflowStep(db.Model):
    __tablename__ = 'workflow_steps'
    
    id = db.Column(db.Integer, primary_key=True)
    workflow_id = db.Column(db.Integer, db.ForeignKey('workflow_templates.id'))
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    step_order = db.Column(db.Integer, nullable=False)
    action_type = db.Column(db.String(50))  # e.g., "Email", "Call", "Task", "Document"
    action_details = db.Column(db.Text)  # JSON string of action details
    conditions = db.Column(db.Text)  # JSON string of conditions to execute this step
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<WorkflowStep {self.name}>'
