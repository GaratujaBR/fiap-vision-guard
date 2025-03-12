/**
 * FIAP VisionGuard - JavaScript Principal
 * Este arquivo contém funções JavaScript comuns para toda a aplicação.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa tooltips do Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Inicializa popovers do Bootstrap
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Função para fechar alertas automaticamente após 5 segundos
    const autoCloseAlerts = document.querySelectorAll('.alert-dismissible.auto-close');
    autoCloseAlerts.forEach(function(alert) {
        setTimeout(function() {
            const closeButton = alert.querySelector('.btn-close');
            if (closeButton) {
                closeButton.click();
            }
        }, 5000);
    });

    // Adiciona classe 'active' aos links de navegação baseado na URL atual
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(function(link) {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        }
    });

    // Função para alternar o tema claro/escuro (se implementado)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            // Salva a preferência do usuário
            const isDarkTheme = document.body.classList.contains('dark-theme');
            localStorage.setItem('darkTheme', isDarkTheme);
            
            // Atualiza o ícone
            const themeIcon = this.querySelector('i');
            if (isDarkTheme) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        });
        
        // Verifica a preferência salva
        const savedTheme = localStorage.getItem('darkTheme');
        if (savedTheme === 'true') {
            document.body.classList.add('dark-theme');
            const themeIcon = themeToggle.querySelector('i');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    // Função para confirmar ações destrutivas
    const confirmActions = document.querySelectorAll('[data-confirm]');
    confirmActions.forEach(function(element) {
        element.addEventListener('click', function(e) {
            const message = this.getAttribute('data-confirm') || 'Tem certeza que deseja realizar esta ação?';
            if (!confirm(message)) {
                e.preventDefault();
            }
        });
    });

    // Função para copiar texto para a área de transferência
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(function() {
                    // Feedback visual
                    const originalText = button.innerHTML;
                    button.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                    setTimeout(function() {
                        button.innerHTML = originalText;
                    }, 2000);
                }).catch(function(err) {
                    console.error('Erro ao copiar texto: ', err);
                });
            }
        });
    });

    // Função para validar uploads de arquivo
    const fileInputs = document.querySelectorAll('input[type="file"][data-max-size]');
    fileInputs.forEach(function(input) {
        input.addEventListener('change', function() {
            const maxSize = parseInt(this.getAttribute('data-max-size')) * 1024 * 1024; // Converte MB para bytes
            const allowedTypes = this.getAttribute('data-allowed-types');
            const allowedTypesArray = allowedTypes ? allowedTypes.split(',') : null;
            
            if (this.files.length > 0) {
                const file = this.files[0];
                
                // Verifica o tamanho
                if (file.size > maxSize) {
                    alert(`O arquivo é muito grande. O tamanho máximo permitido é ${maxSize / (1024 * 1024)} MB.`);
                    this.value = ''; // Limpa o input
                    return;
                }
                
                // Verifica o tipo
                if (allowedTypesArray && !allowedTypesArray.some(type => file.type.includes(type))) {
                    alert(`Tipo de arquivo não permitido. Os tipos permitidos são: ${allowedTypes}`);
                    this.value = ''; // Limpa o input
                    return;
                }
            }
        });
    });

    // Função para exibir nome do arquivo selecionado em inputs de arquivo personalizados
    const customFileInputs = document.querySelectorAll('.custom-file-input');
    customFileInputs.forEach(function(input) {
        input.addEventListener('change', function() {
            const fileNameElement = document.querySelector(this.getAttribute('data-file-name'));
            if (fileNameElement) {
                if (this.files.length > 0) {
                    fileNameElement.textContent = this.files[0].name;
                } else {
                    fileNameElement.textContent = 'Nenhum arquivo selecionado';
                }
            }
        });
    });

    // Função para validar formulários
    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
});

/**
 * Formata um tamanho em bytes para uma representação legível
 * @param {number} bytes - Tamanho em bytes
 * @returns {string} - Tamanho formatado
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Formata uma data para o formato brasileiro
 * @param {Date|string} date - Data para formatar
 * @returns {string} - Data formatada
 */
function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Exibe uma notificação na tela
 * @param {string} message - Mensagem da notificação
 * @param {string} type - Tipo da notificação (success, error, warning, info)
 * @param {number} duration - Duração em milissegundos
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Cria o elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="notification-icon fas ${getIconForType(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Adiciona ao container de notificações ou cria um
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
    }
    
    container.appendChild(notification);
    
    // Adiciona evento para fechar
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', function() {
        notification.classList.add('notification-hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Remove automaticamente após a duração especificada
    setTimeout(() => {
        notification.classList.add('notification-hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
    
    // Função auxiliar para obter o ícone com base no tipo
    function getIconForType(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-times-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }
}
