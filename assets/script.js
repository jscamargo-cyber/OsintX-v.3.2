// Initialize Lucide Icons
lucide.createIcons();

// DOM Elements
const toolsGrid = document.getElementById('toolsGrid');
const sectionTitle = document.getElementById('sectionTitle');
const sectionSubtitle = document.getElementById('sectionSubtitle');
const navBtns = document.querySelectorAll('.nav-btn');
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('closeModal');
const themeToggle = document.getElementById('themeToggle');

// Modal Elements
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalTags = document.getElementById('modalTags');
const modalLink = document.getElementById('modalLink');
const modalScreenshots = document.getElementById('modalScreenshots');

// State
let currentTab = 'my_tools';

// Section Info
// Section Info
const sectionInfo = {
    all_tools: { title: '📚 Repositorio Global', subtitle: 'Acceso completo a todas las herramientas OSINT.' },
    osint_general: { title: 'Fuentes y Recursos Generales', subtitle: 'Frameworks, guías y directorios esenciales.' },
    osint_platforms: { title: 'Herramientas y Plataformas', subtitle: 'Suites complejas y plataformas de análisis.' },
    domains: { title: 'Análisis de Dominio y WHOIS', subtitle: 'Investigación de DNS, IP y registros de dominio.' },
    network: { title: 'Infraestructura y Redes', subtitle: 'Análisis de puertos, BGP y topología de red.' },
    search_deep_web: { title: 'Motores y Deep Web', subtitle: 'Búsqueda avanzada, dorks y deep web.' },
    images_forensics: { title: 'Imágenes y Forense', subtitle: 'Análisis de metadatos, búsqueda inversa y deepfakes.' },
    social_profiles: { title: 'Redes Sociales y Perfiles', subtitle: 'Inteligencia sobre usuarios, correos y teléfonos.' },
    dark_web: { title: 'Web Oscura y Tor', subtitle: 'Investigación en redes anónimas y mercados.' },
    data_viz: { title: 'Datos y Visualización', subtitle: 'Herramientas para graficar y analizar conexiones.' },
    security_malware: { title: 'Seguridad y Malware', subtitle: 'Análisis de vulnerabilidades y amenazas.' },
    open_data: { title: 'Datos Abiertos', subtitle: 'Fuentes gubernamentales y registros públicos.' },
    threat_intel: { title: 'Threat Intelligence', subtitle: 'Inteligencia de amenazas y feeds de seguridad.' },
    collaboration: { title: 'Comunicación y Colaboración', subtitle: 'Herramientas seguras y gestión de conocimiento.' },
    legal: { title: 'Legal e Investigación', subtitle: 'Recursos para periodismo y verificación.' },
    other: { title: 'Otros Recursos', subtitle: 'Herramientas misceláneas y de utilidad.' },
    start_me: { title: 'Colecciones Start.me', subtitle: 'Dashboards curados por la comunidad.' },
    github_tools: { title: 'Herramientas GitHub', subtitle: 'Repositorios y scripts de código abierto.' },
    guide: { title: 'Guía de Uso', subtitle: 'Cómo integrar y utilizar estas herramientas.' }
};

// Category Mapping (Tab ID -> Data Category)
const categoryMap = {
    'all_tools': 'all',
    'osint_general': 'osint_general',
    'osint_platforms': 'osint_platforms',
    'domains': 'domains',
    'network': 'network',
    'search_deep_web': 'search_deep_web',
    'images_forensics': 'images_forensics',
    'social_profiles': 'social_profiles',
    'dark_web': 'dark_web',
    'data_viz': 'data_viz',
    'security_malware': 'security_malware',
    'open_data': 'open_data',
    'threat_intel': 'threat_intel',
    'collaboration': 'collaboration',
    'legal': 'legal',
    'other': 'other',
    'start_me': 'start_me',
    'github_tools': 'github_tools',
    'guide': 'guide'
};

// Theme Logic
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
        document.body.setAttribute('data-theme', 'light');
        themeToggle.innerHTML = '<i data-lucide="moon"></i>';
    } else {
        document.body.removeAttribute('data-theme'); // Default is dark
        themeToggle.innerHTML = '<i data-lucide="sun"></i>';
    }
    lucide.createIcons();
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    if (currentTheme === 'light') {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i data-lucide="sun"></i>';
    } else {
        document.body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i data-lucide="moon"></i>';
    }
    lucide.createIcons();
});

