from flask import request, jsonify
from flask_restful import Resource
from models import User, Contact, Deal, Activity, Document, Campaign, Template
from knowledge_base import KnowledgeCategory, KnowledgeArticle, VoiceAgentScript, EmailTemplate, WorkflowTemplate, WorkflowStep
from app import db
from marshmallow import Schema, fields, validate

# Knowledge Base Schemas
class KnowledgeCategorySchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    description = fields.Str()
    parent_id = fields.Int()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class KnowledgeArticleSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    content = fields.Str(required=True)
    category_id = fields.Int(required=True)
    source = fields.Str()
    tags = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class VoiceAgentScriptSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    description = fields.Str()
    script_type = fields.Str(required=True)
    script_content = fields.Str(required=True)
    variables = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class EmailTemplateSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    description = fields.Str()
    subject = fields.Str(required=True)
    body = fields.Str(required=True)
    template_type = fields.Str(required=True)
    variables = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class WorkflowTemplateSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    description = fields.Str()
    workflow_type = fields.Str(required=True)
    stages = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class WorkflowStepSchema(Schema):
    id = fields.Int(dump_only=True)
    workflow_id = fields.Int(required=True)
    name = fields.Str(required=True)
    description = fields.Str()
    step_order = fields.Int(required=True)
    action_type = fields.Str()
    action_details = fields.Str()
    conditions = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

# Initialize schemas
knowledge_category_schema = KnowledgeCategorySchema()
knowledge_categories_schema = KnowledgeCategorySchema(many=True)
knowledge_article_schema = KnowledgeArticleSchema()
knowledge_articles_schema = KnowledgeArticleSchema(many=True)
voice_agent_script_schema = VoiceAgentScriptSchema()
voice_agent_scripts_schema = VoiceAgentScriptSchema(many=True)
email_template_schema = EmailTemplateSchema()
email_templates_schema = EmailTemplateSchema(many=True)
workflow_template_schema = WorkflowTemplateSchema()
workflow_templates_schema = WorkflowTemplateSchema(many=True)
workflow_step_schema = WorkflowStepSchema()
workflow_steps_schema = WorkflowStepSchema(many=True)

# Knowledge Category Resource
class KnowledgeCategoryResource(Resource):
    def get(self, category_id=None):
        if category_id:
            category = KnowledgeCategory.query.get_or_404(category_id)
            return knowledge_category_schema.dump(category)
        else:
            categories = KnowledgeCategory.query.all()
            return knowledge_categories_schema.dump(categories)
    
    def post(self):
        json_data = request.get_json()
        try:
            data = knowledge_category_schema.load(json_data)
            category = KnowledgeCategory(
                name=data['name'],
                description=data.get('description'),
                parent_id=data.get('parent_id')
            )
            db.session.add(category)
            db.session.commit()
            return knowledge_category_schema.dump(category), 201
        except Exception as e:
            return {'message': str(e)}, 400
    
    def put(self, category_id):
        category = KnowledgeCategory.query.get_or_404(category_id)
        json_data = request.get_json()
        try:
            data = knowledge_category_schema.load(json_data, partial=True)
            for key, value in data.items():
                setattr(category, key, value)
            db.session.commit()
            return knowledge_category_schema.dump(category)
        except Exception as e:
            return {'message': str(e)}, 400
    
    def delete(self, category_id):
        category = KnowledgeCategory.query.get_or_404(category_id)
        db.session.delete(category)
        db.session.commit()
        return '', 204

