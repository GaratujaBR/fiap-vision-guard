# FIAP VisionGuard

FIAP VisionGuard é uma aplicação de detecção de objetos cortantes em vídeos de segurança, desenvolvida como parte do Hackathon IAparaDevs.

## Visão Geral

O sistema utiliza inteligência artificial para analisar vídeos de câmeras de segurança e detectar automaticamente a presença de objetos cortantes como facas, tesouras e outros itens potencialmente perigosos. Quando um objeto é detectado, o sistema gera alertas e registra os incidentes para revisão posterior.

## Funcionalidades Principais

- Upload de vídeos para análise
- Processamento de vídeos usando IA para detecção de objetos cortantes
- Visualização em tempo real do progresso de processamento
- Registro detalhado de incidentes detectados
- Interface para visualização e filtragem de logs de detecção

## Tecnologias Utilizadas

- **Backend**: Python, Flask
- **Frontend**: HTML, CSS, JavaScript, Bootstrap, Tailwind CSS
- **IA**: TensorFlow/PyTorch para detecção de objetos
- **Armazenamento**: SQLite para desenvolvimento

## Estrutura do Projeto

```
fiap_vision_guard/
├── app/
│   ├── static/
│   │   ├── css/
│   │   ├── js/
│   │   └── img/
│   ├── templates/
│   ├── uploads/
│   ├── main.py
│   └── routes.py
├── model/
│   └── [arquivos do modelo de IA]
├── tests/
└── requirements.txt
```

## Instalação e Execução

1. Clone o repositório
2. Instale as dependências: `pip install -r requirements.txt`
3. Execute a aplicação: `python -m app.main`
4. Acesse a aplicação em: `http://localhost:5000`

## Contribuidores

- Equipe IAparaDevs

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.