// Counter Logic
function updateCounters() {
    // Count tools per category
    const counts = { 'all': tools.length }; // Initialize with total count
    tools.forEach(tool => {
        counts[tool.category] = (counts[tool.category] || 0) + 1;
    });

    // Update DOM
    for (const [key, value] of Object.entries(categoryMap)) {
        const badge = document.getElementById(`count-${key}`);
        if (badge) {
            badge.textContent = counts[value] || 0;
        }
    }
}

// Tag Color Logic
function getTagClass(tag) {
    const lowerTag = tag.toLowerCase();
    if (['cli', 'terminal', 'bash', 'python'].some(k => lowerTag.includes(k))) return 'tag-cli';
    if (['web', 'browser', 'extension', 'firefox', 'chrome'].some(k => lowerTag.includes(k))) return 'tag-web';
    if (['api', 'json', 'rest'].some(k => lowerTag.includes(k))) return 'tag-api';
    if (['free', 'opensource', 'open source'].some(k => lowerTag.includes(k))) return 'tag-free';
    if (['paid', 'premium', 'commercial'].some(k => lowerTag.includes(k))) return 'tag-premium';
    if (['bot', 'automation', 'scanner'].some(k => lowerTag.includes(k))) return 'tag-auto';
    return ''; // Default
}

// Smart Emojis Logic
function getToolEmoji(tool) {
    const text = (tool.name + ' ' + tool.description + ' ' + (tool.tags || []).join(' ')).toLowerCase();

    if (text.includes('python')) return '🐍';
    if (text.includes('scanner') || text.includes('recon')) return '📡';
    if (text.includes('osint') || text.includes('investigat')) return '🕵️';
    if (text.includes('social') || text.includes('user') || text.includes('people')) return '👥';
    if (text.includes('network') || text.includes('port')) return '🌐';
    if (text.includes('web') || text.includes('http')) return '🌍';
    if (text.includes('wifi') || text.includes('wireless')) return '📶';
    if (text.includes('forensic') || text.includes('analy')) return '🔍';
    if (text.includes('mail') || text.includes('email')) return '📧';
    if (text.includes('phone') || text.includes('number')) return '📱';
    if (text.includes('domain') || text.includes('dns')) return '🏰';
    if (text.includes('cloud') || text.includes('aws')) return '☁️';
    if (text.includes('iot') || text.includes('hardware')) return '🤖';
    if (text.includes('dark') || text.includes('tor') || text.includes('onion')) return '🧅';
    if (text.includes('password') || text.includes('crack')) return '🔑';
    if (text.includes('exploit') || text.includes('vuln')) return '💣';

    return '🛠️'; // Default
}

// Lazy Loading State
let currentToolsList = [];
let renderedCount = 0;
const CHUNK_SIZE = 24;
let observer;

// Initialize Observer
function initObserver() {
    const options = {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
    };

    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                renderNextChunk();
            }
        });
    }, options);
}

function renderNextChunk() {
    if (renderedCount >= currentToolsList.length) return;

    const chunk = currentToolsList.slice(renderedCount, renderedCount + CHUNK_SIZE);

    chunk.forEach(tool => {
        const card = createToolCard(tool);
        toolsGrid.appendChild(card);
    });

    renderedCount += chunk.length;

    // Move sentinel to end
    updateSentinel();
    lucide.createIcons();
}

function updateSentinel() {
    const existingSentinel = document.getElementById('scroll-sentinel');
    if (existingSentinel) existingSentinel.remove();

    if (renderedCount < currentToolsList.length) {
        const sentinel = document.createElement('div');
        sentinel.id = 'scroll-sentinel';
        sentinel.style.height = '20px';
        sentinel.style.width = '100%';
        toolsGrid.appendChild(sentinel);
        observer.observe(sentinel);
    }
}

