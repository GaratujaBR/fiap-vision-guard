# FIAP VisionGuard - Detecção de Objetos Cortantes

## Visão Geral

O FIAP VisionGuard é um sistema de detecção de objetos cortantes (facas, tesouras e similares) em vídeos de câmeras de segurança utilizando inteligência artificial. Este MVP (Produto Mínimo Viável) foi desenvolvido para avaliar a viabilidade de uma nova funcionalidade que permite identificar situações atípicas que possam colocar em risco a segurança de estabelecimentos comerciais.

## Funcionalidades

- Upload de vídeos pré-gravados para análise
- Processamento de vídeo e extração de frames usando OpenCV
- Detecção de objetos cortantes utilizando modelo de IA treinado com TensorFlow
- Sistema de alertas via e-mail, SMS ou ligação telefônica
- Interface web simples para visualização de logs e resultados

## Requisitos

- Python 3.9+
- Dependências listadas em `requirements.txt`

## Instalação

1. Clone o repositório:
```
git clone [URL_DO_REPOSITÓRIO]
```

2. Crie um ambiente virtual Python:
```
python -m venv venv
```

3. Ative o ambiente virtual:
   - Windows:
   ```
   venv\Scripts\activate
   ```
   - Linux/Mac:
   ```
   source venv/bin/activate
   ```

4. Instale as dependências:
```
pip install -r requirements.txt
```

5. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione as configurações necessárias (veja o exemplo em `.env.example`)

## Uso

1. Execute a aplicação Flask:
```
python app/main.py
```

2. Acesse a interface web em `http://localhost:5000`

3. Faça upload de um vídeo para análise

4. Visualize os resultados e alertas gerados

## Estrutura do Projeto

```
fiap_vision_guard/
├── app/                         # Aplicação principal
│   ├── main.py                  # Ponto de entrada da aplicação
│   ├── routes.py                # Definição de rotas e endpoints
│   ├── templates/               # Templates HTML
│   ├── static/                  # Arquivos estáticos
│   │   ├── css/                 # Estilos CSS
│   │   ├── js/                  # Scripts JavaScript
│   │   └── img/                 # Imagens
│   ├── utils/                   # Utilitários
│   │   └── video_processing.py  # Processamento de vídeo
│   ├── model/                   # Módulo de modelo
│   │   └── inference.py         # Inferência do modelo
│   └── alerts/                  # Sistema de alertas
│       └── alert.py             # Lógica de alertas
├── models/                      # Modelos de IA
├── training/                    # Treinamento do modelo
│   └── training_model.ipynb     # Notebook para treinamento
├── tests/                       # Testes
├── config/                      # Configurações
├── requirements.txt             # Dependências do projeto
└── README.md                    # Documentação do projeto
```

## Treinamento do Modelo

O treinamento do modelo de detecção de objetos cortantes é realizado utilizando o Google Colab. O notebook de treinamento está disponível em `training/training_model.ipynb`.

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -am 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Crie um novo Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.
