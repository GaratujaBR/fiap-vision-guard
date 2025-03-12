#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
FIAP VisionGuard - Aplicação principal
Este módulo contém o ponto de entrada da aplicação Flask para o sistema de detecção
de objetos cortantes em vídeos de câmeras de segurança.
"""

import os
from flask import Flask
from dotenv import load_dotenv

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

def create_app(test_config=None):
    """
    Função de fábrica para criar a aplicação Flask.
    
    Args:
        test_config (dict, optional): Configuração para testes. Defaults to None.
        
    Returns:
        Flask: Instância da aplicação Flask configurada.
    """
    # Cria e configura a aplicação
    app = Flask(__name__, 
                static_folder='static',
                template_folder='templates')
    
    # Configuração padrão
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'dev'),
        UPLOAD_FOLDER=os.environ.get('UPLOAD_FOLDER', 'uploads'),
        MAX_CONTENT_LENGTH=16 * 1024 * 1024,  # 16MB máximo para uploads
        ALLOWED_EXTENSIONS={'mp4', 'avi', 'mov', 'wmv'},
    )
    
    # Sobrescreve com configuração de teste se fornecida
    if test_config is not None:
        app.config.update(test_config)
    
    # Garante que a pasta de uploads existe
    os.makedirs(os.path.join(app.instance_path, app.config['UPLOAD_FOLDER']), exist_ok=True)
    
    # Garante que a pasta de frames existe para armazenar os frames processados
    os.makedirs(os.path.join(app.static_folder, 'frames'), exist_ok=True)
    
    # Configura o modelo de detecção
    with app.app_context():
        from .utils.model_setup import setup_model
        setup_model()
    
    # Registra as rotas
    from . import routes
    app.register_blueprint(routes.bp)
    
    # Rota simples para verificar se a aplicação está funcionando
    @app.route('/health')
    def health_check():
        return {'status': 'ok', 'message': 'FIAP VisionGuard está em execução'}
    
    return app

# Se este arquivo for executado diretamente, inicia a aplicação
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