function createToolCard(tool) {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.onclick = () => openModal(tool);

    // Header
    const header = document.createElement('div');
    header.className = 'card-header';

    const title = document.createElement('h3');
    title.className = 'card-title';
    // Add Smart Emoji
    title.textContent = `${getToolEmoji(tool)} ${tool.name}`;

    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', 'arrow-up-right');
    icon.className = 'card-icon';

    header.appendChild(title);
    header.appendChild(icon);

    // Description
    const desc = document.createElement('p');
    desc.className = 'card-desc';
    desc.textContent = tool.description || tool.desc;

    // Tags
    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'card-tags';

    if (tool.tags && Array.isArray(tool.tags)) {
        tool.tags.forEach(tagText => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            const colorClass = getTagClass(tagText);
            if (colorClass) {
                tag.classList.add(colorClass);
            }
            tag.textContent = tagText;
            tagsContainer.appendChild(tag);
        });
    }

    // Add Category Badge if searching
    if (document.getElementById('searchInput').value.trim() !== '') {
        const catBadge = document.createElement('span');
        catBadge.className = 'tag';
        catBadge.style.background = 'rgba(56, 189, 248, 0.2)';
        catBadge.style.color = '#38bdf8';
        catBadge.textContent = tool.category;
        tagsContainer.appendChild(catBadge);
    }

    card.appendChild(header);
    card.appendChild(desc);
    card.appendChild(tagsContainer);

    return card;
}

// Functions
function renderTools(tabId) {
    currentTab = tabId;

    // Update active button
    navBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        }
    });

    // Update Header
    if (sectionInfo[tabId]) {
        sectionTitle.textContent = sectionInfo[tabId].title;
        sectionSubtitle.textContent = sectionInfo[tabId].subtitle;
    }

    // Clear Grid
    toolsGrid.innerHTML = '';
    renderedCount = 0;

    // Filter tools based on category
    const targetCategory = categoryMap[tabId];

    if (targetCategory === 'all') {
        currentToolsList = tools; // Show all tools
    } else {
        currentToolsList = tools.filter(tool => tool.category === targetCategory);
    }

    if (currentToolsList.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'No hay herramientas en esta categoría aún.';
        emptyMsg.style.color = 'var(--text-muted)';
        toolsGrid.appendChild(emptyMsg);
        return;
    }

    // Render first chunk
    renderNextChunk();
}

function switchTab(tabId) {
    currentTab = tabId;

    // Glitch Animation Trigger
    // const mainContent = document.querySelector('.main-content');  <-- COMENTAR O BORRAR
    // mainContent.classList.remove('glitch-active');                <-- COMENTAR O BORRAR
    // void mainContent.offsetWidth; // Trigger reflow                 <-- COMENTAR O BORRAR
    // mainContent.classList.add('glitch-active');

    // Update UI
    navBtns.forEach(btn => {
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update Header
    if (sectionInfo[tabId]) {
        sectionTitle.textContent = sectionInfo[tabId].title;
        sectionSubtitle.textContent = sectionInfo[tabId].subtitle;
    }

    // Render Tools
    renderTools(tabId);

    // Close mobile sidebar if open
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
    }
}

function openModal(tool) {
    if (!tool) return;

    modalTitle.textContent = tool.name;
    // Security: Use textContent to prevent XSS (Blue Team Fix)
    modalDesc.textContent = tool.description || tool.desc;

    // Update Link
    if (tool.url || tool.link) {
        modalLink.href = tool.url || tool.link;
        modalLink.style.display = 'flex'; // Ensure it's visible
    } else {
        modalLink.href = '#';
        modalLink.style.display = 'none'; // Hide if no link
    }

    // Security: Add noopener noreferrer
    modalLink.rel = "noopener noreferrer";

    modalTags.innerHTML = '';
    if (tool.tags && Array.isArray(tool.tags)) {
        tool.tags.forEach(tagText => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            const colorClass = getTagClass(tagText);
            if (colorClass) {
                tag.classList.add(colorClass);
            }
            tag.textContent = tagText;
            modalTags.appendChild(tag);
        });
    }

    // Screenshots
    modalScreenshots.innerHTML = '';
    if (tool.screenshot) {
        // Handle single screenshot string
        const img = document.createElement('img');
        img.src = tool.screenshot;
        img.className = 'screenshot';
        img.alt = `Screenshot of ${tool.name}`;
        modalScreenshots.appendChild(img);
    } else if (tool.screenshots && Array.isArray(tool.screenshots)) {
        // Handle array of screenshots
        tool.screenshots.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.className = 'screenshot';
            img.alt = `Screenshot of ${tool.name}`;
            modalScreenshots.appendChild(img);
        });
    }

    modalOverlay.classList.add('open');
}

