// --- HORLOGE SYSTÈME ---
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const clockElem = document.getElementById('xp-clock');
    if (clockElem) clockElem.textContent = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

// --- GESTION DU MENU DÉMARRER ---
window.toggleStartMenu = function(event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById('start-menu');
    if (menu) {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }
};

document.addEventListener('click', function(e) {
    const menu = document.getElementById('start-menu');
    if (menu && !menu.contains(e.target) && !e.target.closest('.xp-start-btn')) {
        menu.style.display = 'none';
    }
});

// --- GESTION DES ICÔNES DU BUREAU ---
window.selectIcon = function(event, element) {
    event.stopPropagation();
    document.querySelectorAll('.xp-desktop-icon').forEach(icon => icon.classList.remove('selected'));
    element.classList.add('selected');
};

window.deselectIcons = function(event) {
    document.querySelectorAll('.xp-desktop-icon').forEach(icon => icon.classList.remove('selected'));
};

// --- GESTION DES FENÊTRES ---
let highestZIndex = 100;
const activeApps = {};

window.openApp = function(appId) {
    if (appId === 'browser') return; // Application supprimée
    const win = document.getElementById(`win-${appId}`);
    if (!win) return;

    win.classList.remove('hidden');
    focusWindow(win);

    if (!activeApps[appId]) {
        activeApps[appId] = true;
        addTaskbarItem(appId);
    }
    if (appId === 'computer') updateRealSystemInfo();
    if (appId === 'cmd') setTimeout(() => document.getElementById('cmd-in').focus(), 50);
};

window.closeApp = function(appId) {
    const win = document.getElementById(`win-${appId}`);
    if (win) win.classList.add('hidden');
    delete activeApps[appId];
    removeTaskbarItem(appId);
};

window.minimizeApp = function(appId) {
    const win = document.getElementById(`win-${appId}`);
    if (win) win.classList.add('hidden');
    const taskBtn = document.getElementById(`task-btn-${appId}`);
    if (taskBtn) taskBtn.classList.remove('active');
};

function focusWindow(win) {
    document.querySelectorAll('.xp-window').forEach(w => w.classList.add('inactive'));
    win.classList.remove('inactive');
    highestZIndex++;
    win.style.zIndex = highestZIndex;

    const appId = win.id.replace('win-', '');
    document.querySelectorAll('.xp-taskbar-item').forEach(btn => btn.classList.remove('active'));
    const taskBtn = document.getElementById(`task-btn-${appId}`);
    if (taskBtn) taskBtn.classList.add('active');
}

window.toggleMaximize = function(winId) {
    const win = document.getElementById(winId);
    if (!win) return;

    if (win.dataset.maximized === 'true') {
        win.style.width = win.dataset.oldWidth;
        win.style.height = win.dataset.oldHeight;
        win.style.top = win.dataset.oldTop;
        win.style.left = win.dataset.oldLeft;
        win.dataset.maximized = 'false';
    } else {
        win.dataset.oldWidth = win.style.width || '500px';
        win.dataset.oldHeight = win.style.height || '350px';
        win.dataset.oldTop = win.style.top || '50px';
        win.dataset.oldLeft = win.style.left || '50px';

        win.style.width = '100vw';
        win.style.height = 'calc(100vh - 38px)';
        win.style.top = '0px';
        win.style.left = '0px';
        win.dataset.maximized = 'true';
    }
};

// --- BARRE DES TÂCHES ---
const appTitles = {
    computer: 'Poste de travail',
    notepad: 'Bloc-notes',
    player: 'ClemPlayer',
    minesweeper: 'Démineur XP',
    control: 'Panneau de config.',
    cmd: 'Invite de commandes',
    wiki: 'Wiki',
    mods: 'Modifications'
};

function addTaskbarItem(appId) {
    const container = document.getElementById('taskbar-items');
    if (!container || document.getElementById(`task-btn-${appId}`)) return;

    const btn = document.createElement('button');
    btn.id = `task-btn-${appId}`;
    btn.className = 'xp-taskbar-item active px-3 py-1 flex items-center gap-1.5 truncate cursor-pointer h-7';
    btn.innerHTML = `<span class="truncate">${appTitles[appId] || appId}</span>`;
    
    btn.onclick = () => {
        const win = document.getElementById(`win-${appId}`);
        if (win.classList.contains('hidden') || win.classList.contains('inactive')) {
            win.classList.remove('hidden');
            focusWindow(win);
        } else {
            minimizeApp(appId);
        }
    };

    container.appendChild(btn);
}

