class ImageUploader {
  constructor() {
    this.dropZone = document.getElementById('dropZone');
    this.fileInput = document.getElementById('fileInput');
    this.imageGrid = document.getElementById('imageGrid');
    this.initEventListeners();
  }

  initEventListeners() {
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      this.dropZone.addEventListener(eventName, this.preventDefaults, false);
      document.body.addEventListener(eventName, this.preventDefaults, false);
    });

    // Highlight drop zone
    ['dragenter', 'dragover'].forEach(eventName => {
      this.dropZone.addEventListener(eventName, this.highlightZone, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      this.dropZone.addEventListener(eventName, this.removeHighlight, false);
    });

    // Handle drops and selections
    this.dropZone.addEventListener('drop', this.handleDrop.bind(this), false);
    this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
  }

  preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  highlightZone() {
    this.classList.add('dragover');
  }

  removeHighlight() {
    this.classList.remove('dragover');
  }

  handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    this.handleFiles(files);
  }

  handleFileSelect(e) {
    const files = e.target.files;
    this.handleFiles(files);
  }

  async handleFiles(files) {
    if (!files.length) return;

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      
      const card = this.createImageCard();
      this.showLoadingState(card);

      try {
        const shareUrl = await this.uploadFile(file);
        this.updateCardWithLink(card, shareUrl);
      } catch (error) {
        this.showErrorState(card, 'Upload failed');
      }
    }
  }

  createImageCard() {
    const card = document.createElement('div');
    card.className = 'image-card loading';
    
    const loader = document.createElement('div');
    loader.className = 'loader';
    
    const status = document.createElement('div');
    status.className = 'upload-status';
    
    card.appendChild(loader);
    card.appendChild(status);
    this.imageGrid.prepend(card);
    
    return card;
  }

  async uploadFile(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Server error');
    }

    const data = await response.json();
    return data.url;
  }

  updateCardWithLink(card, url) {
    card.classList.remove('loading');
    card.innerHTML = `
      <div class="image-preview">
        <img src="${url}" alt="Uploaded image">
      </div>
      <div class="share-section">
        <input type="text" value="${url}" readonly>
        <button class="copy-btn" data-url="${url}">Copy Link</button>
      </div>
    `;

    card.querySelector('.copy-btn').addEventListener('click', (e) => {
      navigator.clipboard.writeText(e.target.dataset.url);
      e.target.textContent = 'Copied!';
      setTimeout(() => e.target.textContent = 'Copy Link', 2000);
    });
  }

  showLoadingState(card) {
    card.querySelector('.upload-status').textContent = 'Uploading...';
  }

  showErrorState(card, message) {
    card.classList.remove('loading');
    card.classList.add('error');
    card.querySelector('.upload-status').textContent = message;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ImageUploader();
});