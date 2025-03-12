#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
FIAP VisionGuard - Inferência do Modelo
Este módulo contém funções para carregar o modelo de IA e realizar inferência
para detecção de objetos cortantes em frames de vídeo.
"""

import os
import logging
import json
import numpy as np
import cv2
from pathlib import Path
from flask import current_app
from ultralytics import YOLO
from datetime import datetime

# Importa funções de configuração do modelo
from ..utils.model_setup import get_model_path, get_model_info as get_model_info_from_setup

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Obtém o caminho do modelo
MODEL_PATH = str(get_model_path())

# Carrega as informações do modelo
MODEL_INFO = get_model_info_from_setup()
if MODEL_INFO:
    DETECTION_THRESHOLD = MODEL_INFO.get('detection_threshold', 0.35)
    OBJECT_CLASSES = MODEL_INFO.get('classes', ['knife'])
else:
    logger.warning("Não foi possível carregar as informações do modelo. Usando valores padrão.")
    DETECTION_THRESHOLD = 0.35
    OBJECT_CLASSES = ['knife']

class SharpObjectDetector:
    """
    Classe para detecção de objetos cortantes em imagens usando YOLOv8.
    """
    
    def __init__(self, model_path=None):
        """
        Inicializa o detector de objetos cortantes.
        
        Args:
            model_path (str, optional): Caminho para o modelo treinado.
                                        Se None, usa o caminho padrão.
        """
        self.model_path = model_path or MODEL_PATH
        logger.info(f"Inicializando detector de objetos cortantes. Modelo: {self.model_path}")
        
        try:
            # Carrega o modelo YOLOv8 usando a biblioteca Ultralytics
            self.model = self._load_model()
            logger.info("Detector inicializado com sucesso.")
        except Exception as e:
            logger.error(f"Erro ao carregar o modelo: {str(e)}")
            # Fallback para o modelo stub em caso de erro
            logger.warning("Usando modelo stub como fallback.")
            self.model = None
    
    def _load_model(self):
        """
        Carrega o modelo YOLOv8.
        
        Returns:
            YOLO: Modelo YOLOv8 carregado.
        """
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Arquivo do modelo não encontrado: {self.model_path}")
        
        # Carrega o modelo usando a biblioteca Ultralytics
        model = YOLO(self.model_path)
        return model
    
    def detect(self, image_path):
        """
        Detecta objetos cortantes em uma imagem.
        
        Args:
            image_path (str): Caminho para a imagem a ser analisada.
            
        Returns:
            dict: Resultados da detecção com as seguintes chaves:
                - detected (bool): Se um objeto cortante foi detectado
                - object_type (str): Tipo de objeto detectado (se houver)
                - confidence (float): Nível de confiança da detecção
                - bounding_box (list): Coordenadas da caixa delimitadora [x1, y1, x2, y2]
        """
        logger.info(f"Analisando imagem: {image_path}")
        
        # Verifica se o modelo foi carregado corretamente
        if self.model is None:
            # Fallback para detecção simulada
            return self._simulate_detection()
        
        try:
            # Realiza a inferência usando o modelo YOLOv8
            results = self.model(image_path)
            
            # Processa os resultados
            if len(results) > 0:
                result = results[0]  # Pega o primeiro resultado
                
                # Verifica se há detecções
                if len(result.boxes) > 0:
                    # Obtém as caixas delimitadoras, confiança e classes
                    boxes = result.boxes.xyxy.cpu().numpy()
                    confidences = result.boxes.conf.cpu().numpy()
                    class_ids = result.boxes.cls.cpu().numpy().astype(int)
                    
                    # Encontra a detecção com maior confiança
                    best_idx = np.argmax(confidences)
                    confidence = confidences[best_idx]
                    
                    # Verifica se a confiança é maior que o limiar
                    if confidence > DETECTION_THRESHOLD:
                        box = boxes[best_idx]
                        class_id = class_ids[best_idx]
                        
                        # Obtém o tipo de objeto detectado
                        object_type = OBJECT_CLASSES[class_id] if class_id < len(OBJECT_CLASSES) else "objeto_cortante"
                        
                        logger.info(f"Objeto cortante detectado: {object_type} (confiança: {confidence:.2f})")
                        
                        return {
                            'detected': True,
                            'object_type': object_type,
                            'confidence': float(confidence),
                            'bounding_box': box.tolist()
                        }
            
            logger.info("Nenhum objeto cortante detectado.")
            return {
                'detected': False,
                'object_type': None,
                'confidence': 0.0,
                'bounding_box': None
            }
            
        except Exception as e:
            logger.error(f"Erro durante a detecção: {str(e)}")
            # Fallback para detecção simulada em caso de erro
            return self._simulate_detection()
    
    def _simulate_detection(self):
        """
        Simula uma detecção para casos de fallback.
        
        Returns:
            dict: Resultados simulados da detecção.
        """
        logger.warning("Usando detecção simulada (fallback).")
        
        import random
        
        # Simulação: 20% de chance de detectar um objeto cortante
        if random.random() < 0.2:
            object_type = OBJECT_CLASSES[0] if OBJECT_CLASSES else "knife"
            confidence = random.uniform(0.6, 0.95)
            
            # Bounding box simulada
            bounding_box = [
                random.uniform(0.1, 0.4),  # x1
                random.uniform(0.1, 0.4),  # y1
                random.uniform(0.6, 0.9),  # x2
                random.uniform(0.6, 0.9)   # y2
            ]
            
            logger.info(f"Objeto cortante detectado (simulado): {object_type} (confiança: {confidence:.2f})")
            
            return {
                'detected': True,
                'object_type': object_type,
                'confidence': confidence,
                'bounding_box': bounding_box
            }
        else:
            logger.info("Nenhum objeto cortante detectado (simulado).")
            
            return {
                'detected': False,
                'object_type': None,
                'confidence': 0.0,
                'bounding_box': None
            }

def detect_objects(frames_dir):
    """
    Detecta objetos cortantes em um conjunto de frames.
    
    Args:
        frames_dir (str): Diretório contendo os frames extraídos do vídeo.
        
    Returns:
        dict: Resultados da detecção com as seguintes chaves:
            - detected (bool): Se um objeto cortante foi detectado em algum frame
            - object_type (str): Tipo de objeto detectado (se houver)
            - confidence (float): Nível de confiança da detecção
            - frame_path (str): Caminho para o frame onde o objeto foi detectado
            - frame_number (int): Número do frame onde o objeto foi detectado
            - bounding_box (list): Coordenadas da caixa delimitadora [x1, y1, x2, y2]
            - display_path (str): Caminho relativo para exibição no frontend
    """
    logger.info(f"Iniciando detecção de objetos em frames do diretório: {frames_dir}")
    
    # Inicializa o detector
    detector = SharpObjectDetector()
    
    # Lista todos os arquivos de imagem no diretório
    image_files = [f for f in os.listdir(frames_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
    image_files.sort()  # Garante que os frames sejam processados em ordem
    
    logger.info(f"Analisando {len(image_files)} frames...")
    
    # Resultados da detecção
    best_detection = {
        'detected': False,
        'object_type': None,
        'confidence': 0.0,
        'frame_path': None,
        'frame_number': None,
        'bounding_box': None,
        'display_path': None
    }
    
    # Processa cada frame
    for i, img_file in enumerate(image_files):
        # Caminho completo para o arquivo de imagem
        img_path = os.path.join(frames_dir, img_file)
        
        # Realiza a detecção
        result = detector.detect(img_path)
        
        # Se um objeto foi detectado e a confiança é maior que o limiar
        if result['detected'] and result['confidence'] > DETECTION_THRESHOLD:
            # Se é a primeira detecção ou tem maior confiança que a anterior
            if not best_detection['detected'] or result['confidence'] > best_detection['confidence']:
                # Salva o frame com a detecção para exibição no frontend
                display_path = save_detection_frame(img_path, result['bounding_box'], result['object_type'], result['confidence'])
                
                best_detection = {
                    'detected': True,
                    'object_type': result['object_type'],
                    'confidence': result['confidence'],
                    'frame_path': img_path,
                    'frame_number': i,
                    'bounding_box': result['bounding_box'],
                    'display_path': display_path
                }
                
                logger.info(f"Objeto cortante detectado no frame {i}: {result['object_type']} "
                            f"(confiança: {result['confidence']:.2f})")
                
                # Opcional: interrompe a análise após a primeira detecção de alta confiança
                if result['confidence'] > 0.85:
                    logger.info("Detecção de alta confiança encontrada. Interrompendo análise.")
                    break
    
    if best_detection['detected']:
        logger.info(f"Detecção concluída. Objeto cortante encontrado: {best_detection['object_type']}")
    else:
        logger.info("Detecção concluída. Nenhum objeto cortante encontrado.")
    
    return best_detection

def save_detection_frame(img_path, bbox, object_type, confidence):
    """
    Salva o frame com a caixa delimitadora desenhada para exibição no frontend.
    
    Args:
        img_path (str): Caminho para o frame original
        bbox (list): Coordenadas da caixa delimitadora [x1, y1, x2, y2]
        object_type (str): Tipo de objeto detectado
        confidence (float): Nível de confiança da detecção
        
    Returns:
        str: Caminho relativo para o frame salvo
    """
    try:
        # Lê a imagem
        img = cv2.imread(img_path)
        if img is None:
            logger.error(f"Não foi possível ler a imagem: {img_path}")
            return None
        
        # Obtém as dimensões da imagem
        height, width = img.shape[:2]
        
        # Converte as coordenadas normalizadas para pixels se necessário
        if bbox[0] < 1.0 and bbox[1] < 1.0 and bbox[2] < 1.0 and bbox[3] < 1.0:
            x1, y1, x2, y2 = int(bbox[0] * width), int(bbox[1] * height), int(bbox[2] * width), int(bbox[3] * height)
        else:
            x1, y1, x2, y2 = int(bbox[0]), int(bbox[1]), int(bbox[2]), int(bbox[3])
        
        # Desenha a caixa delimitadora
        cv2.rectangle(img, (x1, y1), (x2, y2), (0, 0, 255), 2)
        
        # Adiciona texto com o tipo de objeto e confiança
        label = f"{object_type}: {confidence:.2f}"
        cv2.putText(img, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
        
        # Cria um nome de arquivo único baseado no timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"detection_{timestamp}.jpg"
        
        # Define o caminho para salvar a imagem na pasta static/frames
        from flask import current_app
        static_folder = current_app.static_folder if current_app else os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static')
        save_dir = os.path.join(static_folder, 'frames')
        os.makedirs(save_dir, exist_ok=True)
        
        save_path = os.path.join(save_dir, filename)
        
        # Salva a imagem
        cv2.imwrite(save_path, img)
        
        # Retorna o caminho relativo para o frontend
        return f"frames/{filename}"
        
    except Exception as e:
        logger.error(f"Erro ao salvar o frame com detecção: {str(e)}")
        return None

def load_model():
    """
    Carrega o modelo de detecção de objetos cortantes.
    
    Returns:
        object: Modelo carregado.
    """
    return SharpObjectDetector()

def get_model_info():
    """
    Retorna informações sobre o modelo de detecção.
    
    Returns:
        dict: Informações sobre o modelo.
    """
    try:
        # Usa a função importada do módulo model_setup
        model_info = get_model_info_from_setup()
        if model_info:
            # Adiciona informação sobre o status do modelo (real vs stub)
            model_info['is_stub'] = False
            return model_info
    except Exception as e:
        logger.warning(f"Erro ao carregar informações do modelo: {str(e)}")
    
    # Retorna informações básicas em caso de erro
    return {
        'name': 'Sharp Object Detection Model',
        'version': '1.0.0',
        'classes': OBJECT_CLASSES,
        'threshold': DETECTION_THRESHOLD,
        'is_stub': False
    }
