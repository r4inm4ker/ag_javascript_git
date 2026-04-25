// ── Syntax helpers ──
const S = {
    kw: (t) => `<span style="color:#c084fc">${t}</span>`,
    fn: (t) => `<span style="color:#60a5fa">${t}</span>`,
    str: (t) => `<span style="color:#a5d6a7">${t}</span>`,
    cm: (t) => `<span style="color:#6b7280;font-style:italic">${t}</span>`,
    num: (t) => `<span style="color:#f59e0b">${t}</span>`,
};

// ── Commit data ──
// Each commit has files[]. Each file has: name, status (new/mod/del/ren), lines[] or special state.
const commits = [
    {
        hash: 'a1b2c3d',
        message: 'Initial project setup',
        title: 'Starting Point',
        desc: `Your Maya tools project starts with a single Python file — <code>create_geo.py</code>. This first commit captures the baseline of the project. Every file in the snapshot is brand new.`,
        color: '#10b981',
        files: [
            {
                name: 'create_geo.py', status: 'new', badge: 'new',
                lines: [
                    { num: 1, code: `${S.kw('import')} ${S.fn('maya.cmds')} ${S.kw('as')} cmds`, cls: 'line-add' },
                    { num: 2, code: ``, cls: 'line-add' },
                    { num: 3, code: `${S.kw('def')} ${S.fn('create_cube')}(name):`, cls: 'line-add' },
                    { num: 4, code: `    cube = cmds.polyCube(n=name)`, cls: 'line-add' },
                    { num: 5, code: `    ${S.kw('return')} cube`, cls: 'line-add' },
                ],
            },
        ],
    },
    {
        hash: 'e4f5g6h',
        message: 'Add shader utilities',
        title: 'Adding a New File',
        desc: `A new file <code>shaders.py</code> is created alongside the existing code. The commit touches <strong>two files</strong>: a brand-new shader utility, and a small modification to <code>create_geo.py</code> to import it. Click each file tab to inspect the changes.`,
        color: '#3b82f6',
        files: [
            {
                name: 'create_geo.py', status: 'mod', badge: 'mod',
                lines: [
                    { num: 1, code: `${S.kw('import')} ${S.fn('maya.cmds')} ${S.kw('as')} cmds` },
                    { num: 2, code: `${S.kw('from')} ${S.fn('shaders')} ${S.kw('import')} apply_lambert`, cls: 'line-add' },
                    { num: 3, code: `` },
                    { num: 4, code: `${S.kw('def')} ${S.fn('create_cube')}(name):` },
                    { num: 5, code: `    cube = cmds.polyCube(n=name)` },
                    { num: 6, code: `    ${S.kw('return')} cube` },
                ],
            },
            {
                name: 'shaders.py', status: 'new', badge: 'new',
                lines: [
                    { num: 1, code: `${S.kw('import')} ${S.fn('maya.cmds')} ${S.kw('as')} cmds`, cls: 'line-add' },
                    { num: 2, code: ``, cls: 'line-add' },
                    { num: 3, code: `${S.kw('def')} ${S.fn('apply_lambert')}(obj, color):`, cls: 'line-add' },
                    { num: 4, code: `    ${S.cm('"""Assign a Lambert shader with the given RGB color."""')}`, cls: 'line-add' },
                    { num: 5, code: `    shd = cmds.shadingNode(${S.str("'lambert'")}, asShader=${S.kw('True')})`, cls: 'line-add' },
                    { num: 6, code: `    cmds.setAttr(shd + ${S.str("'.color'")}, *color)`, cls: 'line-add' },
                    { num: 7, code: `    cmds.select(obj)`, cls: 'line-add' },
                    { num: 8, code: `    cmds.hyperShade(assign=shd)`, cls: 'line-add' },
                    { num: 9, code: `    ${S.kw('return')} shd`, cls: 'line-add' },
                ],
            },
        ],
    },
    {
        hash: 'j7k8l9m',
        message: 'Add transform utils, update geo',
        title: 'Two Files Changed',
        desc: `This commit creates a new <code>transforms.py</code> utility and modifies <code>create_geo.py</code> to use it. Notice that <code>shaders.py</code> is not listed — Git only tracks <strong>files that actually changed</strong>.`,
        color: '#f59e0b',
        files: [
            {
                name: 'create_geo.py', status: 'mod', badge: 'mod',
                lines: [
                    { num: 1, code: `${S.kw('import')} ${S.fn('maya.cmds')} ${S.kw('as')} cmds` },
                    { num: 2, code: `${S.kw('from')} ${S.fn('shaders')} ${S.kw('import')} apply_lambert` },
                    { num: 3, code: `${S.kw('from')} ${S.fn('transforms')} ${S.kw('import')} move_up, scale_uniform`, cls: 'line-add' },
                    { num: 4, code: `` },
                    { num: 5, code: `${S.kw('def')} ${S.fn('create_cube')}(name):` },
                    { num: 6, code: `    cube = cmds.polyCube(n=name)` },
                    { num: 7, code: `    ${S.kw('return')} cube` },
                    { num: 8, code: `` },
                    { num: 9, code: `${S.kw('def')} ${S.fn('build_hero')}():`, cls: 'line-add' },
                    { num: 10, code: `    cube = create_cube(${S.str("'hero'")})`, cls: 'line-add' },
                    { num: 11, code: `    move_up(cube[${S.num('0')}])`, cls: 'line-add' },
                    { num: 12, code: `    scale_uniform(cube[${S.num('0')}], ${S.num('2')})`, cls: 'line-add' },
                    { num: 13, code: `    apply_lambert(cube[${S.num('0')}], (${S.num('1')}, ${S.num('0')}, ${S.num('0')}))`, cls: 'line-add' },
                ],
            },
            {
                name: 'shaders.py', status: null, badge: null,
                lines: [
                    { num: 1, code: `${S.kw('import')} ${S.fn('maya.cmds')} ${S.kw('as')} cmds` },
                    { num: 2, code: `` },
                    { num: 3, code: `${S.kw('def')} ${S.fn('apply_lambert')}(obj, color):` },
                    { num: 4, code: `    ${S.cm('"""Assign a Lambert shader with the given RGB color."""')}` },
                    { num: 5, code: `    shd = cmds.shadingNode(${S.str("'lambert'")}, asShader=${S.kw('True')})` },
                    { num: 6, code: `    cmds.setAttr(shd + ${S.str("'.color'")}, *color)` },
                    { num: 7, code: `    cmds.select(obj)` },
                    { num: 8, code: `    cmds.hyperShade(assign=shd)` },
                    { num: 9, code: `    ${S.kw('return')} shd` },
                ],
            },
            {
                name: 'transforms.py', status: 'new', badge: 'new',
                lines: [
                    { num: 1, code: `${S.kw('import')} ${S.fn('maya.cmds')} ${S.kw('as')} cmds`, cls: 'line-add' },
                    { num: 2, code: ``, cls: 'line-add' },
                    { num: 3, code: `${S.kw('def')} ${S.fn('move_up')}(obj, height=${S.num('5')}):`, cls: 'line-add' },
                    { num: 4, code: `    cmds.move(${S.num('0')}, height, ${S.num('0')}, obj)`, cls: 'line-add' },
                    { num: 5, code: ``, cls: 'line-add' },
                    { num: 6, code: `${S.kw('def')} ${S.fn('scale_uniform')}(obj, factor):`, cls: 'line-add' },
                    { num: 7, code: `    cmds.scale(factor, factor, factor, obj)`, cls: 'line-add' },
                ],
            },
        ],
    },
    {
        hash: 'p4q5r6s',
        message: 'Remove shaders, inline into geo',
        title: 'Deleting a File',
        desc: `The team decides to inline the shader logic directly into <code>create_geo.py</code> instead of keeping a separate file. This commit <span style="color:#ef4444">deletes</span> <code>shaders.py</code> entirely and modifies <code>create_geo.py</code> to contain the shader code. Files can be removed from the project — but Git still remembers them in older commits.`,
        color: '#ef4444',
        files: [
            {
                name: 'create_geo.py', status: 'mod', badge: 'mod',
                lines: [
                    { num: 1, code: `${S.kw('import')} ${S.fn('maya.cmds')} ${S.kw('as')} cmds` },
                    { num: 2, code: `${S.kw('from')} ${S.fn('transforms')} ${S.kw('import')} move_up, scale_uniform`, cls: 'line-mod' },
                    { num: 3, code: `` },
                    { num: 4, code: `${S.kw('def')} ${S.fn('create_cube')}(name):` },
                    { num: 5, code: `    cube = cmds.polyCube(n=name)` },
                    { num: 6, code: `    ${S.kw('return')} cube` },
                    { num: 7, code: `` },
                    { num: 8, code: `${S.kw('def')} ${S.fn('apply_shader')}(obj, color):`, cls: 'line-add' },
                    { num: 9, code: `    shd = cmds.shadingNode(${S.str("'lambert'")}, asShader=${S.kw('True')})`, cls: 'line-add' },
                    { num: 10, code: `    cmds.setAttr(shd + ${S.str("'.color'")}, *color)`, cls: 'line-add' },
                    { num: 11, code: `    cmds.select(obj)`, cls: 'line-add' },
                    { num: 12, code: `    cmds.hyperShade(assign=shd)`, cls: 'line-add' },
                    { num: 13, code: `` },
                    { num: 14, code: `${S.kw('def')} ${S.fn('build_hero')}():` },
                    { num: 15, code: `    cube = create_cube(${S.str("'hero'")})` },
                    { num: 16, code: `    move_up(cube[${S.num('0')}])` },
                    { num: 17, code: `    scale_uniform(cube[${S.num('0')}], ${S.num('2')})` },
                    { num: 18, code: `    apply_shader(cube[${S.num('0')}], (${S.num('1')}, ${S.num('0')}, ${S.num('0')}))`, cls: 'line-mod' },
                ],
            },
            {
                name: 'shaders.py', status: 'del', badge: 'del',
                lines: null, // deleted
            },
            {
                name: 'transforms.py', status: null, badge: null,
                lines: [
                    { num: 1, code: `${S.kw('import')} ${S.fn('maya.cmds')} ${S.kw('as')} cmds` },
                    { num: 2, code: `` },
                    { num: 3, code: `${S.kw('def')} ${S.fn('move_up')}(obj, height=${S.num('5')}):` },
                    { num: 4, code: `    cmds.move(${S.num('0')}, height, ${S.num('0')}, obj)` },
                    { num: 5, code: `` },
                    { num: 6, code: `${S.kw('def')} ${S.fn('scale_uniform')}(obj, factor):` },
                    { num: 7, code: `    cmds.scale(factor, factor, factor, obj)` },
                ],
            },
        ],
    },
];

