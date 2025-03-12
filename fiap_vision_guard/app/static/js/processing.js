/**
 * FIAP VisionGuard - JavaScript para a página de Processamento
 * Este arquivo contém funções específicas para a página de processamento de vídeos.
 */

document.addEventListener('DOMContentLoaded', function() {
    const progressBar = document.getElementById('processing-progress-bar');
    const statusText = document.getElementById('processing-status');
    const processingSteps = document.querySelectorAll('.step');
    const detectionResults = document.getElementById('detection-results');
    const videoPlayer = document.getElementById('video-player');
    const detectionContainer = document.getElementById('detection-container');
    
    // Configurações
    const totalSteps = processingSteps.length;
    let currentStep = 0;
    let progress = 0;
    
    // Inicia o processamento simulado
    startProcessing();
    
    function startProcessing() {
        // Atualiza o status inicial
        updateStatus('Iniciando processamento do vídeo...');
        
        // Simula o progresso do processamento
        simulateProcessing();
    }
    
    function simulateProcessing() {
        // Simula o progresso de cada etapa
        const stepInterval = setInterval(function() {
            if (currentStep < totalSteps) {
                // Marca a etapa atual como ativa
                processingSteps.forEach((step, index) => {
                    if (index < currentStep) {
                        step.classList.remove('active');
                        step.classList.add('completed');
                    } else if (index === currentStep) {
                        step.classList.add('active');
                        step.classList.remove('completed');
                    } else {
                        step.classList.remove('active');
                        step.classList.remove('completed');
                    }
                });
                
                // Atualiza o status baseado na etapa atual
                updateStatusByStep(currentStep);
                
                // Simula o progresso dentro da etapa atual
                simulateStepProgress(() => {
                    currentStep++;
                    
                    // Atualiza o progresso geral
                    progress = (currentStep / totalSteps) * 100;
                    updateProgressBar(progress);
                });
            } else {
                // Processamento concluído
                clearInterval(stepInterval);
                processingComplete();
            }
        }, 100);
    }
    
    function simulateStepProgress(callback) {
        let stepProgress = 0;
        const stepDuration = getStepDuration(currentStep);
        const stepProgressInterval = 100; // ms
        const stepProgressIncrement = (stepProgressInterval / stepDuration) * 100;
        
        const interval = setInterval(function() {
            stepProgress += stepProgressIncrement;
            
            if (stepProgress >= 100) {
                clearInterval(interval);
                callback();
            }
        }, stepProgressInterval);
    }
    
    function getStepDuration(step) {
        // Duração simulada para cada etapa (em ms)
        const durations = [
            2000,  // Carregando vídeo
            3000,  // Extraindo frames
            5000,  // Pré-processando frames
            8000,  // Detectando objetos
            3000   // Gerando relatório
        ];
        
        return durations[step] || 3000;
    }
    
    function updateStatus(message) {
        if (statusText) {
            statusText.textContent = message;
        }
    }
    
    function updateStatusByStep(step) {
        const messages = [
            'Carregando vídeo...',
            'Extraindo frames do vídeo...',
            'Pré-processando frames para análise...',
            'Detectando objetos cortantes...',
            'Gerando relatório de detecção...'
        ];
        
        updateStatus(messages[step] || 'Processando...');
    }
    
    function updateProgressBar(value) {
        if (progressBar) {
            progressBar.style.width = value + '%';
            progressBar.setAttribute('aria-valuenow', value);
        }
    }
    
    function processingComplete() {
        // Atualiza o status final
        updateStatus('Processamento concluído!');
        updateProgressBar(100);
        
        // Marca todas as etapas como concluídas
        processingSteps.forEach(step => {
            step.classList.remove('active');
            step.classList.add('completed');
        });
        
        // Exibe os resultados da detecção
        setTimeout(showDetectionResults, 1000);
    }
    
    function showDetectionResults() {
        // Simula a detecção de objetos cortantes
        const detections = simulateDetections();
        
        // Exibe os resultados
        if (detectionResults) {
            // Remove o spinner de carregamento
            const loadingSpinner = document.querySelector('.processing-icon');
            if (loadingSpinner) {
                loadingSpinner.remove();
            }
            
            // Exibe o contêiner de detecções
            if (detectionContainer) {
                detectionContainer.classList.remove('d-none');
            }
            
            // Cria o conteúdo dos resultados
            let resultsHTML = '';
            
            if (detections.length > 0) {
                resultsHTML += `
                    <div class="alert alert-warning" role="alert">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        <strong>Atenção!</strong> Foram detectados ${detections.length} objetos cortantes no vídeo.
                    </div>
                    <div class="row">
                `;
                
                detections.forEach((detection, index) => {
                    resultsHTML += `
                        <div class="col-md-4 mb-4">
                            <div class="card h-100">
                                <div class="card-header d-flex justify-content-between align-items-center">
                                    <span>Detecção #${index + 1}</span>
                                    <span class="badge bg-danger">Objeto Cortante</span>
                                </div>
                                <img src="${detection.imageUrl}" class="card-img-top p-2" alt="Detecção ${index + 1}">
                                <div class="card-body">
                                    <h5 class="card-title">${detection.objectType}</h5>
                                    <p class="card-text">
                                        <strong>Confiança:</strong> ${detection.confidence}%<br>
                                        <strong>Timestamp:</strong> ${detection.timestamp}<br>
                                        <strong>Frame:</strong> ${detection.frame}
                                    </p>
                                </div>
                                <div class="card-footer">
                                    <button class="btn btn-sm btn-outline-primary" onclick="showDetectionDetails(${index})">
                                        <i class="fas fa-search-plus me-1"></i> Detalhes
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                resultsHTML += `
                    </div>
                    <div class="mt-4">
                        <h4>Resumo da Análise</h4>
                        <ul class="list-group">
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Total de frames analisados
                                <span class="badge bg-primary rounded-pill">1240</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Objetos cortantes detectados
                                <span class="badge bg-danger rounded-pill">${detections.length}</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Confiança média
                                <span class="badge bg-info rounded-pill">87%</span>
                            </li>
                        </ul>
                    </div>
                    <div class="mt-4 d-flex justify-content-between">
                        <a href="${videoPlayer ? videoPlayer.getAttribute('data-video-url') : '#'}" class="btn btn-primary" download>
                            <i class="fas fa-download me-1"></i> Baixar Vídeo Original
                        </a>
                        <a href="{{ url_for('routes.view_logs') }}" class="btn btn-secondary">
                            <i class="fas fa-list-alt me-1"></i> Ver Todos os Logs
                        </a>
                    </div>
                `;
            } else {
                resultsHTML = `
                    <div class="alert alert-success" role="alert">
                        <i class="fas fa-check-circle me-2"></i>
                        <strong>Tudo certo!</strong> Nenhum objeto cortante foi detectado no vídeo.
                    </div>
                    <div class="text-center my-5">
                        <i class="fas fa-shield-alt text-success" style="font-size: 5rem;"></i>
                        <h3 class="mt-3">Vídeo Seguro</h3>
                        <p class="text-muted">O sistema não identificou nenhum objeto cortante no vídeo analisado.</p>
                    </div>
                    <div class="mt-4">
                        <h4>Resumo da Análise</h4>
                        <ul class="list-group">
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Total de frames analisados
                                <span class="badge bg-primary rounded-pill">1240</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Objetos cortantes detectados
                                <span class="badge bg-success rounded-pill">0</span>
                            </li>
                        </ul>
                    </div>
                    <div class="mt-4 d-flex justify-content-between">
                        <a href="${videoPlayer ? videoPlayer.getAttribute('data-video-url') : '#'}" class="btn btn-primary" download>
                            <i class="fas fa-download me-1"></i> Baixar Vídeo Original
                        </a>
                        <a href="{{ url_for('routes.view_logs') }}" class="btn btn-secondary">
                            <i class="fas fa-list-alt me-1"></i> Ver Todos os Logs
                        </a>
                    </div>
                `;
            }
            
            detectionResults.innerHTML = resultsHTML;
        }
    }
    
    function simulateDetections() {
        // Simula a detecção de objetos cortantes (em um cenário real, isso viria do backend)
        const detectionCount = Math.floor(Math.random() * 5); // 0-4 detecções
        const detections = [];
        
        const objectTypes = ['Faca', 'Tesoura', 'Lâmina', 'Estilete', 'Objeto Cortante'];
        
        for (let i = 0; i < detectionCount; i++) {
            const objectType = objectTypes[Math.floor(Math.random() * objectTypes.length)];
            const confidence = Math.floor(Math.random() * 20) + 80; // 80-99%
            const frame = Math.floor(Math.random() * 1000) + 1;
            const minutes = Math.floor(Math.random() * 5);
            const seconds = Math.floor(Math.random() * 60);
            
            detections.push({
                objectType: objectType,
                confidence: confidence,
                frame: frame,
                timestamp: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
                imageUrl: `/static/images/detections/detection_${i + 1}.jpg` // Imagens de exemplo
            });
        }
        
        return detections;
    }
});

// Função global para exibir detalhes da detecção em um modal
function showDetectionDetails(index) {
    // Em um cenário real, isso buscaria mais detalhes do backend
    // Aqui apenas simulamos a abertura de um modal com os detalhes
    
    // Cria o modal dinamicamente
    const modalId = `detectionModal${index}`;
    let modal = document.getElementById(modalId);
    
    if (!modal) {
        const modalHTML = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="${modalId}Label">Detalhes da Detecção #${index + 1}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <img src="/static/images/detections/detection_${index + 1}.jpg" class="img-fluid rounded" alt="Detecção ${index + 1}">
                                </div>
                                <div class="col-md-6">
                                    <h5>Informações da Detecção</h5>
                                    <table class="table">
                                        <tbody>
                                            <tr>
                                                <th scope="row">Tipo de Objeto</th>
                                                <td>Objeto Cortante</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Confiança</th>
                                                <td>${Math.floor(Math.random() * 20) + 80}%</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Timestamp</th>
                                                <td>${Math.floor(Math.random() * 5)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Frame</th>
                                                <td>${Math.floor(Math.random() * 1000) + 1}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Coordenadas</th>
                                                <td>X: ${Math.floor(Math.random() * 500) + 100}, Y: ${Math.floor(Math.random() * 300) + 100}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Dimensões</th>
                                                <td>W: ${Math.floor(Math.random() * 100) + 50}px, H: ${Math.floor(Math.random() * 100) + 50}px</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="mt-4">
                                <h5>Ações Recomendadas</h5>
                                <div class="alert alert-warning">
                                    <i class="fas fa-exclamation-triangle me-2"></i>
                                    <strong>Atenção!</strong> Foi detectado um objeto cortante neste frame.
                                </div>
                                <p>Recomendações de segurança:</p>
                                <ul>
                                    <li>Verificar a identidade da pessoa portando o objeto</li>
                                    <li>Notificar a equipe de segurança</li>
                                    <li>Monitorar a situação em tempo real</li>
                                </ul>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                            <button type="button" class="btn btn-primary">Baixar Imagem</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Adiciona o modal ao corpo do documento
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById(modalId);
    }
    
    // Abre o modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}
