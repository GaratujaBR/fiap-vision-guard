/**
 * FIAP VisionGuard - JavaScript para a página de Logs
 * Este arquivo contém funções específicas para a página de logs de detecção.
 */

document.addEventListener('DOMContentLoaded', function() {
    const logCards = document.querySelectorAll('.log-card');
    const filterForm = document.getElementById('filter-form');
    const dateFromInput = document.getElementById('date-from');
    const dateToInput = document.getElementById('date-to');
    const confidenceInput = document.getElementById('confidence-threshold');
    const objectTypeSelect = document.getElementById('object-type');
    const sortSelect = document.getElementById('sort-by');
    const searchInput = document.getElementById('search-logs');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const logCount = document.getElementById('log-count');
    
    // Estado dos filtros
    let filters = {
        dateFrom: '',
        dateTo: '',
        confidence: 0,
        objectType: 'all',
        search: '',
        sortBy: 'date-desc'
    };
    
    // Inicializa os filtros com valores padrão
    initializeFilters();
    
    // Evento para filtrar logs
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateFilters();
            applyFilters();
        });
    }
    
    // Evento para limpar filtros
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            resetFilters();
            applyFilters();
        });
    }
    
    // Evento para busca em tempo real
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filters.search = this.value.toLowerCase();
            applyFilters();
        });
    }
    
    // Evento para ordenação
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            filters.sortBy = this.value;
            applyFilters();
        });
    }
    
    // Inicializa os filtros com valores padrão
    function initializeFilters() {
        // Define valores iniciais para os inputs
        if (dateFromInput) {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            dateFromInput.value = formatDateForInput(oneWeekAgo);
            filters.dateFrom = dateFromInput.value;
        }
        
        if (dateToInput) {
            const today = new Date();
            dateToInput.value = formatDateForInput(today);
            filters.dateTo = dateToInput.value;
        }
        
        if (confidenceInput) {
            confidenceInput.value = 50;
            filters.confidence = 50;
        }
        
        if (objectTypeSelect) {
            objectTypeSelect.value = 'all';
            filters.objectType = 'all';
        }
        
        if (sortSelect) {
            sortSelect.value = 'date-desc';
            filters.sortBy = 'date-desc';
        }
        
        // Aplica os filtros iniciais
        applyFilters();
    }
    
    // Atualiza o estado dos filtros com os valores dos inputs
    function updateFilters() {
        if (dateFromInput) filters.dateFrom = dateFromInput.value;
        if (dateToInput) filters.dateTo = dateToInput.value;
        if (confidenceInput) filters.confidence = parseInt(confidenceInput.value);
        if (objectTypeSelect) filters.objectType = objectTypeSelect.value;
        if (searchInput) filters.search = searchInput.value.toLowerCase();
        if (sortSelect) filters.sortBy = sortSelect.value;
    }
    
    // Reseta os filtros para os valores padrão
    function resetFilters() {
        if (dateFromInput) {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            dateFromInput.value = formatDateForInput(oneWeekAgo);
            filters.dateFrom = dateFromInput.value;
        }
        
        if (dateToInput) {
            const today = new Date();
            dateToInput.value = formatDateForInput(today);
            filters.dateTo = dateToInput.value;
        }
        
        if (confidenceInput) {
            confidenceInput.value = 50;
            filters.confidence = 50;
        }
        
        if (objectTypeSelect) {
            objectTypeSelect.value = 'all';
            filters.objectType = 'all';
        }
        
        if (searchInput) {
            searchInput.value = '';
            filters.search = '';
        }
        
        if (sortSelect) {
            sortSelect.value = 'date-desc';
            filters.sortBy = 'date-desc';
        }
    }
    
    // Aplica os filtros aos logs
    function applyFilters() {
        let visibleCount = 0;
        
        // Converte as datas para objetos Date para comparação
        const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
        const dateTo = filters.dateTo ? new Date(filters.dateTo) : null;
        
        // Filtra os logs
        logCards.forEach(card => {
            const date = new Date(card.getAttribute('data-date'));
            const confidence = parseInt(card.getAttribute('data-confidence'));
            const objectType = card.getAttribute('data-object-type');
            const logText = card.textContent.toLowerCase();
            
            // Aplica os filtros
            let visible = true;
            
            // Filtro de data
            if (dateFrom && date < dateFrom) visible = false;
            if (dateTo) {
                // Ajusta a data final para incluir todo o dia
                const adjustedDateTo = new Date(dateTo);
                adjustedDateTo.setHours(23, 59, 59, 999);
                if (date > adjustedDateTo) visible = false;
            }
            
            // Filtro de confiança
            if (confidence < filters.confidence) visible = false;
            
            // Filtro de tipo de objeto
            if (filters.objectType !== 'all' && objectType !== filters.objectType) visible = false;
            
            // Filtro de busca
            if (filters.search && !logText.includes(filters.search)) visible = false;
            
            // Aplica a visibilidade
            if (visible) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Atualiza o contador de logs visíveis
        if (logCount) {
            logCount.textContent = visibleCount;
        }
        
        // Ordena os logs
        sortLogs();
    }
    
    // Ordena os logs com base no critério selecionado
    function sortLogs() {
        const logContainer = document.querySelector('.log-container');
        if (!logContainer) return;
        
        const visibleCards = Array.from(logCards).filter(card => card.style.display !== 'none');
        
        visibleCards.sort((a, b) => {
            switch (filters.sortBy) {
                case 'date-asc':
                    return new Date(a.getAttribute('data-date')) - new Date(b.getAttribute('data-date'));
                case 'date-desc':
                    return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
                case 'confidence-asc':
                    return parseInt(a.getAttribute('data-confidence')) - parseInt(b.getAttribute('data-confidence'));
                case 'confidence-desc':
                    return parseInt(b.getAttribute('data-confidence')) - parseInt(a.getAttribute('data-confidence'));
                default:
                    return 0;
            }
        });
        
        // Reordena os elementos no DOM
        visibleCards.forEach(card => {
            logContainer.appendChild(card);
        });
    }
    
    // Formata uma data para o formato de input (YYYY-MM-DD)
    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Inicializa os tooltips e popovers
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Inicializa os modais para visualização de detalhes
    initializeDetailModals();
});

