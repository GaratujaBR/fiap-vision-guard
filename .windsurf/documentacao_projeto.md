# FIAP VisionGuard - Documentação do Projeto

## Visão Geral do Projeto

A FIAP VisionGuard, empresa especializada em monitoramento por câmeras de segurança, está explorando uma nova funcionalidade para otimizar seus serviços. O objetivo deste projeto é desenvolver um MVP (Produto Mínimo Viável) que utilize inteligência artificial para identificar itens cortantes – como facas, tesouras e outros objetos similares – em vídeos gravados. A ideia é facilitar a detecção de situações atípicas que possam ameaçar a segurança de estabelecimentos, permitindo que a central de segurança seja alertada rapidamente.

A motivação para criar este MVP é avaliar a viabilidade dessa abordagem e demonstrar que é possível alcançar uma detecção eficiente, com resposta em poucos segundos. Os principais objetivos incluem utilizar um dataset já existente (com possibilidade de complementação), anotar imagens (incluindo negativos para reduzir falsos positivos), treinar um modelo supervisionado e integrar um sistema simples de alertas (por exemplo, e-mail ou SMS). O sucesso será medido pela capacidade de identificar o máximo de objetos cortantes e enviar alertas de forma rápida e consistente.

## Escopo do Projeto

**O que será incluído:**

* Utilização e, se necessário, complementação do dataset atual com imagens de objetos cortantes em diversas condições (ângulos, iluminações).
* Anotação do dataset, incluindo imagens negativas para reduzir falsas detecções.
* Desenvolvimento e treinamento de um modelo de inteligência artificial supervisionado utilizando ambientes como o Google Colab.
* Processamento de vídeos gravados para extrair frames e realizar a detecção.
* Implementação de um sistema de alertas simples que possa enviar notificações (e-mail, SMS ou ligação) em poucos segundos após a detecção.
* Documentação detalhada do fluxo de desenvolvimento, incluindo um vídeo explicativo de até 15 minutos e disponibilização do código no GitHub.
* Utilização da ferramenta WindSurf para auxiliar na criação e organização do código.

**O que não será incluído nesta fase:**

* Integração com câmeras em tempo real ou desenvolvimento de uma infraestrutura completa para operação contínua.
* Desenvolvimento de uma interface de usuário completa ou dashboard complexo, já que o foco é na detecção e geração de alertas.
* Integrações complexas com servidores SMTP ou sistemas de monitoramento adicionais – a ideia é testar com sistemas simples de alerta.
* Qualquer função ou design que não esteja diretamente ligada à validação da viabilidade do MVP.

## Fluxo do Usuário

O usuário, que atua como testador do MVP, inicia a interação acessando a aplicação de desenvolvimento ou demonstração. A interface é simplificada para permitir que o usuário faça upload de vídeos pré-gravados. Após o envio, o sistema processa o vídeo, extraindo frames relevantes e realizando a análise para identificar objetos cortantes.

Uma vez que o sistema detecta um objeto com potencial de risco, ele dispara imediatamente um alerta através de um mecanismo configurado (e-mail, SMS ou ligação). O usuário pode acompanhar o progresso do processamento e receber confirmações dos alertas gerados, seja por meio de logs simples ou uma visualização básica dentro da aplicação. Essa jornada garante que cada etapa – do upload do vídeo até o recebimento dos alertas – seja clara e intuitiva, facilitando a avaliação do desempenho do MVP.

## Funcionalidades Principais

* **Dataset e Anotação:**
  * Uso do dataset já existente, com possibilidade de complementação com outras fontes de imagens.
  * Anotação das imagens positivas (com objetos cortantes) e negativas (sem itens perigosos) para reduzir falsos positivos.

* **Treinamento do Modelo:**
  * Desenvolvimento de um modelo de inteligência artificial supervisionado utilizando Python e frameworks como TensorFlow.
  * Treinamento realizado em ambientes como o Google Colab para melhor desempenho.

* **Processamento de Vídeo e Detecção:**
  * Extração de frames de vídeos pré-gravados para análise.
  * Implementação de algoritmos de visão computacional utilizando OpenCV para detectar facas, tesouras e objetos similares.

* **Sistema de Alertas:**
  * Envio de alertas automaticamente por e-mail, SMS ou ligação telefônica quando um objeto cortante é identificado.
  * Otimização para um tempo de resposta rápido (alguns segundos).

* **Documentação e Compartilhamento:**
  * Geração de documentação detalhada do fluxo de desenvolvimento e de cada etapa implementada.
  * Criação de um vídeo demonstrativo (até 15 minutos) explicando a solução.
  * Versionamento e disponibilização do código no GitHub.

* **Auxílio com WindSurf:**
  * Utilização do WindSurf como ambiente de desenvolvimento para escrever e organizar o código conforme as especificações do projeto.