function removeTaskbarItem(appId) {
    const btn = document.getElementById(`task-btn-${appId}`);
    if (btn) btn.remove();
}

// --- GLISSER-DÉPOSER (DRAG & DROP) FENÊTRES ---
let currentDragWin = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

window.dragStart = function(e, winId) {
    currentDragWin = document.getElementById(winId);
    focusWindow(currentDragWin);

    const rect = currentDragWin.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;

    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragStop);
};

function dragMove(e) {
    if (!currentDragWin) return;
    currentDragWin.style.left = `${Math.max(0, e.clientX - dragOffsetX)}px`;
    currentDragWin.style.top = `${Math.max(0, e.clientY - dragOffsetY)}px`;
}

function dragStop() {
    currentDragWin = null;
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', dragStop);
}

// --- REDIMENSIONNEMENT DES FENÊTRES ---
let currentResizeWin = null;

window.resizeStart = function(e, winId) {
    e.stopPropagation();
    currentResizeWin = document.getElementById(winId);
    document.addEventListener('mousemove', resizeMove);
    document.addEventListener('mouseup', resizeStop);
};

function resizeMove(e) {
    if (!currentResizeWin) return;
    const rect = currentResizeWin.getBoundingClientRect();
    const width = e.clientX - rect.left;
    const height = e.clientY - rect.top;

    if (width > 250) currentResizeWin.style.width = `${width}px`;
    if (height > 150) currentResizeWin.style.height = `${height}px`;
}

function resizeStop() {
    currentResizeWin = null;
    document.removeEventListener('mousemove', resizeMove);
    document.removeEventListener('mouseup', resizeStop);
}

document.querySelectorAll('.xp-window').forEach(win => {
    win.addEventListener('mousedown', () => focusWindow(win));
});

