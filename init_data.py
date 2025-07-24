from flask import Blueprint, jsonify
from src.models.user import db, User

init_bp = Blueprint('init', __name__)

@init_bp.route('/init-admin', methods=['POST'])
def init_admin():
    try:
        # Verificar se já existe um administrador
        admin_exists = User.query.filter_by(tipo='gerente').first()
        
        if admin_exists:
            return jsonify({'message': 'Administrador já existe!'}), 400
        
        # Criar usuário administrador padrão
        admin = User(
            nome='Administrador',
            email='admin@agrocrm.com',
            tipo='gerente',
            ativo=True
        )
        admin.set_password('admin123')
        
        db.session.add(admin)
        db.session.commit()
        
        return jsonify({
            'message': 'Administrador criado com sucesso!',
            'email': 'admin@agrocrm.com',
            'senha': 'admin123'
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

