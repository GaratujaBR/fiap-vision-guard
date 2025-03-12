#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
FIAP VisionGuard - Configuração do Modelo
Este módulo contém funções para configurar o modelo de IA e garantir que
os arquivos necessários estejam disponíveis para a aplicação.
"""

import os
import shutil
import logging
import json
from pathlib import Path
from flask import current_app

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def setup_model():
    """
    Configura o modelo de detecção de objetos cortantes.
    
    Verifica se os arquivos do modelo estão disponíveis e os copia para
    o diretório correto se necessário.
    
    Returns:
        bool: True se a configuração foi bem-sucedida, False caso contrário.
    """
    # Diretório raiz do projeto
    project_root = Path(__file__).parent.parent.parent.parent
    
    # Diretório do modelo fonte (na raiz do projeto)
    source_model_dir = project_root / 'model'
    
    # Diretório de destino para o modelo na aplicação
    app_model_dir = project_root / 'fiap_vision_guard' / 'models'
    os.makedirs(app_model_dir, exist_ok=True)
    
    # Arquivos do modelo
    model_files = [
        'sharp_objects_detector.pt',
        'sharp_objects_detector.onnx',
        'model_info.json'
    ]
    
    success = True
    
    # Copia os arquivos do modelo para o diretório da aplicação
    for file_name in model_files:
        source_file = source_model_dir / file_name
        dest_file = app_model_dir / file_name
        
        if source_file.exists():
            try:
                # Copia apenas se o arquivo de destino não existir ou for diferente
                if not dest_file.exists() or os.path.getsize(source_file) != os.path.getsize(dest_file):
                    logger.info(f"Copiando {file_name} para {dest_file}")
                    shutil.copy2(source_file, dest_file)
                else:
                    logger.info(f"Arquivo {file_name} já existe no destino e está atualizado")
            except Exception as e:
                logger.error(f"Erro ao copiar {file_name}: {str(e)}")
                success = False
        else:
            logger.warning(f"Arquivo do modelo não encontrado: {source_file}")
            success = False
    
    # Verifica se o modelo foi configurado com sucesso
    if success:
        logger.info("Modelo configurado com sucesso")
    else:
        logger.warning("Configuração do modelo incompleta")
    
    return success

def get_model_path(model_name='sharp_objects_detector', format='pt'):
    """
    Retorna o caminho para o arquivo do modelo.
    
    Args:
        model_name (str, optional): Nome base do modelo. Defaults to 'sharp_objects_detector'.
        format (str, optional): Formato do modelo ('pt' ou 'onnx'). Defaults to 'pt'.
        
    Returns:
        Path: Caminho para o arquivo do modelo.
    """
    # Diretório raiz do projeto
    project_root = Path(__file__).parent.parent.parent.parent
    
    # Verifica primeiro no diretório da aplicação
    app_model_path = project_root / 'fiap_vision_guard' / 'models' / f"{model_name}.{format}"
    
    # Se não existir, verifica no diretório do modelo fonte
    if not app_model_path.exists():
        source_model_path = project_root / 'model' / f"{model_name}.{format}"
        if source_model_path.exists():
            return source_model_path
    
    return app_model_path

def get_model_info():
    """
    Retorna as informações do modelo a partir do arquivo model_info.json.
    
    Returns:
        dict: Informações do modelo ou None se o arquivo não for encontrado.
    """
    # Diretório raiz do projeto
    project_root = Path(__file__).parent.parent.parent.parent
    
    # Verifica primeiro no diretório da aplicação
    app_info_path = project_root / 'fiap_vision_guard' / 'models' / 'model_info.json'
    
    # Se não existir, verifica no diretório do modelo fonte
    if not app_info_path.exists():
        source_info_path = project_root / 'model' / 'model_info.json'
        if source_info_path.exists():
            info_path = source_info_path
        else:
            return None
    else:
        info_path = app_info_path
    
    try:
        with open(info_path, 'r') as f:
            model_info = json.load(f)
        return model_info
    except Exception as e:
        logger.error(f"Erro ao carregar informações do modelo: {str(e)}")
        return None

if __name__ == "__main__":
    # Se executado diretamente, configura o modelo
    setup_model()
