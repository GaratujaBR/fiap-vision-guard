#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
FIAP VisionGuard - Rotas da aplicação
Este módulo contém as definições de rotas e endpoints para a aplicação Flask.
"""

import os
import uuid
from datetime import datetime
from flask import (
    Blueprint, flash, redirect, render_template, 
    request, url_for, current_app, jsonify
)
from werkzeug.utils import secure_filename

# Importa os módulos de processamento de vídeo, inferência e alertas
from .utils.video_processing import extract_frames
from .model.inference import detect_objects
from .alerts.alert import send_alert

# Cria um Blueprint para as rotas
bp = Blueprint('routes', __name__)

def allowed_file(filename):
    """
    Verifica se o arquivo possui uma extensão permitida.
    
    Args:
        filename (str): Nome do arquivo a ser verificado.
        
    Returns:
        bool: True se a extensão for permitida, False caso contrário.
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

@bp.route('/')
def index():
    """
    Rota principal que renderiza a página inicial.
    
    Returns:
        str: HTML renderizado da página inicial.
    """
    return render_template('index.html')

@bp.route('/upload', methods=['GET', 'POST'])
def upload_file():
    """
    Rota para upload de vídeos.
    
    Returns:
        str: HTML renderizado da página de upload ou redirecionamento após o upload.
    """
    if request.method == 'POST':
        # Verifica se o arquivo está presente na requisição
        if 'file' not in request.files:
            flash('Nenhum arquivo enviado', 'error')
            return redirect(request.url)
        
        file = request.files['file']
        
        # Se o usuário não selecionar um arquivo, o navegador envia um
        # arquivo vazio sem nome
        if file.filename == '':
            flash('Nenhum arquivo selecionado', 'error')
            return redirect(request.url)
        
        if file and allowed_file(file.filename):
            # Gera um nome de arquivo seguro e único
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4()}_{filename}"
            
            # Define o caminho completo para salvar o arquivo
            upload_folder = os.path.join(current_app.instance_path, current_app.config['UPLOAD_FOLDER'])
            file_path = os.path.join(upload_folder, unique_filename)
            
            # Salva o arquivo
            file.save(file_path)
            
            # Redireciona para a rota de processamento
            return redirect(url_for('routes.process_video', filename=unique_filename))
        else:
            flash('Tipo de arquivo não permitido. Use mp4, avi, mov ou wmv.', 'error')
            return redirect(request.url)
    
    # Se for uma requisição GET, renderiza o template de upload
    return render_template('upload.html')

@bp.route('/process/<filename>')
def process_video(filename):
    """
    Rota para processar o vídeo enviado.
    
    Args:
        filename (str): Nome do arquivo a ser processado.
        
    Returns:
        str: HTML renderizado da página de resultados.
    """
    # Define o caminho completo do arquivo
    upload_folder = os.path.join(current_app.instance_path, current_app.config['UPLOAD_FOLDER'])
    file_path = os.path.join(upload_folder, filename)
    
    # Verifica se o arquivo existe
    if not os.path.exists(file_path):
        flash('Arquivo não encontrado', 'error')
        return redirect(url_for('routes.upload_file'))
    
    try:
        # Extrai frames do vídeo
        frames_folder = extract_frames(file_path)
        
        # Detecta objetos cortantes nos frames
        detection_results = detect_objects(frames_folder)
        
        # Se objetos cortantes forem detectados, envia alerta
        if detection_results['detected']:
            alert_info = send_alert(
                detection_type=detection_results['object_type'],
                frame_path=detection_results['frame_path'],
                confidence=detection_results['confidence']
            )
            
            # Registra o alerta nos logs
            log_alert(filename, detection_results, alert_info)
            
            # Renderiza a página de resultados com as informações de detecção
            return render_template(
                'results.html',
                filename=filename,
                detection_results=detection_results,
                alert_info=alert_info
            )
        else:
            # Se nenhum objeto cortante for detectado
            return render_template(
                'results.html',
                filename=filename,
                detection_results=detection_results,
                alert_info=None
            )
    
    except Exception as e:
        # Em caso de erro no processamento
        flash(f'Erro ao processar o vídeo: {str(e)}', 'error')
        return redirect(url_for('routes.upload_file'))

@bp.route('/logs')
def view_logs():
    """
    Rota para visualizar os logs de detecção e alertas.
    
    Returns:
        str: HTML renderizado da página de logs.
    """
    # Implementação simples de logs para o MVP
    # Em uma versão mais completa, isso seria armazenado em um banco de dados
    logs = []
    log_file = os.path.join(current_app.instance_path, 'logs', 'alerts.log')
    
    if os.path.exists(log_file):
        with open(log_file, 'r') as f:
            logs = f.readlines()
    
    return render_template('logs.html', logs=logs)

def log_alert(filename, detection_results, alert_info):
    """
    Registra informações de alerta em um arquivo de log.
    
    Args:
        filename (str): Nome do arquivo de vídeo.
        detection_results (dict): Resultados da detecção.
        alert_info (dict): Informações sobre o alerta enviado.
    """
    log_dir = os.path.join(current_app.instance_path, 'logs')
    os.makedirs(log_dir, exist_ok=True)
    
    log_file = os.path.join(log_dir, 'alerts.log')
    
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log_entry = (
        f"[{timestamp}] Alerta: Objeto cortante detectado no vídeo '{filename}'\n"
        f"  - Tipo: {detection_results['object_type']}\n"
        f"  - Confiança: {detection_results['confidence']:.2f}\n"
        f"  - Frame: {os.path.basename(detection_results['frame_path'])}\n"
        f"  - Alerta enviado via: {alert_info['method']}\n"
        f"  - Status do alerta: {alert_info['status']}\n"
        f"{'='*80}\n"
    )
    
    with open(log_file, 'a') as f:
        f.write(log_entry)