// ── DOM ──
const codeContent = document.getElementById('code-content');
const fileTree = document.getElementById('file-tree');
const activeFileName = document.getElementById('active-file-name');
const fileStatus = document.getElementById('file-status');
const commitBody = document.getElementById('commit-body');
const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');

let currentCommit = 0;
let currentFile = 0;

// ── Build commit cards ──
function buildCommitCards() {
    commitBody.innerHTML = '';
    commits.forEach((c, i) => {
        const card = document.createElement('div');
        card.className = 'cm-card' + (i === currentCommit ? ' active' : '');
        card.dataset.index = i;

        const filesHtml = c.files.filter(f => f.status).map(f => {
            let dotColor = '#475569';
            let label = f.name;
            if (f.status === 'new') dotColor = '#10b981';
            else if (f.status === 'mod') dotColor = '#f59e0b';
            else if (f.status === 'del') dotColor = '#ef4444';
            return `<div class="cm-file-row"><div class="cm-file-dot" style="background:${dotColor}"></div>${label}</div>`;
        }).join('');

        card.innerHTML = `
            <div class="cm-hash">${c.hash}</div>
            <div class="cm-msg">${c.message}</div>
            <div class="cm-files">${filesHtml}</div>
        `;

        card.addEventListener('click', () => goToCommit(i));
        commitBody.appendChild(card);
    });
}