// --- INFORMATIONS SYSTÈME EN TEMPS RÉEL (POSTE DE TRAVAIL) ---
function updateRealSystemInfo() {
    const infoContainer = document.getElementById('real-system-info');
    if (!infoContainer) return;

    // Détection simplifiée de l'OS et du navigateur sans exposer d'IP ou données privées
    const ua = navigator.userAgent;
    let browserName = "Inconnu";
    if (ua.includes("Firefox")) browserName = "Mozilla Firefox";
    else if (ua.includes("Chrome")) browserName = "Google Chrome / Chromium";
    else if (ua.includes("Safari")) browserName = "Apple Safari";
    else if (ua.includes("Edg")) browserName = "Microsoft Edge";

    let osName = "Inconnu";
    if (navigator.userAgentData && navigator.userAgentData.platform) {
        osName = navigator.userAgentData.platform;
    } else if (navigator.platform) {
        osName = navigator.platform;
    }

    const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} cœurs` : 'Non disponible';
    const ram = navigator.deviceMemory ? `~${navigator.deviceMemory} Go` : 'Non disponible';
    const screenRes = `${window.screen.width} x ${window.screen.height}`;
    const connection = navigator.onLine ? 'Connecté à Internet' : 'Hors ligne';

    infoContainer.innerHTML = `
        <ul class="list-disc pl-4 space-y-1">
            <li><b>Système d'exploitation :</b> ${osName}</li>
            <li><b>Navigateur hôte :</b> ${browserName}</li>
            <li><b>Écran :</b> ${screenRes}</li>
            <li><b>Processeur :</b> ${cores}</li>
            <li><b>Mémoire estimée :</b> ${ram}</li>
            <li><b>Réseau :</b> ${connection}</li>
            <li id="battery-status-li"><b>Batterie :</b> Analyse en cours...</li>
        </ul>
    `;

    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            const batteryLi = document.getElementById('battery-status-li');
            if (batteryLi) {
                const level = Math.round(battery.level * 100);
                const charging = battery.charging ? ' (en charge)' : '';
                batteryLi.innerHTML = `<b>Batterie :</b> ${level}%${charging}`;
            }
        }).catch(() => {
            const batteryLi = document.getElementById('battery-status-li');
            if (batteryLi) batteryLi.style.display = 'none';
        });
    } else {
        const batteryLi = document.getElementById('battery-status-li');
        if (batteryLi) batteryLi.style.display = 'none';
    }
}

// BLOC-NOTES
window.clearNote = function() {
    document.getElementById('notepad-text').value = '';
};

window.downloadNote = function() {
    const text = document.getElementById('notepad-text').value;
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ClemNote.txt';
    a.click();
};

// LECTEUR AUDIO SYNTHÉTIQUE
let audioCtx = null;
let isPlayingSound = false;

window.playRetroSound = function() {
    if (isPlayingSound) return;
    isPlayingSound = true;
    const statusElem = document.getElementById('player-status');
    if (statusElem) statusElem.textContent = 'Lecture en cours...';

    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 1);

    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1);

    setTimeout(() => {
        isPlayingSound = false;
        if (statusElem) statusElem.textContent = 'Arrêté';
    }, 1000);
};

window.stopRetroSound = function() {
    isPlayingSound = false;
    const statusElem = document.getElementById('player-status');
    if (statusElem) statusElem.textContent = 'Arrêté';
};

// --- JEU DÉMINEUR XP ---
const boardSize = 9;
const mineCount = 10;
let grid = [];

window.initMinesweeper = function() {
    const board = document.getElementById('minesweeper-board');
    if (!board) return;
    board.innerHTML = '';
    document.getElementById('mine-count').textContent = '010';
    document.getElementById('smiley-btn').textContent = '🙂';

    grid = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null).map(() => ({
        mine: false,
        revealed: false,
        count: 0
    })));

    let placed = 0;
    while (placed < mineCount) {
        let r = Math.floor(Math.random() * boardSize);
        let c = Math.floor(Math.random() * boardSize);
        if (!grid[r][c].mine) {
            grid[r][c].mine = true;
            placed++;
        }
    }

    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (grid[r][c].mine) continue;
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    let nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize && grid[nr][nc].mine) {
                        count++;
                    }
                }
            }
            grid[r][c].count = count;
        }
    }

    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            const cell = document.createElement('div');
            cell.className = 'minesweeper-cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.onclick = () => revealCell(r, c);
            board.appendChild(cell);
        }
    }
};

function revealCell(r, c) {
    const cellData = grid[r][c];
    if (cellData.revealed) return;

    cellData.revealed = true;
    const cellElem = document.querySelector(`.minesweeper-cell[data-row="${r}"][data-col="${c}"]`);
    if (!cellElem) return;

    cellElem.classList.add('revealed');

    if (cellData.mine) {
        cellElem.textContent = '💣';
        cellElem.style.backgroundColor = 'red';
        document.getElementById('smiley-btn').textContent = '😵';
        alert('BOOM ! Vous avez touché une mine.');
    } else {
        if (cellData.count > 0) {
            cellElem.textContent = cellData.count;
            const colors = ['', 'blue', 'green', 'red', 'darkblue', 'brown', 'teal', 'black', 'gray'];
            cellElem.style.color = colors[cellData.count] || 'black';
        } else {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    let nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize && !grid[nr][nc].revealed) {
                        revealCell(nr, nc);
                    }
                }
            }
        }
    }
}

// ARRÊTER CLEMSITE
window.shutdownXP = function() {
    document.getElementById('start-menu').style.display = 'none';
    
    let shutdownOverlay = document.getElementById('shutdown-overlay');
    if (!shutdownOverlay) {
        shutdownOverlay = document.createElement('div');
        shutdownOverlay.id = 'shutdown-overlay';
        shutdownOverlay.className = 'fixed inset-0 bg-black z-[999999] flex flex-col items-center justify-center text-white transition-opacity duration-700 opacity-0';
        shutdownOverlay.innerHTML = `
            <div class="flex flex-col items-center gap-6 animate-pulse">
                <button onclick="bootXP()" class="w-24 h-24 rounded-full bg-gradient-to-b from-gray-800 to-gray-950 border-4 border-gray-600 hover:border-green-500 hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] flex items-center justify-center transition-all duration-300 group cursor-pointer active:scale-95">
                    <i class="fa-solid fa-power-off text-4xl text-red-500 group-hover:text-green-400 transition-colors"></i>
                </button>
                <span class="text-sm tracking-widest uppercase font-mono text-gray-400">Appuyez pour démarrer ClemSite</span>
            </div>
        `;
        document.body.appendChild(shutdownOverlay);
    }
    
    shutdownOverlay.classList.remove('hidden');
    setTimeout(() => {
        shutdownOverlay.classList.remove('opacity-0');
    }, 50);
};

window.bootXP = function() {
    const shutdownOverlay = document.getElementById('shutdown-overlay');
    if (shutdownOverlay) {
        shutdownOverlay.classList.add('opacity-0');
        setTimeout(() => {
            shutdownOverlay.classList.add('hidden');
        }, 700);
    }
    playRetroSound();
};

// ===== COOKIES & SAUVEGARDE AUTO =====
function setCookie(n, v) { document.cookie = n + '=' + encodeURIComponent(v) + ';max-age=31536000;path=/;SameSite=Lax'; }
function getCookie(n) {
    const m = document.cookie.split('; ').find(r => r.startsWith(n + '='));
    return m ? decodeURIComponent(m.split('=').slice(1).join('=')) : null;
}
function delCookie(n) { document.cookie = n + '=;max-age=0;path=/'; }

let noSave = false;
function saveState() {
    if (noSave) return;
    const wins = {};
    Object.keys(appTitles).forEach(id => {
        const w = document.getElementById('win-' + id);
        if (w) wins[id] = { o: !!activeApps[id], l: w.style.left, t: w.style.top, w: w.style.width, h: w.style.height };
    });
    setCookie('clem_wins', JSON.stringify(wins));
    setCookie('clem_note', document.getElementById('notepad-text').value.slice(0, 800));
}

function restoreState() {
    let wins = null;
    try {
        const bg = getCookie('clem_bg');
        if (bg) document.body.style.background = bg;
        const note = getCookie('clem_note');
        if (note) document.getElementById('notepad-text').value = note;
        const raw = getCookie('clem_wins');
        if (raw) wins = JSON.parse(raw);
    } catch (e) { console.warn('Restauration impossible', e); }

    if (!wins) {
        return;
    }
    Object.entries(wins).forEach(([id, s]) => {
        const w = document.getElementById('win-' + id);
        if (!w) return;
        if (s.l) w.style.left = s.l;
        if (s.t) w.style.top = s.t;
        if (s.w) w.style.width = s.w;
        if (s.h) w.style.height = s.h;
        if (s.o) openApp(id);
    });
}
setInterval(saveState, 2000);
window.addEventListener('beforeunload', saveState);

// ===== PANNEAU DE CONFIGURATION =====
const BGS = [
    ['Bliss', ''], ['Bleu', 'linear-gradient(#1e3c72,#2a5298)'], ['Coucher', 'linear-gradient(#ff7e5f,#feb47b)'],
    ['Nuit', 'linear-gradient(#0f2027,#2c5364)'], ['Forêt', 'linear-gradient(#134e5e,#71b280)'],
    ['Rose', 'linear-gradient(#ee9ca7,#ffdde1)'], ['Noir', '#000'], ['Classique', '#3a6ea5']
];
function initControl() {
    const box = document.getElementById('bg-presets');
    if (!box) return;
    BGS.forEach(([name, css]) => {
        const b = document.createElement('button');
        b.className = 'border border-gray-400 h-12 rounded text-white font-bold hover:scale-105 transition';
        b.style.cssText = 'background:' + (css || 'linear-gradient(#3a6ea5,#68a442)') + ';text-shadow:1px 1px 2px #000';
        b.textContent = name;
        b.onclick = () => applyBg(css);
        box.appendChild(b);
    });
}
window.applyBg = function(css) {
    document.body.style.background = css || '';
    if (css && css.length < 3000) setCookie('clem_bg', css); else delCookie('clem_bg');
};
window.applyBgUrl = function() {
    const u = document.getElementById('bg-url').value.trim();
    if (u) applyBg('url("' + u.replace(/["()\\]/g, '') + '") center/cover no-repeat');
};
window.resetAll = function() {
    if (!confirm('Tout réinitialiser (fond, fenêtres, notes) ?')) return;
    noSave = true;
    ['clem_bg', 'clem_wins', 'clem_note', 'custom_css', 'custom_js', 'mods_active'].forEach(delCookie);
    location.reload();
};

// ===== GESTIONNAIRE DE MODIFICATIONS =====
window.toggleMods = function(active) {
    setCookie('mods_active', active ? 'true' : 'false');
    applyModsState();
};

function applyModsState() {
    const isActive = getCookie('mods_active') === 'true';
    const toggle = document.getElementById('mods-toggle');
    if (toggle) toggle.checked = isActive;

    const customCss = getCookie('custom_css');
    const customStyleTag = document.getElementById('custom-style-tag');
    if (customStyleTag) {
        customStyleTag.innerHTML = (isActive && customCss) ? customCss : '';
    }

    const cssStatus = document.getElementById('css-mod-status');
    if (cssStatus) {
        cssStatus.textContent = customCss 
            ? (isActive ? 'Style personnalisé actif ✔' : 'Style chargé (désactivé)')
            : 'Aucun style personnalisé chargé';
    }

    const jsStatus = document.getElementById('js-mod-status');
    const customJs = getCookie('custom_js');
    if (jsStatus) {
        jsStatus.textContent = customJs 
            ? (isActive ? 'Script personnalisé actif ✔' : 'Script chargé (désactivé)')
            : 'Aucun script personnalisé chargé';
    }
}

function initModsApp() {
    const cssInput = document.getElementById('mod-css-input');
    const jsInput = document.getElementById('mod-js-input');

    if (cssInput) {
        cssInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                setCookie('custom_css', evt.target.result);
                setCookie('mods_active', 'true');
                applyModsState();
                alert('Fichier CSS importé avec succès !');
            };
            reader.readAsText(file);
        });
    }

    if (jsInput) {
        jsInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                const code = evt.target.result;
                setCookie('custom_js', code);
                setCookie('mods_active', 'true');
                applyModsState();
                try {
                    eval(code);
                    alert('Fichier JS importé et exécuté avec succès !');
                } catch (err) {
                    alert('Erreur lors de l\'exécution du script : ' + err.message);
                }
            };
            reader.readAsText(file);
        });
    }

    const customJs = getCookie('custom_js');
    const isActive = getCookie('mods_active') === 'true';
    if (isActive && customJs) {
        try {
            eval(customJs);
        } catch (err) {
            console.error('Erreur du script de modification :', err);
        }
    }
    applyModsState();
}

// ===== INVITE DE COMMANDES =====
const T = {
    cwd: [], hist: [], hi: 0, t0: Date.now(), user: 'Visiteur', host: 'CLEMSITE-PC', vars: { OS: 'ClemOS_2026', PATH: 'C:\\WINDOWS' },
    fs: {
        'Projets_ClemSite': { 'index.html': '<html>ClemSite</html>', 'style.css': 'body { background: #3a6ea5; }', 'notes.txt': 'TODO : ajouter encore plus de nostalgie.' },
        'Windows': { 'system32': {}, 'clem.ini': '[ClemOS]\nversion=2026' },
        'A_Propos_de_Clem.txt': 'Clem est passionné par le Web et l\'UX rétro.\nCe site est un hommage à Windows XP.'
    }
};
const outEl = () => document.getElementById('cmd-out');
function out(s, color) {
    const d = document.createElement('div');
    d.style.whiteSpace = 'pre-wrap';
    d.textContent = s;
    if (color) d.style.color = color;
    if (outEl()) {
        outEl().appendChild(d);
        const box = document.getElementById('cmd-box');
        box.scrollTop = box.scrollHeight;
    }
}
const prompt_ = () => 'C:\\' + T.cwd.join('\\') + '> ';
function setPrompt() { 
    const p = document.getElementById('cmd-prompt');
    if (p) p.textContent = prompt_(); 
}
const nodeAt = p => { let n = T.fs; for (const s of p) { if (!n || typeof n !== 'object') return undefined; n = n[s]; } return n; };
function resolve(arg) {
    let p = /^([\\/]|c:)/i.test(arg) ? [] : [...T.cwd];
    arg.replace(/^c:/i, '').split(/[\\/]/).filter(Boolean).forEach(s => {
        if (s === '..') p.pop();
        else if (s !== '.') {
            const n = nodeAt(p);
            const k = n && typeof n === 'object' ? Object.keys(n).find(x => x.toLowerCase() === s.toLowerCase()) : null;
            p.push(k || s);
        }
    });
    return p;
}
const isDir = n => n && typeof n === 'object';
const C = {};
const cmd = (n, d, f) => { C[n] = { d, f }; };
const alias = (a, n) => { C[a] = { d: C[n].d, f: C[n].f, alias: true }; };
const rnd = a => a[Math.floor(Math.random() * a.length)];

cmd('help', 'Liste les commandes', a => {
    if (a[0] && C[a[0].toLowerCase()]) return out(a[0].toLowerCase() + ' : ' + C[a[0].toLowerCase()].d);
    out('Commandes disponibles :');
    Object.keys(C).filter(k => !C[k].alias).sort().forEach(k => out('  ' + k.padEnd(11) + C[k].d));
});
cmd('cls', "Efface l'écran", () => { if (outEl()) outEl().innerHTML = ''; }); alias('clear', 'cls');
cmd('echo', 'Affiche un texte', (a, raw) => out(raw));
cmd('date', "Affiche la date", () => out(new Date().toLocaleDateString('fr-FR')));
cmd('time', "Affiche l'heure", () => out(new Date().toLocaleTimeString('fr-FR')));
cmd('ver', 'Version du système', () => out('ClemOS [version 5.1.2026]'));
cmd('hostname', "Nom de l'ordinateur", () => out(T.host));
cmd('whoami', "Utilisateur courant", () => out(T.host + '\\' + T.user));
cmd('dir', 'Liste le dossier courant', a => {
    const p = a[0] ? resolve(a[0]) : T.cwd, n = nodeAt(p);
    if (!isDir(n)) return out('Chemin introuvable.');
    out(' Répertoire de C:\\' + p.join('\\') + '\n');
    const ks = Object.keys(n);
    if (!ks.length) out('   (vide)');
    ks.forEach(k => out((isDir(n[k]) ? '   <DIR>      ' : '   ' + String(n[k].length).padStart(7) + ' o  ') + k));
    out('\n   ' + ks.length + ' élément(s)');
}); alias('ls', 'dir');
cmd('cd', 'Change de dossier', a => {
    if (!a[0]) return out('C:\\' + T.cwd.join('\\'));
    const p = resolve(a.join(' '));
    if (isDir(nodeAt(p))) { T.cwd = p; setPrompt(); } else out('Le chemin d\'accès spécifié est introuvable.');
});
cmd('pwd', 'Affiche le dossier courant', () => out('C:\\' + T.cwd.join('\\')));
cmd('mkdir', 'Crée un dossier', a => {
    if (!a[0]) return out('Syntaxe : mkdir <nom>');
    const n = nodeAt(T.cwd); if (n[a[0]] !== undefined) return out('Existe déjà.');
    n[a[0]] = {};
});
cmd('touch', 'Crée un fichier vide', a => {
    if (!a[0]) return out('Syntaxe : touch <nom>');
    const n = nodeAt(T.cwd); if (n[a[0]] === undefined) n[a[0]] = '';
});
cmd('type', "Affiche le contenu d'un fichier", a => {
    const p = resolve(a.join(' ')), n = nodeAt(p);
    if (n === undefined) return out('Fichier introuvable.');
    out(isDir(n) ? 'Accès refusé (dossier).' : n || '(fichier vide)');
}); alias('cat', 'type');
cmd('del', 'Supprime un fichier ou un dossier', a => {
    const p = resolve(a.join(' ')), name = p.pop(), par = nodeAt(p);
    if (!par || par[name] === undefined) return out('Fichier introuvable.');
    delete par[name]; out('Supprimé : ' + name);
}); alias('rm', 'del'); alias('rmdir', 'del');
cmd('tree', "Arborescence du dossier courant", () => {
    const walk = (n, pre) => Object.keys(n).forEach((k, i, arr) => {
        const last = i === arr.length - 1;
        out(pre + (last ? '└── ' : '├── ') + k);
        if (isDir(n[k])) walk(n[k], pre + (last ? '    ' : '│   '));
    });
    out('C:\\' + T.cwd.join('\\')); walk(nodeAt(T.cwd), '');
});
cmd('color', 'Couleurs de la console (ex : color 0a)', a => {
    const H = ['#000', '#0000a8', '#00a800', '#00a8a8', '#a80000', '#a800a8', '#a8a800', '#c0c0c0', '#808080', '#5555ff', '#55ff55', '#55ffff', '#ff5555', '#ff55ff', '#ffff55', '#fff'];
    const m = /^([0-9a-f])([0-9a-f])$/i.exec(a[0] || '');
    if (!m) return out('Syntaxe : color <fond><texte>, en hexadécimal (ex : color 0a)');
    const b = document.getElementById('cmd-box');
    b.style.background = H[parseInt(m[1], 16)]; b.style.color = H[parseInt(m[2], 16)];
});
cmd('title', 'Change le titre de la fenêtre', (a, raw) => { document.getElementById('cmd-title').textContent = raw || 'Invite de commandes'; });
cmd('exit', "Ferme l'invite de commandes", () => closeApp('cmd'));
cmd('ipconfig', 'Configuration réseau (fictive)', () => out('Configuration IP de ClemOS\n\n  Adresse IPv4 . . . : 192.168.1.42\n  Masque . . . . . . : 255.255.255.0\n  Passerelle . . . . : 192.168.1.1'));
cmd('ping', 'Teste un hôte (simulation)', a => {
    const h = a[0] || 'clemsite.fr';
    out('Envoi d\'une requête Ping sur ' + h + ' avec 32 octets de données :');
    for (let i = 0; i < 4; i++) setTimeout(() => out('Réponse de ' + h + ' : octets=32 temps=' + (8 + Math.floor(Math.random() * 40)) + 'ms TTL=117'), 400 * (i + 1));
});
cmd('tasklist', 'Liste les applications ouvertes', () => {
    out('Nom de l\'image         ID');
    const k = Object.keys(activeApps);
    if (!k.length) out('(aucune)');
    k.forEach((id, i) => out(id.padEnd(22) + (1000 + i * 37)));
});
cmd('taskkill', 'Ferme une application (taskkill <nom>)', a => {
    if (!a[0] || !appTitles[a[0]]) return out('Applications : ' + Object.keys(appTitles).join(', '));
    closeApp(a[0]); out('Processus ' + a[0] + ' arrêté.');
});
cmd('systeminfo', 'Informations système', () => out('Nom de l\'hôte : ' + T.host + '\nSystème : ClemOS v2026\nProcesseur : ClemCore i9 Rétro\nMémoire : 512 Mo\nNavigateur : ' + navigator.userAgent.slice(0, 60) + '…'));
cmd('set', 'Affiche/définit des variables (set A=1)', (a, raw) => {
    const m = /^(\w+)=(.*)$/.exec(raw);
    if (m) { T.vars[m[1].toUpperCase()] = m[2]; return; }
    Object.entries(T.vars).forEach(([k, v]) => out(k + '=' + v));
});
cmd('vol', 'Affiche le volume', () => out('Le volume du lecteur C s\'appelle ClemDrive\nNuméro de série : 2026-C1EM'));
cmd('mem', 'Utilisation mémoire', () => out('Mémoire totale : 512 Mo\nUtilisée : ' + (120 + Object.keys(activeApps).length * 30) + ' Mo\nLibre : ' + (392 - Object.keys(activeApps).length * 30) + ' Mo'));
cmd('uptime', 'Temps depuis le démarrage', () => { const s = Math.floor((Date.now() - T.t0) / 1000); out('En marche depuis ' + Math.floor(s / 60) + ' min ' + (s % 60) + ' s'); });
cmd('history', 'Historique des commandes', () => T.hist.forEach((h, i) => out(String(i + 1).padStart(3) + '  ' + h)));
cmd('calc', 'Calculatrice (calc 2+2*3)', (a, raw) => {
    if (!/^[0-9+\-*/().%\s]+$/.test(raw)) return out('Expression invalide.');
    try { out(String(Function('"use strict";return (' + raw + ')')())); } catch (e) { out('Erreur de calcul.'); }
});
cmd('random', 'Nombre aléatoire (random [max])', a => out(String(Math.floor(Math.random() * (parseInt(a[0]) || 100)) + 1)));
cmd('dice', 'Lance un dé', () => out('🎲 ' + (1 + Math.floor(Math.random() * 6))));
cmd('coin', 'Pile ou face', () => out(rnd(['Pile', 'Face'])));
cmd('fortune', 'Citation du jour', () => out(rnd(['Le meilleur navigateur est celui qui ne plante pas.', 'Sauvegardez souvent !', 'Windows XP, c\'était mieux avant.', 'Un clic droit par jour éloigne le bug.', 'Redémarrer règle 90 % des problèmes.'])));
cmd('joke', 'Une blague', () => out(rnd(['Pourquoi les développeurs confondent Halloween et Noël ? Parce que OCT 31 = DEC 25.', 'Il y a 10 types de personnes : celles qui comprennent le binaire et les autres.', 'Mon code marche… je ne sais pas pourquoi. Mon code ne marche pas… je ne sais pas pourquoi.'])));
cmd('cowsay', 'Une vache qui parle', (a, raw) => {
    const t = raw || 'Meuh !';
    out(' ' + '_'.repeat(t.length + 2) + '\n< ' + t + ' >\n ' + '-'.repeat(t.length + 2) + '\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||');
});
cmd('matrix', 'Pluie de caractères', () => {
    let n = 0;
    const iv = setInterval(() => {
        out(Array.from({ length: 50 }, () => String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))).join(''), '#0f0');
        if (++n > 15) clearInterval(iv);
    }, 100);
});
cmd('bg', 'Fond d\'écran (bg reset | #couleur | url)', (a, raw) => {
    if (!raw) return out('Syntaxe : bg reset | bg #ff8800 | bg https://…/image.jpg');
    if (raw === 'reset') return applyBg('');
    if (/^#[0-9a-f]{3,6}$/i.test(raw)) return applyBg(raw);
    if (/^https?:\/\//i.test(raw)) { document.getElementById('bg-url').value = raw; return applyBgUrl(); }
    out('Valeur non reconnue.');
});
cmd('open', 'Ouvre une application (open <nom>)', a => {
    if (!a[0] || !appTitles[a[0]]) return out('Applications : ' + Object.keys(appTitles).join(', '));
    openApp(a[0]);
});
cmd('apps', 'Liste les applications', () => Object.entries(appTitles).forEach(([k, v]) => out(k.padEnd(13) + v)));
cmd('shutdown', 'Éteint ClemSite', () => shutdownXP());
cmd('reboot', 'Recharge la page', () => { noSave = false; saveState(); location.reload(); });
cmd('reset', 'Réinitialise toutes les données', () => resetAll());
cmd('neofetch', 'Infos système en ASCII', () => out('   ____  _       \n  / ___|| | ___  _ __ ___  \n | |    | |/ _ \\| \'_ ` _ \\ \n | |___ | |  __/| | | | | |\n  \\____||_|\\___||_| |_| |_|\n\nOS : ClemOS 2026\nHôte : ' + T.host + '\nShell : clem-cmd\nApps ouvertes : ' + Object.keys(activeApps).length));
cmd('about', 'À propos', () => out('ClemSite - Windows XP Edition\nCréé par Clem. © 2026 ClemSite Inc.'));
cmd('hello', 'Dis bonjour', () => out('Bonjour ' + T.user + ' ! 👋'));
cmd('upper', 'Met en majuscules', (a, raw) => out(raw.toUpperCase()));
cmd('lower', 'Met en minuscules', (a, raw) => out(raw.toLowerCase()));
cmd('reverse', 'Inverse un texte', (a, raw) => out([...raw].reverse().join('')));
cmd('base64', 'Encode en base64', (a, raw) => { try { out(btoa(unescape(encodeURIComponent(raw)))); } catch (e) { out('Erreur.'); } });
cmd('sudo', 'Tentez votre chance', () => out(T.user + ' n\'est pas dans le fichier sudoers. Cet incident sera signalé. 🚨'));
cmd('format', 'Formate le disque (rassurez-vous)', () => out('Formatage de C: …\nBien essayé ! 😄 Rien n\'a été effacé.'));
cmd('hack', 'Piratage de la NASA', () => {
    ['Connexion au serveur…', 'Contournement du pare-feu…', 'Téléchargement des plans secrets…', 'Accès accordé ✔ (c\'est une blague)'].forEach((m, i) => setTimeout(() => out(m, '#0f0'), 500 * i));
});

