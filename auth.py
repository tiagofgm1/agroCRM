from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import check_password_hash
import jwt
from datetime import datetime, timedelta
from functools import wraps
from src.models.user import db, User

auth_bp = Blueprint('auth', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer TOKEN
            except IndexError:
                return jsonify({'message': 'Token inválido!'}), 401
        
        if not token:
            return jsonify({'message': 'Token é necessário!'}), 401
        
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['user_id']).first()
            if not current_user or not current_user.ativo:
                return jsonify({'message': 'Usuário inválido!'}), 401
        except:
            return jsonify({'message': 'Token inválido!'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

def gerente_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user.tipo != 'gerente':
            return jsonify({'message': 'Acesso negado! Apenas gerentes podem acessar.'}), 403
        return f(current_user, *args, **kwargs)
    
    return decorated

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('senha'):
            return jsonify({'message': 'Email e senha são obrigatórios!'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if user and user.check_password(data['senha']) and user.ativo:
            token = jwt.encode({
                'user_id': user.id,
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, current_app.config['SECRET_KEY'], algorithm='HS256')
            
            return jsonify({
                'token': token,
                'user': user.to_dict()
            }), 200
        
        return jsonify({'message': 'Credenciais inválidas!'}), 401
    
    except Exception as e:
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@auth_bp.route('/register', methods=['POST'])
@token_required
@gerente_required
def register(current_user):
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ('nome', 'email', 'senha', 'tipo')):
            return jsonify({'message': 'Nome, email, senha e tipo são obrigatórios!'}), 400
        
        if data['tipo'] not in ['gerente', 'vendedor']:
            return jsonify({'message': 'Tipo deve ser "gerente" ou "vendedor"!'}), 400
        
        # Verificar se email já existe
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email já cadastrado!'}), 400
        
        # Criar novo usuário
        new_user = User(
            nome=data['nome'],
            email=data['email'],
            tipo=data['tipo'],
            criado_por=current_user.id
        )
        new_user.set_password(data['senha'])
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'message': 'Usuário criado com sucesso!',
            'user': new_user.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@auth_bp.route('/users', methods=['GET'])
@token_required
@gerente_required
def get_users(current_user):
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users]), 200
    
    except Exception as e:
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@auth_bp.route('/users/<int:user_id>', methods=['PUT'])
@token_required
@gerente_required
def update_user(current_user, user_id):
    try:
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        if 'nome' in data:
            user.nome = data['nome']
        if 'email' in data:
            # Verificar se email já existe em outro usuário
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user and existing_user.id != user_id:
                return jsonify({'message': 'Email já cadastrado!'}), 400
            user.email = data['email']
        if 'tipo' in data and data['tipo'] in ['gerente', 'vendedor']:
            user.tipo = data['tipo']
        if 'ativo' in data:
            user.ativo = data['ativo']
        if 'senha' in data and data['senha']:
            user.set_password(data['senha'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Usuário atualizado com sucesso!',
            'user': user.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@auth_bp.route('/users/<int:user_id>', methods=['DELETE'])
@token_required
@gerente_required
def delete_user(current_user, user_id):
    try:
        if user_id == current_user.id:
            return jsonify({'message': 'Não é possível excluir seu próprio usuário!'}), 400
        
        user = User.query.get_or_404(user_id)
        
        # Soft delete - apenas desativar o usuário
        user.ativo = False
        db.session.commit()
        
        return jsonify({'message': 'Usuário desativado com sucesso!'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify(current_user.to_dict()), 200