// ── Render file tabs ──
function renderFileTabs(commitIndex, activeFileIndex) {
    const c = commits[commitIndex];
    fileTree.innerHTML = '';
    c.files.forEach((f, i) => {
        if (f.status === 'del') return; // deleted files don't appear in file tabs
        const tab = document.createElement('div');
        tab.className = 'file-tab' + (i === activeFileIndex ? ' active' : '');

        let badgeHtml = '';
        if (f.badge) {
            badgeHtml = `<span class="ft-badge ${f.badge}">${f.badge}</span>`;
        }

        tab.innerHTML = `${f.name} ${badgeHtml}`;
        tab.addEventListener('click', () => {
            currentFile = i;
            renderFileTabs(currentCommit, i);
            renderFileCode(currentCommit, i);
        });
        fileTree.appendChild(tab);
    });
}

// ── Render code for selected file ──
function renderFileCode(commitIndex, fileIndex) {
    const f = commits[commitIndex].files[fileIndex];
    activeFileName.textContent = f.name;

    if (f.status === 'del') {
        codeContent.innerHTML = `
            <div class="deleted-overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
                <strong>File deleted in this commit</strong>
                <p>${f.name} was removed from the project.<br>Git still remembers it in previous commits.</p>
            </div>
        `;
        return;
    }

    if (!f.lines) {
        codeContent.innerHTML = `<div class="new-overlay"><p>No content</p></div>`;
        return;
    }

    codeContent.innerHTML = f.lines.map(l => {
        const cls = l.cls ? ` ${l.cls}` : '';
        return `<div class="code-line${cls}"><span class="line-num">${l.num}</span><span class="code-content">${l.code}</span></div>`;
    }).join('');
}

// ── Navigate to commit ──
function goToCommit(index) {
    currentCommit = index;
    currentFile = 0;
    const c = commits[index];

    stepNumber.textContent = index + 1;
    stepNumber.style.background = c.color;
    stepNumber.style.boxShadow = `0 0 20px ${c.color}66`;
    stepTitle.textContent = c.title;
    stepDescription.innerHTML = c.desc;
    fileStatus.textContent = `Commit ${index + 1} of ${commits.length}`;

    btnPrev.classList.toggle('hidden', index === 0);
    btnNext.textContent = index === commits.length - 1 ? 'Restart' : 'Next Commit →';

    renderFileTabs(index, 0);
    renderFileCode(index, 0);

    document.querySelectorAll('.cm-card').forEach((el, i) => {
        el.classList.toggle('active', i === index);
    });
}

// ── Events ──
btnNext.addEventListener('click', () => {
    if (currentCommit === commits.length - 1) goToCommit(0);
    else goToCommit(currentCommit + 1);
});

btnPrev.addEventListener('click', () => {
    if (currentCommit > 0) goToCommit(currentCommit - 1);
});

// ── Init ──
buildCommitCards();
goToCommit(0);