function closeModal() {
    modalOverlay.classList.remove('open');
}

// Search Functionality with Fuse.js
let fuse;

function initSearch() {
    const options = {
        keys: [
            { name: 'name', weight: 0.4 },
            { name: 'description', weight: 0.3 },
            { name: 'tags', weight: 0.3 }
        ],
        threshold: 0.3, // 0.0 = exact match, 1.0 = match anything
        includeScore: true
    };
    fuse = new Fuse(tools, options);
    initObserver(); // Init observer here
}

function filterTools(searchTerm) {
    toolsGrid.innerHTML = '';
    renderedCount = 0;
    const term = searchTerm.toLowerCase().trim();

    if (term === '') {
        const targetCategory = categoryMap[currentTab];
        if (targetCategory === 'all') {
            currentToolsList = tools;
        } else {
            currentToolsList = tools.filter(tool => tool.category === targetCategory);
        }
        sectionTitle.textContent = sectionInfo[currentTab].title;
        sectionSubtitle.textContent = sectionInfo[currentTab].subtitle;
    } else {
        const results = fuse.search(term);
        currentToolsList = results.map(result => result.item);

        sectionTitle.textContent = `Resultados: "${searchTerm}"`;
        sectionSubtitle.textContent = `Encontradas ${currentToolsList.length} herramientas`;
    }

    if (currentToolsList.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'No se encontraron herramientas que coincidan con tu búsqueda.';
        emptyMsg.style.color = 'var(--text-muted)';
        emptyMsg.style.gridColumn = '1 / -1';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.padding = '2rem';
        toolsGrid.appendChild(emptyMsg);
        return;
    }

    renderNextChunk();
    lucide.createIcons();
}

// Event Listeners
searchInput.addEventListener('input', (e) => {
    filterTools(e.target.value);
});

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        searchInput.value = ''; // Clear search on tab switch
        switchTab(btn.dataset.tab);
    });
});

const sidebarOverlay = document.getElementById('sidebarOverlay');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
});

// Close sidebar when clicking overlay
sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
});

// Close sidebar when clicking a nav item (mobile UX)
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        }
    });
});

closeModalBtn.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Initial Render
// --- KILL SCRIPT START ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
            registration.unregister().then(function (boolean) {
                console.log('Service Worker unregistered:', boolean);
            });
        }
    });
    caches.keys().then(function (names) {
        for (let name of names) caches.delete(name);
        console.log('Caches cleared');
    });
}
// --- KILL SCRIPT END ---

// Portfolio Modal Logic
const portfolioOverlay = document.getElementById('portfolioOverlay');
const openPortfolioBtn = document.getElementById('openPortfolioBtn');
const closePortfolioBtn = document.getElementById('closePortfolio');

if (openPortfolioBtn) {
    openPortfolioBtn.addEventListener('click', () => {
        portfolioOverlay.classList.add('open');
    });
}

if (closePortfolioBtn) {
    closePortfolioBtn.addEventListener('click', () => {
        portfolioOverlay.classList.remove('open');
    });
}