// Inicializa os modais para visualização de detalhes
function initializeDetailModals() {
    const detailButtons = document.querySelectorAll('.view-details-btn');
    
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const logId = this.getAttribute('data-log-id');
            showLogDetails(logId);
        });
    });
}

// Função para exibir os detalhes do log em um modal
function showLogDetails(logId) {
    // Em um cenário real, isso buscaria os detalhes do backend
    // Aqui apenas simulamos a abertura de um modal com os detalhes
    
    const logCard = document.querySelector(`.log-card[data-log-id="${logId}"]`);
    if (!logCard) return;
    
    const date = logCard.getAttribute('data-date');
    const confidence = logCard.getAttribute('data-confidence');
    const objectType = logCard.getAttribute('data-object-type');
    const imageUrl = logCard.querySelector('img').src;
    
    // Cria o modal dinamicamente
    const modalId = `logModal${logId}`;
    let modal = document.getElementById(modalId);
    
    if (!modal) {
        const modalHTML = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="${modalId}Label">Detalhes da Detecção #${logId}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <img src="${imageUrl}" class="img-fluid rounded" alt="Detecção ${logId}">
                                </div>
                                <div class="col-md-6">
                                    <h5>Informações da Detecção</h5>
                                    <table class="table">
                                        <tbody>
                                            <tr>
                                                <th scope="row">ID</th>
                                                <td>${logId}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Data/Hora</th>
                                                <td>${new Date(date).toLocaleString()}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Tipo de Objeto</th>
                                                <td>${objectType}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Confiança</th>
                                                <td>${confidence}%</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Vídeo</th>
                                                <td>video_${Math.floor(Math.random() * 1000)}.mp4</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Timestamp</th>
                                                <td>${Math.floor(Math.random() * 5)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Frame</th>
                                                <td>${Math.floor(Math.random() * 1000) + 1}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="mt-4">
                                <h5>Ações Tomadas</h5>
                                <ul class="list-group">
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Alerta enviado por e-mail
                                        <span class="badge bg-success"><i class="fas fa-check"></i></span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Notificação enviada para app
                                        <span class="badge bg-success"><i class="fas fa-check"></i></span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Alerta enviado para segurança
                                        <span class="badge bg-success"><i class="fas fa-check"></i></span>
                                    </li>
                                </ul>
                            </div>
                            <div class="mt-4">
                                <h5>Observações</h5>
                                <div class="form-floating">
                                    <textarea class="form-control" id="observationsTextarea${logId}" style="height: 100px"></textarea>
                                    <label for="observationsTextarea${logId}">Adicionar observação</label>
                                </div>
                                <button class="btn btn-sm btn-primary mt-2">Salvar Observação</button>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                            <button type="button" class="btn btn-primary">
                                <i class="fas fa-download me-1"></i> Exportar Relatório
                            </button>
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
