from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Cliente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    telefone = db.Column(db.String(20), nullable=False)
    cidade = db.Column(db.String(100), nullable=False)
    fazenda = db.Column(db.String(100))
    coordenadas = db.Column(db.String(200))
    area = db.Column(db.Float, nullable=False)
    maquinas = db.Column(db.Text, nullable=False)
    temperatura = db.Column(db.String(20), default='Fria')  # Fria, Morna, Quente
    valor = db.Column(db.Float)
    oportunidades = db.Column(db.Text)
    pendencias = db.Column(db.Text)
    status = db.Column(db.String(50), default='Início de Relacionamento')
    data_faturamento = db.Column(db.Date)
    observacoes_faturamento = db.Column(db.Text)
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)
    atualizado_em = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    criado_por = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Relacionamentos
    historico = db.relationship('HistoricoCliente', backref='cliente', lazy=True, cascade='all, delete-orphan')
    fotos = db.relationship('FotoCliente', backref='cliente', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Cliente {self.nome}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'telefone': self.telefone,
            'cidade': self.cidade,
            'fazenda': self.fazenda,
            'coordenadas': self.coordenadas,
            'area': self.area,
            'maquinas': self.maquinas,
            'temperatura': self.temperatura,
            'valor': self.valor,
            'oportunidades': self.oportunidades,
            'pendencias': self.pendencias,
            'status': self.status,
            'data_faturamento': self.data_faturamento.isoformat() if self.data_faturamento else None,
            'observacoes_faturamento': self.observacoes_faturamento,
            'criado_em': self.criado_em.isoformat() if self.criado_em else None,
            'atualizado_em': self.atualizado_em.isoformat() if self.atualizado_em else None,
            'criado_por': self.criado_por,
            'historico': [h.to_dict() for h in self.historico],
            'fotos': [f.to_dict() for f in self.fotos]
        }

class HistoricoCliente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('cliente.id'), nullable=False)
    evento = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.Text)
    data = db.Column(db.DateTime, default=datetime.utcnow)
    usuario_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Relacionamento com usuário
    usuario = db.relationship('User', backref='historicos')

    def __repr__(self):
        return f'<HistoricoCliente {self.evento}>'

    def to_dict(self):
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'evento': self.evento,
            'descricao': self.descricao,
            'data': self.data.isoformat() if self.data else None,
            'usuario_id': self.usuario_id,
            'usuario_nome': self.usuario.nome if self.usuario else None
        }

class FotoCliente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('cliente.id'), nullable=False)
    nome_arquivo = db.Column(db.String(255), nullable=False)
    caminho = db.Column(db.String(500), nullable=False)
    descricao = db.Column(db.String(200))
    data_upload = db.Column(db.DateTime, default=datetime.utcnow)
    usuario_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<FotoCliente {self.nome_arquivo}>'

    def to_dict(self):
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'nome_arquivo': self.nome_arquivo,
            'caminho': self.caminho,
            'descricao': self.descricao,
            'data_upload': self.data_upload.isoformat() if self.data_upload else None,
            'usuario_id': self.usuario_id
        }

