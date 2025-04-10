from flask import request, jsonify
from flask_restful import Resource
from models import User, Contact, Deal, Activity, Document, Campaign, Template
from app import db
from marshmallow import Schema, fields, validate

# Schemas for serialization/deserialization
class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    email = fields.Email(required=True)
    role = fields.Str()
    department = fields.Str()
    status = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class ContactSchema(Schema):
    id = fields.Int(dump_only=True)
    type = fields.Str(required=True, validate=validate.OneOf(["Prospect", "Client", "Advisor", "Partner"]))
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    company = fields.Str()
    position = fields.Str()
    industry = fields.Str()
    linkedin_url = fields.Str()
    email = fields.Email()
    phone = fields.Str()
    status = fields.Str()
    relationship_strength = fields.Int()
    notes = fields.Str()
    owner_id = fields.Int()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class DealSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    type = fields.Str(required=True, validate=validate.OneOf(["Equity", "Debt", "M&A"]))
    status = fields.Str()
    stage = fields.Str()
    value = fields.Float()
    engagement_fee = fields.Float()
    success_fee_percentage = fields.Float()
    success_fee_amount = fields.Float()
    probability = fields.Int()
    expected_close_date = fields.Date()
    description = fields.Str()
    owner_id = fields.Int()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class ActivitySchema(Schema):
    id = fields.Int(dump_only=True)
    type = fields.Str(required=True, validate=validate.OneOf(["Call", "Meeting", "Email", "Task", "Note"]))
    subject = fields.Str(required=True)
    description = fields.Str()
    status = fields.Str()
    due_date = fields.DateTime()
    completion_date = fields.DateTime()
    contact_id = fields.Int()
    deal_id = fields.Int()
    owner_id = fields.Int()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class DocumentSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    type = fields.Str()
    category = fields.Str()
    file_path = fields.Str(required=True)
    contact_id = fields.Int()
    deal_id = fields.Int()
    owner_id = fields.Int()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

# Initialize schemas
user_schema = UserSchema()
users_schema = UserSchema(many=True)
contact_schema = ContactSchema()
contacts_schema = ContactSchema(many=True)
deal_schema = DealSchema()
deals_schema = DealSchema(many=True)
activity_schema = ActivitySchema()
activities_schema = ActivitySchema(many=True)
document_schema = DocumentSchema()
documents_schema = DocumentSchema(many=True)

# Resource classes
class UserResource(Resource):
    def get(self, user_id=None):
        if user_id:
            user = User.query.get_or_404(user_id)
            return user_schema.dump(user)
        else:
            users = User.query.all()
            return users_schema.dump(users)
    
    def post(self):
        json_data = request.get_json()
        try:
            data = user_schema.load(json_data)
            user = User(
                name=data['name'],
                email=data['email'],
                role=data.get('role', 'user'),
                department=data.get('department'),
                status=data.get('status', 'active')
            )
            db.session.add(user)
            db.session.commit()
            return user_schema.dump(user), 201
        except Exception as e:
            return {'message': str(e)}, 400
    
    def put(self, user_id):
        user = User.query.get_or_404(user_id)
        json_data = request.get_json()
        try:
            data = user_schema.load(json_data, partial=True)
            for key, value in data.items():
                setattr(user, key, value)
            db.session.commit()
            return user_schema.dump(user)
        except Exception as e:
            return {'message': str(e)}, 400
    
    def delete(self, user_id):
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return '', 204