## Pilha Tecnológica e Ferramentas

* **Frontend/Interface Simples:**
  * Interface web mínima utilizando Flask (Python) para upload de vídeos e exibição de logs.

* **Backend e Processamento:**
  * Python como linguagem principal.
  * TensorFlow para treinamento do modelo de detecção de imagens.
  * OpenCV para processamento de vídeo e extração de frames via visão computacional.
  * Flask para servir endpoints simples (upload de vídeo, retorno de status).

* **Ambiente de Treinamento:**
  * Google Colab para treinamento e execução dos modelos de inteligência artificial, aproveitando a capacidade computacional da nuvem.

* **Ferramenta de Desenvolvimento:**
  * WindSurf como IDE moderna com integração de IA para ajudar na escrita e organização do código.

* **Integração e Versionamento:**
  * GitHub para versionamento, compartilhamento e documentação do código-fonte.

## Requisitos Não-Funcionais

* **Desempenho:**
  * Tempo de resposta otimizado para que o alerta seja disparado em poucos segundos após a detecção.
  * Processamento eficiente dos vídeos para extração rápida de frames.

* **Segurança:**
  * Acesso restrito ao ambiente de testes, sem necessidade de autenticação robusta, dada a natureza educativa do projeto.
  * Garantir que a comunicação dos alertas (e-mail, SMS, ligação) seja feita de forma segura, mesmo que simples.

* **Usabilidade:**
  * Interface simples e intuitiva para upload e monitoramento dos testes, focada no fluxo básico de validação do MVP.
  * A documentação interna deve ser clara o suficiente para que qualquer desenvolvedor possa reproduzir ou iterar o sistema.

* **Conformidade:**
  * Não existem diretrizes específicas de identidade visual obrigatória, mas o sistema e a documentação devem ter uma aparência elegante e coerente.

## Restrições e Premissas

* O projeto será testado utilizando vídeos pré-gravados, não havendo necessidade de desenvolvimento total para captação em tempo real.
* O dataset inicial já está disponível, mas pode ser complementado com outros para melhorar a diversidade e robustez do treinamento.
* A ferramenta WindSurf será utilizada para desenvolvimento do código, enquanto o Google Colab é considerado o ambiente ideal para treinamento e execução dos modelos.
* Não há exigências específicas relativas à implantação em nuvem ou on-premise, dando flexibilidade ao ambiente de teste.
* O sistema de alerta é simples e não necessita de integrações complexas com outros sistemas corporativos.

## Problemas Conhecidos e Possíveis Dificuldades

* **Qualidade do Dataset:**
  * Há o risco de o dataset não ter variedade suficiente de ângulos e condições de iluminação, o que pode afetar a precisão do modelo.
  * Mitigação: Complementar o dataset com fontes adicionais e garantir a inclusão de imagens negativas.

* **Tempo de Processamento do Vídeo:**
  * O processamento de vídeos pode ser computacionalmente intensivo, principalmente a extração e análise de frames.
  * Mitigação: Otimizar o algoritmo e testar em amostras menores antes da análise completa.

* **Falsos Positivos/Negativos:**
  * Possibilidade do modelo identificar erradamente objetos inócuos ou não detectar objetos perigosos.
  * Mitigação: Ajustar e iterar o treinamento com dados balanceados e realizar testes rigorosos para ajustar os parâmetros do algoritmo.

* **Integração do Sistema de Alertas:**
  * Pode haver desafios na configuração do envio de alertas (e-mail, SMS ou ligação) dependendo do método escolhido para testes.
  * Mitigação: Optar por uma integração simples e bem testada (por exemplo, utilizando APIs de envio de e-mail ou SMS já existentes).

* **Ambiente de Desenvolvimento:**
  * O uso do ambiente Google Colab pode ter limitações de tempo de execução e recursos computacionais para o treinamento intenso.
  * Mitigação: Planejar os experimentos e, se necessário, considerar serviços pagos ou locais para escalabilidade futura.

## Plano de Implementação

### Fase 1: Configuração do Ambiente

1. Criar a estrutura de diretórios do projeto em `/fiap_vision_guard` para abrigar todo o código, documentação e recursos.
2. Inicializar um repositório Git na pasta do projeto e criar os branches `main` e `dev` com regras de proteção no GitHub.
3. Configurar um ambiente virtual Python garantindo que Python 3.9+ esteja instalado.
4. Criar um arquivo `requirements.txt` na raiz do projeto e adicionar as seguintes dependências exatas:
   * TensorFlow (versão estável mais recente compatível com o código)
   * OpenCV
   * Flask
   * Bibliotecas necessárias para API de e-mail/SMS (ex: smtplib ou SDK da Twilio)
5. Criar um notebook do Google Colab chamado `training_model.ipynb` em um diretório `/training` para documentar e executar o pipeline de treinamento do modelo de IA.