// Close portfolio on click outside
if (portfolioOverlay) {
    portfolioOverlay.addEventListener('click', (e) => {
        if (e.target === portfolioOverlay) {
            portfolioOverlay.classList.remove('open');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    // Verificación de seguridad
    if (typeof tools !== 'undefined') {
        initSearch(); // Initialize Fuse.js
        updateCounters();
        renderTools('my_tools');
    } else {
        console.error("CRÍTICO: El archivo data.js no se cargó correctamente o tiene errores de sintaxis.");
        document.getElementById('toolsGrid').innerHTML = '<p style="color:red; text-align:center;">Error: Revisa la consola (F12). Falta una coma en data.js</p>';
    }
});

// Command Palette Logic
const commandPalette = document.getElementById('commandPalette');
const paletteInput = document.getElementById('paletteInput');
const paletteResults = document.getElementById('paletteResults');
let paletteSelectedIndex = 0;
let paletteItems = [];

// System Commands
const systemCommands = [
    { name: 'Cambiar Tema', action: () => themeToggle.click(), icon: 'moon', type: 'System' },
    { name: 'Ir a GitHub', action: () => window.open('https://github.com/jscamargo-cyber', '_blank'), icon: 'github', type: 'Link' },
    { name: 'Descargar CV', action: () => window.open('ruta/a/tu/cv.pdf', '_blank'), icon: 'file-text', type: 'Link' },
    { name: 'Reportar Bug', action: () => window.open('https://github.com/jscamargo-cyber/Framework-OSINT/issues', '_blank'), icon: 'bug', type: 'Link' },
    { name: 'Ver Todas las Herramientas', action: () => { switchTab('all_tools'); closeModal(); }, icon: 'library', type: 'Nav' }
];

// Open/Close Palette
function togglePalette() {
    const isOpen = commandPalette.classList.contains('open');
    if (isOpen) {
        commandPalette.classList.remove('open');
        paletteInput.value = '';
    } else {
        commandPalette.classList.add('open');
        paletteInput.focus();
        renderPaletteResults('');
    }
}

// Render Results
function renderPaletteResults(term) {
    paletteResults.innerHTML = '';
    paletteItems = [];

    // 1. System Commands
    const filteredCommands = systemCommands.filter(cmd =>
        cmd.name.toLowerCase().includes(term.toLowerCase())
    );

    // 2. Tools (Limit to 10 for performance)
    let filteredTools = [];
    if (term.trim() !== '') {
        const fuseResults = fuse.search(term, { limit: 10 });
        filteredTools = fuseResults.map(res => res.item);
    }

    // Combine
    const allResults = [...filteredCommands, ...filteredTools];

    if (allResults.length === 0) {
        paletteResults.innerHTML = '<div style="padding: 1rem; color: var(--text-muted); text-align: center;">No se encontraron resultados</div>';
        return;
    }

    allResults.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = `palette-item ${index === 0 ? 'active' : ''}`;
        div.dataset.index = index;

        // Determine Icon
        let iconName = 'box';
        if (item.icon) iconName = item.icon; // System command
        else iconName = 'tool'; // Tool (default)

        // Determine Action
        div.onclick = () => executePaletteItem(item);

        div.innerHTML = `
            <i data-lucide="${iconName}" class="palette-item-icon"></i>
            <span class="palette-item-text">${item.name}</span>
            <span class="palette-item-type">${item.type || item.category || 'Tool'}</span>
        `;

        paletteResults.appendChild(div);
        paletteItems.push({ element: div, data: item });
    });

    paletteSelectedIndex = 0;
    lucide.createIcons();
}

// Execute Item
function executePaletteItem(item) {
    commandPalette.classList.remove('open');
    if (item.action) {
        item.action(); // System Command
    } else {
        openModal(item); // Tool
    }
}

// Event Listeners
document.addEventListener('keydown', (e) => {
    // Ctrl + K -> Toggle Palette
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        togglePalette();
    }

    // Esc -> Close Palette / Modal
    if (e.key === 'Escape') {
        commandPalette.classList.remove('open');
        closeModal(); // Also close tool modal
    }

    // / -> Focus Main Search (if palette not open)
    if (e.key === '/' && !commandPalette.classList.contains('open')) {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }

    // Palette Navigation
    if (commandPalette.classList.contains('open')) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            paletteSelectedIndex = (paletteSelectedIndex + 1) % paletteItems.length;
            updatePaletteSelection();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            paletteSelectedIndex = (paletteSelectedIndex - 1 + paletteItems.length) % paletteItems.length;
            updatePaletteSelection();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (paletteItems[paletteSelectedIndex]) {
                executePaletteItem(paletteItems[paletteSelectedIndex].data);
            }
        }
    }
});

paletteInput.addEventListener('input', (e) => {
    renderPaletteResults(e.target.value);
});

function updatePaletteSelection() {
    paletteItems.forEach((item, index) => {
        if (index === paletteSelectedIndex) {
            item.element.classList.add('active');
            item.element.scrollIntoView({ block: 'nearest' });
        } else {
            item.element.classList.remove('active');
        }
    });
}

// Close on click outside
commandPalette.addEventListener('click', (e) => {
    if (e.target === commandPalette) {
        togglePalette();
    }
});

