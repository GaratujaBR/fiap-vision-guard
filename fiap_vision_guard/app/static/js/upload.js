/**
 * FIAP VisionGuard - JavaScript para a página de Upload
 * Este arquivo contém funções específicas para a página de upload de vídeos.
 */

document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('video-file');
    const fileNameDisplay = document.getElementById('file-name');
    const filePreview = document.getElementById('file-preview');
    const uploadForm = document.getElementById('upload-form');
    const progressBar = document.getElementById('upload-progress-bar');
    const progressContainer = document.getElementById('upload-progress-container');
    const uploadButton = document.getElementById('upload-button');
    
    // Configurações
    const maxFileSize = 100 * 1024 * 1024; // 100 MB
    const allowedTypes = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-ms-wmv'];
    const allowedExtensions = ['.mp4', '.avi', '.mov', '.wmv'];
    
    // Eventos para arrastar e soltar
    if (uploadArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            uploadArea.classList.add('dragover');
        }
        
        function unhighlight() {
            uploadArea.classList.remove('dragover');
        }
        
        uploadArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length > 0) {
                fileInput.files = files;
                handleFiles(files);
            }
        }
        
        // Evento para clique na área de upload
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    // Evento para seleção de arquivo via input
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                handleFiles(this.files);
            }
        });
    }
    
    // Função para processar os arquivos selecionados
    function handleFiles(files) {
        const file = files[0]; // Pega apenas o primeiro arquivo
        
        // Verifica o tamanho do arquivo
        if (file.size > maxFileSize) {
            showNotification(`O arquivo é muito grande. O tamanho máximo permitido é ${maxFileSize / (1024 * 1024)} MB.`, 'error');
            fileInput.value = '';
            return;
        }
        
        // Verifica o tipo do arquivo
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
            showNotification(`Tipo de arquivo não permitido. Os tipos permitidos são: ${allowedExtensions.join(', ')}`, 'error');
            fileInput.value = '';
            return;
        }
        
        // Atualiza o nome do arquivo
        if (fileNameDisplay) {
            fileNameDisplay.textContent = file.name;
        }
        
        // Exibe preview do vídeo
        if (filePreview) {
            filePreview.innerHTML = '';
            
            const video = document.createElement('video');
            video.classList.add('img-fluid', 'rounded', 'mt-3');
            video.controls = true;
            video.style.maxHeight = '300px';
            
            const source = document.createElement('source');
            source.src = URL.createObjectURL(file);
            source.type = file.type;
            
            video.appendChild(source);
            filePreview.appendChild(video);
            
            // Adiciona informações do arquivo
            const fileInfo = document.createElement('div');
            fileInfo.classList.add('mt-2', 'text-muted', 'small');
            fileInfo.innerHTML = `
                <strong>Nome:</strong> ${file.name}<br>
                <strong>Tamanho:</strong> ${formatFileSize(file.size)}<br>
                <strong>Tipo:</strong> ${file.type || 'Desconhecido'}
            `;
            filePreview.appendChild(fileInfo);
        }
        
        // Habilita o botão de upload
        if (uploadButton) {
            uploadButton.disabled = false;
        }
    }
    
    // Evento para envio do formulário
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            if (!fileInput.files.length) {
                e.preventDefault();
                showNotification('Por favor, selecione um arquivo para upload.', 'warning');
                return;
            }
            
            // Mostra a barra de progresso
            if (progressContainer) {
                progressContainer.classList.remove('d-none');
            }
            
            // Simula o progresso do upload (em um cenário real, isso seria feito com XMLHttpRequest ou Fetch API)
            if (progressBar) {
                simulateProgress();
            }
        });
    }
    
    // Função para simular o progresso do upload
    function simulateProgress() {
        let progress = 0;
        const interval = setInterval(function() {
            progress += Math.random() * 10;
            if (progress > 100) progress = 100;
            
            progressBar.style.width = progress + '%';
            progressBar.setAttribute('aria-valuenow', progress);
            
            if (progress === 100) {
                clearInterval(interval);
            }
        }, 500);
    }
    
    // Função para validação em tempo real
    function validateFileType(file) {
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        return allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
    }
    
    // Função para validação em tempo real
    function validateFileSize(file) {
        return file.size <= maxFileSize;
    }
});
