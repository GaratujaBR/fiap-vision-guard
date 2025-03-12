# .windsurfrules

## Project Overview

*   **Type:** windsurf_file
*   **Description:** Quero construir este projeto detalhado nesse documento:

A FIAP VisionGuard, empresa de monitoramento de câmeras de segurança, está analisando a viabilidade de uma nova funcionalidade para otimizar o seu software. O objetivo da empresa é usar de novas tecnologias para identificar situações atípicas e que possam colocar em risco a segurança de estabelecimentos e comércios que utilizam suas câmeras. Um dos principais desafios da empresa é utilizar Inteligência Artificial para identificar objetos cortantes (facas, tesouras e similares) e emitir alertas para a central de segurança. A empresa tem o objetivo de validar a viabilidade dessa feature, e para isso, será necessário fazer um MVP para detecção supervisionada desses objetos.

*   **Primary Goal:** Desenvolver um MVP que utilize inteligência artificial para detecção supervisionada de objetos cortantes em vídeos pré-gravados, treinando o modelo com datasets anotados (positivos e negativos) e disparando alertas rápidos (em poucos segundos) via e-mail, SMS ou ligação.

## Project Structure

### Framework-Specific Routing

*   **Directory Rules:**

    *   Flask 2.2 (Python): Utilizar a estrutura tradicional de uma aplicação Flask com endpoints definidos em `app/routes.py` e templates em `app/templates` para interfaces simples.
    *   Exemplo 1: "Flask Routing" → Definir rotas de API e view no arquivo `app/routes.py`.
    *   Exemplo 2: Organização modular em `app/api` para endpoints REST que possibilitam a integração com sistemas externos.
    *   Exemplo 3: Integração do ambiente de desenvolvimento WindSurf, auxiliando na organização de código e na escrita de scripts de processamento.

### Core Directories

*   **Versioned Structure:**

    *   `app`: Contém o código principal da aplicação Flask, incluindo definição de rotas e lógica de negócio.
    *   `models`: Armazena os scripts para treinamento e execução dos modelos de detecção utilizando TensorFlow, com versões alinhadas ao <tensorflow@2.x>.
    *   `templates`: Guarda os arquivos HTML para a interface de upload e visualização dos logs.
    *   `static`: Reúne ativos como CSS, JavaScript e imagens, assegurando a consistência visual.
    *   `colab`: Diretório destinado aos notebooks do Google Colab para treinamento e execução dos modelos com exemplos práticos.

### Key Files

*   **Stack-Versioned Patterns:**

    *   `app/main.py`: Ponto de entrada da aplicação Flask, responsável por iniciar o servidor e carregar as configurações.
    *   `app/routes.py`: Define as rotas HTTP, mapeando endpoints para upload de vídeos, iniciação do processamento e retorno de logs/alertas.
    *   `models/detection_model.py`: Implementa o modelo de detecção utilizando TensorFlow, incluindo funções de treinamento e inferência.
    *   `colab/training.ipynb`: Notebook para treinamento do modelo, integrado com exemplos práticos e experimentos em Google Colab.

## Tech Stack Rules

*   **Version Enforcement:**

    *   python@3.9+: Assegurar que a aplicação seja executada em ambientes compatíveis com Python 3.9 ou superior.
    *   <tensorflow@2.x>: Utilizar APIs do TensorFlow 2.x para implementar e treinar o modelo de detecção.
    *   <opencv@4.x>: Empregar OpenCV 4.x para processamento de imagem e extração de frames dos vídeos.
    *   flask@2.2: Estruturar a aplicação web usando Flask 2.2, separando rotas e lógica de negócio.
    *   google_colab: Recomendado para treinamento e execução dos modelos devido à capacidade computacional na nuvem.
    *   windsurf: Utilizado como ferramenta de desenvolvimento integrada, auxiliando na organização e escrita do código.

## PRD Compliance

*   **Non-Negotiable:**

    *   "Identificar o máximo de objetos cortantes e enviar alertas de forma rápida e consistente." : Este requisito deve ser integralmente respeitado, garantindo que a detecção de objetos cortantes seja realizada com rapidez (alertas em poucos segundos) e precisão, conforme definido no PRD.

## App Flow Integration

*   **Stack-Aligned Flow:**

    *   Exemplo: "Flask Detection Flow" → A rota `app/routes.py` gerencia o endpoint de upload de vídeo; após o envio, o vídeo é processado em `models/detection_model.py` (extração de frames com OpenCV e inferência via TensorFlow) e, ao detectar um objeto cortante, o sistema dispara um alerta (integrado em `app/routes.py`), garantindo a resposta rápida e alinhando-se com os processos descritos no App Flow Document.