### Fase 2: Desenvolvimento do Frontend

1. Criar um diretório `/app` para hospedar o código da interface web Flask.
2. Em `/app`, criar o arquivo principal da aplicação Flask `app.py`.
3. Em `app.py`, implementar a rota raiz (`/`) que retorna uma página HTML renderizada para uploads de vídeo.
4. Criar uma pasta de templates em `/app/templates` e adicionar `upload.html`, contendo um formulário com um input de arquivo para permitir que os usuários façam upload de vídeos pré-gravados.
5. Em `upload.html`, garantir que o formulário aceite apenas formatos de arquivo de vídeo (ex: MP4) e inclua um botão de envio.
6. **Validação**: Executar o servidor Flask localmente (`python app.py`) e abrir `http://localhost:5000` para verificar se a página de upload é exibida corretamente.

### Fase 3: Desenvolvimento do Backend

1. Em `app.py`, adicionar uma nova rota POST `/process` para lidar com uploads de arquivos de vídeo da página de upload.
2. Criar uma função utilitária `extract_frames(video_path)` em um novo arquivo `/app/utils/video_processing.py` que usa OpenCV para extrair frames do arquivo de vídeo enviado.
3. **Validação**: Escrever um teste unitário em `/tests/test_video_processing.py` para executar `extract_frames` em um vídeo de amostra e verificar se os frames são criados.
4. Na rota `/process` (em `app.py`), adicionar lógica para chamar `extract_frames` e depois passar os frames extraídos para a função de inferência do modelo de IA.
5. Criar um novo diretório `/app/model` e nele criar `inference.py` com uma função para carregar o modelo TensorFlow pré-treinado e realizar inferência em imagens.
6. Em `inference.py`, implementar a lógica para analisar cada frame em busca de objetos cortantes (como facas ou tesouras) e retornar resultados de detecção.
7. **Validação**: Testar a função de inferência com uma imagem de amostra para garantir que o modelo detecte objetos cortantes dentro de um tempo de resposta aceitável.
8. Criar um módulo de alertas fazendo um diretório `/app/alerts` e adicionando o arquivo `alert.py` que implementa uma função `send_alert()` para disparar alertas via e-mail (ou SMS/ligação telefônica, conforme desejado).
9. Em `alert.py`, implementar a lógica de alerta usando uma API simples e bem testada (ex: usando smtplib do Python para e-mails ou SDK da Twilio para SMS) garantindo que os alertas sejam enviados em poucos segundos.
10. Modificar a rota `/process` para chamar `send_alert()` quando a função de detecção indicar a presença de um objeto cortante.
11. **Validação**: Testar o endpoint `/process` localmente fazendo upload de um vídeo de amostra que contenha um objeto cortante conhecido e verificar se a função de alerta é acionada (ex: verificando logs do console ou recebendo um e-mail/SMS de teste).

### Fase 4: Integração

1. Integrar o formulário de upload do frontend com o endpoint backend `/process` garantindo que o arquivo de vídeo seja postado corretamente de `upload.html` para `app.py`.
2. Implementar logging em `app.py` escrevendo logs de processo em um arquivo em `/app/logs/process.log` para que os usuários possam revisar as etapas de processamento e status de alertas.
3. **Validação**: Realizar um teste de ponta a ponta fazendo upload de um vídeo da interface web e verificando se a extração de frames, inferência do modelo e envio de alertas ocorrem sequencialmente e com sucesso.
4. Documentar o treinamento do modelo de IA e o pipeline de processamento de vídeo de forma abrangente no arquivo `README.md` na raiz do projeto, incluindo referências ao notebook do Google Colab e detalhes de configuração importantes.

### Fase 5: Implantação

1. Criar um arquivo `Procfile` na raiz do projeto com o conteúdo:
   ```
   web: gunicorn app.app:app
   ```
   Isso prepara o aplicativo para implantação usando Gunicorn.
2. Criar um arquivo de configuração de produção (ex: `/config/production.cfg`) para gerenciar variáveis de ambiente como credenciais de serviço de alerta e caminhos de modelo.
3. **Validação**: Implantar o aplicativo Flask localmente usando Gunicorn (`gunicorn app.app:app`) e executar um teste de ponta a ponta para confirmar que todas as rotas e funcionalidades funcionam conforme o esperado.
4. Finalizar a documentação do projeto, incluindo uma demonstração em vídeo (máximo de 15 minutos) mostrando o processo de upload, detecção de objetos e disparo de alertas, e atualizar o repositório GitHub com instruções abrangentes.

Este documento serve como guia principal para o desenvolvimento do MVP da FIAP VisionGuard, garantindo que todos os aspectos técnicos e funcionais estejam devidamente cobertos para validação da nova funcionalidade de detecção de objetos cortantes.
