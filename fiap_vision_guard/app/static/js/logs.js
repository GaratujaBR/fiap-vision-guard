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
            const dateA = new Date(a.getAttribute('data-date'));
            const dateB = new Date(b.getAttribute('data-date'));
            const confidenceA = parseInt(a.getAttribute('data-confidence'));
            const confidenceB = parseInt(b.getAttribute('data-confidence'));
            
            switch (filters.sortBy) {
                case 'date-desc':
                    return dateB - dateA;
                case 'date-asc':
                    return dateA - dateB;
                case 'confidence-desc':
                    return confidenceB - confidenceA;
                case 'confidence-asc':
                    return confidenceA - confidenceB;
                default:
                    return dateB - dateA;
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
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
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
    
    // Inicializa os modais para visualização de detalhes
    function initializeDetailModals() {
        const detailButtons = document.querySelectorAll('.view-details-btn');
        detailButtons.forEach(button => {
            button.addEventListener('click', function() {
                const logId = this.getAttribute('data-log-id');
                showLogDetails(logId);
            });
        });
        
        // Adiciona evento para fechar o modal de detalhes
        const closeButtons = document.querySelectorAll('.close-details-btn');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = document.getElementById('detailsModal');
                if (modal) {
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    if (modalInstance) modalInstance.hide();
                }
            });
        });
    }
    
    // Função para exibir os detalhes do log em um modal
    function showLogDetails(logId) {
        // Encontra o card do log correspondente
        const logCard = document.querySelector(`.log-card[data-log-id="${logId}"]`);
        if (!logCard) return;
        
        // Obtém os dados do log
        const date = logCard.getAttribute('data-date');
        const confidence = logCard.getAttribute('data-confidence');
        const objectType = logCard.getAttribute('data-object-type');
        const imageUrl = logCard.querySelector('.log-image').src;
        const logTitle = logCard.querySelector('.log-title').textContent;
        const camera = logCard.querySelector('.log-info-value:nth-of-type(3)').textContent;
        const logIdText = logCard.querySelector('.text-muted').textContent;
        
        // Formata a data para exibição
        const formattedDate = new Date(date).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        // Determina a severidade com base na confiança
        let severity = 'Baixo';
        let severityClass = 'text-success';
        
        if (confidence > 90) {
            severity = 'Crítico';
            severityClass = 'text-danger';
        } else if (confidence > 70) {
            severity = 'Médio';
            severityClass = 'text-warning';
        }
        
        // Traduz o tipo de objeto
        let objectTypeText = 'Desconhecido';
        switch (objectType) {
            case 'knife':
                objectTypeText = 'Faca';
                break;
            case 'scissors':
                objectTypeText = 'Tesoura';
                break;
            case 'cutter':
                objectTypeText = 'Estilete';
                break;
            case 'other':
                objectTypeText = 'Outro objeto cortante';
                break;
        }
        
        // Preenche o modal com os dados do log
        const modal = document.getElementById('detailsModal');
        if (modal) {
            modal.querySelector('.modal-title').textContent = logTitle;
            modal.querySelector('#detail-image').src = imageUrl;
            modal.querySelector('#detail-date').textContent = formattedDate;
            modal.querySelector('#detail-confidence').textContent = `${confidence}%`;
            modal.querySelector('#detail-object-type').textContent = objectTypeText;
            modal.querySelector('#detail-camera').textContent = camera;
            modal.querySelector('#detail-severity').textContent = severity;
            modal.querySelector('#detail-severity').className = severityClass;
            modal.querySelector('#detail-id').textContent = logIdText;
            
            // Exibe o modal
            const modalInstance = new bootstrap.Modal(modal);
            modalInstance.show();
        }
    }
    
    // Adiciona funcionalidade de exportação de logs
    const exportButtons = document.querySelectorAll('.export-btn');
    exportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const logId = this.getAttribute('data-log-id');
            prepareExport(logId);
        });
    });
    
    // Função para preparar a exportação de um log
    function prepareExport(logId) {
        const logCard = document.querySelector(`.log-card[data-log-id="${logId}"]`);
        if (!logCard) return;
        
        const date = new Date(logCard.getAttribute('data-date'));
        const formattedDate = date.toLocaleDateString('pt-BR');
        const objectType = logCard.getAttribute('data-object-type');
        
        // Preenche o modal de exportação
        const exportModal = document.getElementById('exportModal');
        if (exportModal) {
            const logIdText = logCard.querySelector('.text-muted').textContent;
            exportModal.querySelector('#export-log-id').textContent = logIdText;
            exportModal.querySelector('#export-date').textContent = formattedDate;
            
            // Traduz o tipo de objeto
            let objectTypeText = 'Desconhecido';
            switch (objectType) {
                case 'knife':
                    objectTypeText = 'Faca';
                    break;
                case 'scissors':
                    objectTypeText = 'Tesoura';
                    break;
                case 'cutter':
                    objectTypeText = 'Estilete';
                    break;
                case 'other':
                    objectTypeText = 'Outro objeto cortante';
                    break;
            }
            
            exportModal.querySelector('#export-type').textContent = objectTypeText;
            
            // Exibe o modal
            const modalInstance = new bootstrap.Modal(exportModal);
            modalInstance.show();
        }
    }
    
    // Função para exportar logs
    const exportForm = document.getElementById('export-form');
    if (exportForm) {
        exportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const format = document.querySelector('input[name="export-format"]:checked').value;
            const includeImage = document.getElementById('include-image').checked;
            
            // Simula o início do download
            const exportModal = document.getElementById('exportModal');
            if (exportModal) {
                const modalInstance = bootstrap.Modal.getInstance(exportModal);
                if (modalInstance) modalInstance.hide();
                
                // Exibe notificação de sucesso
                const alertContainer = document.getElementById('alert-container');
                if (alertContainer) {
                    const alert = document.createElement('div');
                    alert.className = 'alert alert-success alert-dismissible fade show';
                    alert.innerHTML = `
                        <i class="fas fa-check-circle me-2"></i>
                        <strong>Sucesso!</strong> Log exportado com sucesso no formato ${format.toUpperCase()}.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
                    `;
                    
                    alertContainer.appendChild(alert);
                    
                    // Remove a notificação após 5 segundos
                    setTimeout(() => {
                        alert.classList.remove('show');
                        setTimeout(() => alert.remove(), 150);
                    }, 5000);
                }
            }
        });
    }
});