class ContactResource(Resource):
    def get(self, contact_id=None):
        if contact_id:
            contact = Contact.query.get_or_404(contact_id)
            return contact_schema.dump(contact)
        else:
            contacts = Contact.query.all()
            return contacts_schema.dump(contacts)
    
    def post(self):
        json_data = request.get_json()
        try:
            data = contact_schema.load(json_data)
            contact = Contact(
                type=data['type'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                company=data.get('company'),
                position=data.get('position'),
                industry=data.get('industry'),
                linkedin_url=data.get('linkedin_url'),
                email=data.get('email'),
                phone=data.get('phone'),
                status=data.get('status', 'active'),
                relationship_strength=data.get('relationship_strength', 0),
                notes=data.get('notes'),
                owner_id=data.get('owner_id')
            )
            db.session.add(contact)
            db.session.commit()
            return contact_schema.dump(contact), 201
        except Exception as e:
            return {'message': str(e)}, 400
    
    def put(self, contact_id):
        contact = Contact.query.get_or_404(contact_id)
        json_data = request.get_json()
        try:
            data = contact_schema.load(json_data, partial=True)
            for key, value in data.items():
                setattr(contact, key, value)
            db.session.commit()
            return contact_schema.dump(contact)
        except Exception as e:
            return {'message': str(e)}, 400
    
    def delete(self, contact_id):
        contact = Contact.query.get_or_404(contact_id)
        db.session.delete(contact)
        db.session.commit()
        return '', 204

class DealResource(Resource):
    def get(self, deal_id=None):
        if deal_id:
            deal = Deal.query.get_or_404(deal_id)
            return deal_schema.dump(deal)
        else:
            deals = Deal.query.all()
            return deals_schema.dump(deals)
    
    def post(self):
        json_data = request.get_json()
        try:
            data = deal_schema.load(json_data)
            deal = Deal(
                name=data['name'],
                type=data['type'],
                status=data.get('status', 'lead'),
                stage=data.get('stage', 'identification'),
                value=data.get('value'),
                engagement_fee=data.get('engagement_fee'),
                success_fee_percentage=data.get('success_fee_percentage'),
                success_fee_amount=data.get('success_fee_amount'),
                probability=data.get('probability', 0),
                expected_close_date=data.get('expected_close_date'),
                description=data.get('description'),
                owner_id=data.get('owner_id')
            )
            db.session.add(deal)
            db.session.commit()
            return deal_schema.dump(deal), 201
        except Exception as e:
            return {'message': str(e)}, 400
    
    def put(self, deal_id):
        deal = Deal.query.get_or_404(deal_id)
        json_data = request.get_json()
        try:
            data = deal_schema.load(json_data, partial=True)
            for key, value in data.items():
                setattr(deal, key, value)
            db.session.commit()
            return deal_schema.dump(deal)
        except Exception as e:
            return {'message': str(e)}, 400
    
    def delete(self, deal_id):
        deal = Deal.query.get_or_404(deal_id)
        db.session.delete(deal)
        db.session.commit()
        return '', 204

class ActivityResource(Resource):
    def get(self, activity_id=None):
        if activity_id:
            activity = Activity.query.get_or_404(activity_id)
            return activity_schema.dump(activity)
        else:
            activities = Activity.query.all()
            return activities_schema.dump(activities)
    
    def post(self):
        json_data = request.get_json()
        try:
            data = activity_schema.load(json_data)
            activity = Activity(
                type=data['type'],
                subject=data['subject'],
                description=data.get('description'),
                status=data.get('status', 'pending'),
                due_date=data.get('due_date'),
                completion_date=data.get('completion_date'),
                contact_id=data.get('contact_id'),
                deal_id=data.get('deal_id'),
                owner_id=data.get('owner_id')
            )
            db.session.add(activity)
            db.session.commit()
            return activity_schema.dump(activity), 201
        except Exception as e:
            return {'message': str(e)}, 400
    
    def put(self, activity_id):
        activity = Activity.query.get_or_404(activity_id)
        json_data = request.get_json()
        try:
            data = activity_schema.load(json_data, partial=True)
            for key, value in data.items():
                setattr(activity, key, value)
            db.session.commit()
            return activity_schema.dump(activity)
        except Exception as e:
            return {'message': str(e)}, 400
    
    def delete(self, activity_id):
        activity = Activity.query.get_or_404(activity_id)
        db.session.delete(activity)
        db.session.commit()
        return '', 204

def initialize_routes(api):
    # User routes
    api.add_resource(UserResource, '/api/users', '/api/users/<int:user_id>')
    
    # Contact routes
    api.add_resource(ContactResource, '/api/contacts', '/api/contacts/<int:contact_id>')
    
    # Deal routes
    api.add_resource(DealResource, '/api/deals', '/api/deals/<int:deal_id>')
    
    # Activity routes
    api.add_resource(ActivityResource, '/api/activities', '/api/activities/<int:activity_id>')