# Knowledge Article Resource
class KnowledgeArticleResource(Resource):
    def get(self, article_id=None):
        if article_id:
            article = KnowledgeArticle.query.get_or_404(article_id)
            return knowledge_article_schema.dump(article)
        else:
            articles = KnowledgeArticle.query.all()
            return knowledge_articles_schema.dump(articles)
    
    def post(self):
        json_data = request.get_json()
        try:
            data = knowledge_article_schema.load(json_data)
            article = KnowledgeArticle(
                title=data['title'],
                content=data['content'],
                category_id=data['category_id'],
                source=data.get('source'),
                tags=data.get('tags')
            )
            db.session.add(article)
            db.session.commit()
            return knowledge_article_schema.dump(article), 201
        except Exception as e:
            return {'message': str(e)}, 400
    
    def put(self, article_id):
        article = KnowledgeArticle.query.get_or_404(article_id)
        json_data = request.get_json()
        try:
            data = knowledge_article_schema.load(json_data, partial=True)
            for key, value in data.items():
                setattr(article, key, value)
            db.session.commit()
            return knowledge_article_schema.dump(article)
        except Exception as e:
            return {'message': str(e)}, 400
    
    def delete(self, article_id):
        article = KnowledgeArticle.query.get_or_404(article_id)
        db.session.delete(article)
        db.session.commit()
        return '', 204

# Voice Agent Script Resource
class VoiceAgentScriptResource(Resource):
    def get(self, script_id=None):
        if script_id:
            script = VoiceAgentScript.query.get_or_404(script_id)
            return voice_agent_script_schema.dump(script)
        else:
            scripts = VoiceAgentScript.query.all()
            return voice_agent_scripts_schema.dump(scripts)
    
    def post(self):
        json_data = request.get_json()
        try:
            data = voice_agent_script_schema.load(json_data)
            script = VoiceAgentScript(
                name=data['name'],
                description=data.get('description'),
                script_type=data['script_type'],
                script_content=data['script_content'],
                variables=data.get('variables')
            )
            db.session.add(script)
            db.session.commit()
            return voice_agent_script_schema.dump(script), 201
        except Exception as e:
            return {'message': str(e)}, 400
    
    def put(self, script_id):
        script = VoiceAgentScript.query.get_or_404(script_id)
        json_data = request.get_json()
        try:
            data = voice_agent_script_schema.load(json_data, partial=True)
            for key, value in data.items():
                setattr(script, key, value)
            db.session.commit()
            return voice_agent_script_schema.dump(script)
        except Exception as e:
            return {'message': str(e)}, 400
    
    def delete(self, script_id):
        script = VoiceAgentScript.query.get_or_404(script_id)
        db.session.delete(script)
        db.session.commit()
        return '', 204

# Email Template Resource
class EmailTemplateResource(Resource):
    def get(self, template_id=None):
        if template_id:
            template = EmailTemplate.query.get_or_404(template_id)
            return email_template_schema.dump(template)
        else:
            templates = EmailTemplate.query.all()
            return email_templates_schema.dump(templates)
    
    def post(self):
        json_data = request.get_json()
        try:
            data = email_template_schema.load(json_data)
            template = EmailTemplate(
                name=data['name'],
                description=data.get('description'),
                subject=data['subject'],
                body=data['body'],
                template_type=data['template_type'],
                variables=data.get('variables')
            )
            db.session.add(template)
            db.session.commit()
            return email_template_schema.dump(template), 201
        except Exception as e:
            return {'message': str(e)}, 400
    
    def put(self, template_id):
        template = EmailTemplate.query.get_or_404(template_id)
        json_data = request.get_json()
        try:
            data = email_template_schema.load(json_data, partial=True)
            for key, value in data.items():
                setattr(template, key, value)
            db.session.commit()
            return email_template_schema.dump(template)
        except Exception as e:
            return {'message': str(e)}, 400
    
    def delete(self, template_id):
        template = EmailTemplate.query.get_or_404(template_id)
        db.session.delete(template)
        db.session.commit()
        return '', 204

# Add these routes to the initialize_routes function
def initialize_knowledge_routes(api):
    # Knowledge Category routes
    api.add_resource(KnowledgeCategoryResource, '/api/knowledge/categories', '/api/knowledge/categories/<int:category_id>')
    
    # Knowledge Article routes
    api.add_resource(KnowledgeArticleResource, '/api/knowledge/articles', '/api/knowledge/articles/<int:article_id>')
    
    # Voice Agent Script routes
    api.add_resource(VoiceAgentScriptResource, '/api/voice/scripts', '/api/voice/scripts/<int:script_id>')
    
    # Email Template routes
    api.add_resource(EmailTemplateResource, '/api/email/templates', '/api/email/templates/<int:template_id>')