function runCmd(line) {
    out(prompt_() + line);
    line = line.trim();
    if (!line) return;
    T.hist.push(line); T.hi = T.hist.length;
    const parts = line.split(/\s+/), name = parts[0].toLowerCase(), args = parts.slice(1);
    const raw = line.slice(parts[0].length).trim();
    if (C[name]) { try { C[name].f(args, raw); } catch (e) { out('Erreur : ' + e.message); } }
    else out("'" + parts[0] + "' n'est pas reconnu en tant que commande interne ou externe.");
}
function initCmd() {
    out('ClemOS [version 5.1.2026]\nTapez "help" pour voir les commandes.\n');
    setPrompt();
    const inp = document.getElementById('cmd-in');
    if (inp) {
        inp.addEventListener('keydown', e => {
            if (e.key === 'Enter') { const v = inp.value; inp.value = ''; runCmd(v); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); if (T.hi > 0) inp.value = T.hist[--T.hi]; }
            else if (e.key === 'ArrowDown') { e.preventDefault(); inp.value = T.hi < T.hist.length - 1 ? T.hist[++T.hi] : (T.hi = T.hist.length, ''); }
            else if (e.key === 'Tab') {
                e.preventDefault();
                const m = Object.keys(C).filter(k => k.startsWith(inp.value.toLowerCase()));
                if (m.length === 1) inp.value = m[0];
                else if (m.length > 1) out(m.join('  '));
            }
        });
    }
}

// Lancement du système (PC ou Mobile)
window.bootSystem = function(mode) {
    if (mode === 'mobile') {
        document.body.classList.add('mobile-mode');
    } else {
        document.body.classList.remove('mobile-mode');
    }
    const bootScreen = document.getElementById('boot-screen');
    if (bootScreen) bootScreen.style.display = 'none';
    playRetroSound();
};

// INITIALISATION AU CHARGEMENT
window.onload = function() {
    initMinesweeper();
    initControl();
    initCmd();
    initModsApp();
    restoreState();
};
