from app import db
from datetime import datetime

# Association tables for many-to-many relationships
deal_contacts = db.Table('deal_contacts',
    db.Column('deal_id', db.Integer, db.ForeignKey('deals.id'), primary_key=True),
    db.Column('contact_id', db.Integer, db.ForeignKey('contacts.id'), primary_key=True),
    db.Column('role', db.String(50), nullable=False)
)

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(20), default='user')
    department = db.Column(db.String(50))
    status = db.Column(db.String(20), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    contacts = db.relationship('Contact', backref='owner', lazy='dynamic')
    deals = db.relationship('Deal', backref='owner', lazy='dynamic')
    activities = db.relationship('Activity', backref='owner', lazy='dynamic')
    documents = db.relationship('Document', backref='owner', lazy='dynamic')
    
    def __repr__(self):
        return f'<User {self.name}>'

class Contact(db.Model):
    __tablename__ = 'contacts'
    
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(20), nullable=False)  # Prospect, Client, Advisor, Partner
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    company = db.Column(db.String(100))
    position = db.Column(db.String(100))
    industry = db.Column(db.String(50))
    linkedin_url = db.Column(db.String(255))
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    status = db.Column(db.String(20), default='active')
    relationship_strength = db.Column(db.Integer, default=0)  # 0-10 scale
    notes = db.Column(db.Text)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    activities = db.relationship('Activity', backref='contact', lazy='dynamic')
    documents = db.relationship('Document', backref='contact', lazy='dynamic')
    deals = db.relationship('Deal', secondary=deal_contacts, backref=db.backref('contacts', lazy='dynamic'))
    
    def __repr__(self):
        return f'<Contact {self.first_name} {self.last_name}>'

class Deal(db.Model):
    __tablename__ = 'deals'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # Equity, Debt, M&A
    status = db.Column(db.String(20), default='lead')
    stage = db.Column(db.String(30), default='identification')
    value = db.Column(db.Float)
    engagement_fee = db.Column(db.Float)
    success_fee_percentage = db.Column(db.Float)
    success_fee_amount = db.Column(db.Float)
    probability = db.Column(db.Integer, default=0)  # 0-100%
    expected_close_date = db.Column(db.Date)
    description = db.Column(db.Text)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    activities = db.relationship('Activity', backref='deal', lazy='dynamic')
    documents = db.relationship('Document', backref='deal', lazy='dynamic')
    
    def __repr__(self):
        return f'<Deal {self.name}>'

class Activity(db.Model):
    __tablename__ = 'activities'
    
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(20), nullable=False)  # Call, Meeting, Email, Task, Note
    subject = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')
    due_date = db.Column(db.DateTime)
    completion_date = db.Column(db.DateTime)
    contact_id = db.Column(db.Integer, db.ForeignKey('contacts.id'))
    deal_id = db.Column(db.Integer, db.ForeignKey('deals.id'))
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Activity {self.type}: {self.subject}>'

class Document(db.Model):
    __tablename__ = 'documents'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(30))
    category = db.Column(db.String(30))
    file_path = db.Column(db.String(255), nullable=False)
    contact_id = db.Column(db.Integer, db.ForeignKey('contacts.id'))
    deal_id = db.Column(db.Integer, db.ForeignKey('deals.id'))
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Document {self.name}>'

# Additional models can be added as needed for the prototype
class Campaign(db.Model):
    __tablename__ = 'campaigns'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='draft')
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Campaign {self.name}>'

class Template(db.Model):
    __tablename__ = 'templates'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(30), nullable=False)  # Email, Message, Document
    subject = db.Column(db.String(100))
    content = db.Column(db.Text, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Template {self.name}>'
