#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
FIAP VisionGuard - Processamento de Vídeo
Este módulo contém funções para processamento de vídeos e extração de frames.
"""

import os
import cv2
import uuid
import logging
from datetime import datetime
from pathlib import Path
from flask import current_app

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def extract_frames(video_path, output_dir=None, frame_rate=1):
    """
    Extrai frames de um arquivo de vídeo em intervalos regulares.
    
    Args:
        video_path (str): Caminho para o arquivo de vídeo.
        output_dir (str, optional): Diretório para salvar os frames extraídos.
                                    Se None, cria um diretório temporário.
        frame_rate (int, optional): Número de frames a extrair por segundo. Defaults to 1.
        
    Returns:
        str: Caminho para o diretório contendo os frames extraídos.
    """
    # Verifica se o arquivo de vídeo existe
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Arquivo de vídeo não encontrado: {video_path}")
    
    # Cria um diretório para os frames se não for especificado
    if output_dir is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        frames_dir = os.path.join(
            current_app.instance_path, 
            'frames', 
            f"video_{timestamp}_{unique_id}"
        )
        os.makedirs(frames_dir, exist_ok=True)
    else:
        frames_dir = output_dir
        os.makedirs(frames_dir, exist_ok=True)
    
    logger.info(f"Extraindo frames do vídeo: {video_path}")
    logger.info(f"Frames serão salvos em: {frames_dir}")
    
    try:
        # Abre o vídeo
        video = cv2.VideoCapture(video_path)
        
        # Verifica se o vídeo foi aberto corretamente
        if not video.isOpened():
            raise Exception(f"Não foi possível abrir o vídeo: {video_path}")
        
        # Obtém informações do vídeo
        fps = video.get(cv2.CAP_PROP_FPS)
        total_frames = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = total_frames / fps if fps > 0 else 0
        
        logger.info(f"Informações do vídeo: FPS={fps}, Total de frames={total_frames}, Duração={duration:.2f}s")
        
        # Calcula o intervalo para extração de frames
        frame_interval = int(fps / frame_rate) if fps > 0 else 1
        
        # Extrai os frames
        frame_count = 0
        saved_frames = 0
        
        while True:
            # Lê o próximo frame
            ret, frame = video.read()
            
            # Verifica se chegou ao fim do vídeo
            if not ret:
                break
            
            # Salva o frame em intervalos regulares
            if frame_count % frame_interval == 0:
                frame_path = os.path.join(frames_dir, f"frame_{saved_frames:04d}.jpg")
                cv2.imwrite(frame_path, frame)
                saved_frames += 1
            
            frame_count += 1
            
            # Log de progresso a cada 100 frames processados
            if frame_count % 100 == 0:
                progress = (frame_count / total_frames) * 100 if total_frames > 0 else 0
                logger.info(f"Progresso: {progress:.1f}% ({frame_count}/{total_frames} frames)")
        
        # Libera o recurso de vídeo
        video.release()
        
        logger.info(f"Extração de frames concluída. Total de frames extraídos: {saved_frames}")
        
        return frames_dir
    
    except Exception as e:
        logger.error(f"Erro ao extrair frames: {str(e)}")
        raise

def resize_frame(frame, target_size=(640, 480)):
    """
    Redimensiona um frame para o tamanho alvo.
    
    Args:
        frame (numpy.ndarray): Frame a ser redimensionado.
        target_size (tuple, optional): Tamanho alvo (largura, altura). Defaults to (640, 480).
        
    Returns:
        numpy.ndarray: Frame redimensionado.
    """
    return cv2.resize(frame, target_size, interpolation=cv2.INTER_AREA)

def preprocess_frames(frames_dir, target_size=(640, 480)):
    """
    Pré-processa todos os frames em um diretório.
    
    Args:
        frames_dir (str): Diretório contendo os frames.
        target_size (tuple, optional): Tamanho alvo para redimensionamento. Defaults to (640, 480).
        
    Returns:
        list: Lista de caminhos para os frames pré-processados.
    """
    processed_frames = []
    
    # Cria um diretório para os frames processados
    processed_dir = os.path.join(frames_dir, 'processed')
    os.makedirs(processed_dir, exist_ok=True)
    
    # Lista todos os arquivos de imagem no diretório
    image_files = [f for f in os.listdir(frames_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
    
    logger.info(f"Pré-processando {len(image_files)} frames...")
    
    for img_file in image_files:
        # Caminho completo para o arquivo de imagem
        img_path = os.path.join(frames_dir, img_file)
        
        # Lê a imagem
        frame = cv2.imread(img_path)
        
        if frame is not None:
            # Redimensiona o frame
            processed_frame = resize_frame(frame, target_size)
            
            # Salva o frame processado
            processed_path = os.path.join(processed_dir, img_file)
            cv2.imwrite(processed_path, processed_frame)
            
            processed_frames.append(processed_path)
    
    logger.info(f"Pré-processamento concluído. {len(processed_frames)} frames processados.")
    
    return processed_frames
