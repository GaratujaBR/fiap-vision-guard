#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
FIAP VisionGuard - Sistema de Alertas
Este módulo contém funções para enviar alertas quando objetos cortantes são detectados.
"""

import os
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from datetime import datetime
from flask import current_app

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Tipos de alerta suportados
ALERT_TYPES = ['email', 'sms', 'call']

def send_alert(detection_type, frame_path, confidence, alert_type='email'):
    """
    Envia um alerta quando um objeto cortante é detectado.
    
    Args:
        detection_type (str): Tipo de objeto detectado.
        frame_path (str): Caminho para o frame onde o objeto foi detectado.
        confidence (float): Nível de confiança da detecção.
        alert_type (str, optional): Tipo de alerta a ser enviado. Defaults to 'email'.
        
    Returns:
        dict: Informações sobre o alerta enviado.
    """
    logger.info(f"Enviando alerta para detecção de {detection_type} (confiança: {confidence:.2f})")
    
    if alert_type not in ALERT_TYPES:
        logger.warning(f"Tipo de alerta não suportado: {alert_type}. Usando email como padrão.")
        alert_type = 'email'
    
    # Informações do alerta
    alert_info = {
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'detection_type': detection_type,
        'confidence': confidence,
        'frame_path': frame_path,
        'method': alert_type,
        'status': 'pending'
    }
    
    try:
        # Envia o alerta de acordo com o tipo especificado
        if alert_type == 'email':
            result = send_email_alert(alert_info)
        elif alert_type == 'sms':
            result = send_sms_alert(alert_info)
        elif alert_type == 'call':
            result = send_call_alert(alert_info)
        
        # Atualiza o status do alerta
        alert_info['status'] = 'sent' if result else 'failed'
        
        logger.info(f"Alerta enviado com sucesso via {alert_type}.")
    except Exception as e:
        logger.error(f"Erro ao enviar alerta: {str(e)}")
        alert_info['status'] = 'failed'
        alert_info['error'] = str(e)
    
    return alert_info

def send_email_alert(alert_info):
    """
    Envia um alerta por e-mail.
    
    Args:
        alert_info (dict): Informações sobre o alerta.
        
    Returns:
        bool: True se o e-mail foi enviado com sucesso, False caso contrário.
    """
    try:
        # Configurações de e-mail
        smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.environ.get('SMTP_PORT', 587))
        smtp_username = os.environ.get('SMTP_USERNAME', 'seu-email@gmail.com')
        smtp_password = os.environ.get('SMTP_PASSWORD', 'sua-senha')
        
        # Endereços de e-mail
        sender_email = os.environ.get('SENDER_EMAIL', 'alerta@fiapvisionguard.com.br')
        receiver_email = os.environ.get('RECEIVER_EMAIL', 'seguranca@fiapvisionguard.com.br')
        
        # Cria a mensagem
        msg = MIMEMultipart()
        msg['Subject'] = f'ALERTA: Objeto Cortante Detectado - {alert_info["detection_type"]}'
        msg['From'] = sender_email
        msg['To'] = receiver_email
        
        # Corpo do e-mail
        body = f"""
        <html>
        <body>
            <h2>ALERTA DE SEGURANÇA - FIAP VisionGuard</h2>
            <p>Um objeto cortante foi detectado em um dos vídeos monitorados.</p>
            
            <h3>Detalhes da Detecção:</h3>
            <ul>
                <li><strong>Tipo de Objeto:</strong> {alert_info['detection_type']}</li>
                <li><strong>Confiança:</strong> {alert_info['confidence']:.2f}</li>
                <li><strong>Data e Hora:</strong> {alert_info['timestamp']}</li>
            </ul>
            
            <p>Uma imagem do frame onde o objeto foi detectado está anexada a este e-mail.</p>
            
            <p>Este é um alerta automático gerado pelo sistema FIAP VisionGuard.</p>
        </body>
        </html>
        """
        
        # Adiciona o corpo do e-mail
        msg.attach(MIMEText(body, 'html'))
        
        # Anexa a imagem do frame
        if os.path.exists(alert_info['frame_path']):
            with open(alert_info['frame_path'], 'rb') as img_file:
                img = MIMEImage(img_file.read())
                img.add_header('Content-Disposition', 'attachment', 
                               filename=os.path.basename(alert_info['frame_path']))
                msg.attach(img)
        
        # Conecta ao servidor SMTP e envia o e-mail
        logger.info(f"Conectando ao servidor SMTP: {smtp_server}:{smtp_port}")
        
        # Simulação de envio para o MVP
        # Em um ambiente real, seria usado o código abaixo:
        """
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.send_message(msg)
        """
        
        # Para o MVP, apenas logamos a ação
        logger.info(f"E-mail de alerta enviado para: {receiver_email}")
        logger.info(f"Assunto: {msg['Subject']}")
        
        return True
    
    except Exception as e:
        logger.error(f"Erro ao enviar e-mail de alerta: {str(e)}")
        return False

def send_sms_alert(alert_info):
    """
    Envia um alerta por SMS.
    
    Args:
        alert_info (dict): Informações sobre o alerta.
        
    Returns:
        bool: True se o SMS foi enviado com sucesso, False caso contrário.
    """
    try:
        # Configurações de SMS (usando Twilio como exemplo)
        # Para implementação real, seria necessário instalar a biblioteca Twilio
        # e configurar as credenciais
        
        # Simulação de envio para o MVP
        logger.info("Enviando alerta por SMS...")
        logger.info(f"Mensagem: ALERTA - Objeto cortante ({alert_info['detection_type']}) "
                    f"detectado com confiança de {alert_info['confidence']:.2f}")
        
        # Em um ambiente real, seria usado o código abaixo:
        """
        from twilio.rest import Client
        
        account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
        auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
        twilio_phone = os.environ.get('TWILIO_PHONE')
        target_phone = os.environ.get('TARGET_PHONE')
        
        client = Client(account_sid, auth_token)
        
        message = client.messages.create(
            body=f"ALERTA - FIAP VisionGuard: Objeto cortante ({alert_info['detection_type']}) "
                 f"detectado com confiança de {alert_info['confidence']:.2f}",
            from_=twilio_phone,
            to=target_phone
        )
        """
        
        logger.info("SMS de alerta enviado com sucesso.")
        return True
    
    except Exception as e:
        logger.error(f"Erro ao enviar SMS de alerta: {str(e)}")
        return False

def send_call_alert(alert_info):
    """
    Envia um alerta por ligação telefônica.
    
    Args:
        alert_info (dict): Informações sobre o alerta.
        
    Returns:
        bool: True se a ligação foi realizada com sucesso, False caso contrário.
    """
    try:
        # Configurações de ligação (usando Twilio como exemplo)
        # Para implementação real, seria necessário instalar a biblioteca Twilio
        # e configurar as credenciais
        
        # Simulação de envio para o MVP
        logger.info("Realizando ligação de alerta...")
        logger.info(f"Mensagem de voz: ALERTA - Objeto cortante ({alert_info['detection_type']}) "
                    f"detectado com confiança de {alert_info['confidence']:.2f}")
        
        # Em um ambiente real, seria usado o código abaixo:
        """
        from twilio.rest import Client
        
        account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
        auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
        twilio_phone = os.environ.get('TWILIO_PHONE')
        target_phone = os.environ.get('TARGET_PHONE')
        
        client = Client(account_sid, auth_token)
        
        call = client.calls.create(
            twiml=f'<Response><Say>ALERTA - FIAP VisionGuard: Objeto cortante '
                  f'({alert_info["detection_type"]}) detectado.</Say></Response>',
            from_=twilio_phone,
            to=target_phone
        )
        """
        
        logger.info("Ligação de alerta realizada com sucesso.")
        return True
    
    except Exception as e:
        logger.error(f"Erro ao realizar ligação de alerta: {str(e)}")
        return False
