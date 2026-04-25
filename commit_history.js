// ── Commit History Data ──
// Each commit stores: the full file lines, which lines are highlighted (add/del/mod),
// commit metadata, and the explanation text.

const SYN = {
    kw: (t) => `<span style="color:#c084fc">${t}</span>`,
    fn: (t) => `<span style="color:#60a5fa">${t}</span>`,
    str: (t) => `<span style="color:#a5d6a7">${t}</span>`,
    cm: (t) => `<span style="color:#6b7280; font-style:italic">${t}</span>`,
    num: (t) => `<span style="color:#f59e0b">${t}</span>`,
};

const commits = [
    {
        hash: 'a1b2c3d',
        message: 'Initial commit',
        title: 'Initial Commit',
        desc: `The project begins with a simple Python script that imports <code>maya.cmds</code> and creates a basic cube. This is the starting point — the very first snapshot saved in Git.`,
        color: '#60a5fa',
        lines: [
            { num: 1, code: `${SYN.kw('import')} ${SYN.fn('maya.cmds')} ${SYN.kw('as')} cmds` },
            { num: 2, code: `` },
            { num: 3, code: `${SYN.kw('def')} ${SYN.fn('create_cube')}(name):` },
            { num: 4, code: `    cube = cmds.polyCube(n=name)` },
            { num: 5, code: `    ${SYN.kw('return')} cube` },
        ],
        diff: [],
        stats: { add: 5, del: 0, mod: 0 },
    },
    {
        hash: 'e4f5g6h',
        message: 'Add translate function',
        title: 'Adding a Function',
        desc: `A teammate adds a new <code>translate_up()</code> function below the existing code. Git records <strong>only the lines that changed</strong> — the 4 new lines are marked as <span style="color:#10b981">additions</span>. The original 5 lines are untouched.`,
        color: '#10b981',
        lines: [
            { num: 1, code: `${SYN.kw('import')} ${SYN.fn('maya.cmds')} ${SYN.kw('as')} cmds` },
            { num: 2, code: `` },
            { num: 3, code: `${SYN.kw('def')} ${SYN.fn('create_cube')}(name):` },
            { num: 4, code: `    cube = cmds.polyCube(n=name)` },
            { num: 5, code: `    ${SYN.kw('return')} cube` },
            { num: 6, code: `` },
            { num: 7, code: `${SYN.kw('def')} ${SYN.fn('translate_up')}(obj, height=${SYN.num('5')}):`, cls: 'line-add' },
            { num: 8, code: `    ${SYN.cm('"""Move an object upward."""')}`, cls: 'line-add' },
            { num: 9, code: `    cmds.move(${SYN.num('0')}, height, ${SYN.num('0')}, obj)`, cls: 'line-add' },
            { num: 10, code: `    ${SYN.kw('return')} obj`, cls: 'line-add' },
        ],
        diff: [7, 8, 9, 10],
        stats: { add: 4, del: 0, mod: 0 },
    },
    {
        hash: 'j7k8l9m',
        message: 'Rename and add shader',
        title: 'Renaming & New Code',
        desc: `The function <code>create_cube</code> is renamed to <code>create_geo</code> — Git sees this as a <span style="color:#f59e0b">modification</span> of line 3. A whole new <code>apply_shader()</code> function is added at the bottom as <span style="color:#10b981">additions</span>.`,
        color: '#f59e0b',
        lines: [
            { num: 1, code: `${SYN.kw('import')} ${SYN.fn('maya.cmds')} ${SYN.kw('as')} cmds` },
            { num: 2, code: `` },
            { num: 3, code: `${SYN.kw('def')} ${SYN.fn('create_geo')}(name):`, cls: 'line-mod' },
            { num: 4, code: `    cube = cmds.polyCube(n=name)` },
            { num: 5, code: `    ${SYN.kw('return')} cube` },
            { num: 6, code: `` },
            { num: 7, code: `${SYN.kw('def')} ${SYN.fn('translate_up')}(obj, height=${SYN.num('5')}):` },
            { num: 8, code: `    ${SYN.cm('"""Move an object upward."""')}` },
            { num: 9, code: `    cmds.move(${SYN.num('0')}, height, ${SYN.num('0')}, obj)` },
            { num: 10, code: `    ${SYN.kw('return')} obj` },
            { num: 11, code: `` },
            { num: 12, code: `${SYN.kw('def')} ${SYN.fn('apply_shader')}(obj, color):`, cls: 'line-add' },
            { num: 13, code: `    shader = cmds.shadingNode(${SYN.str("'lambert'")}, asShader=${SYN.kw('True')})`, cls: 'line-add' },
            { num: 14, code: `    cmds.setAttr(shader + ${SYN.str("'.color'")}, *color)`, cls: 'line-add' },
            { num: 15, code: `    cmds.select(obj)`, cls: 'line-add' },
            { num: 16, code: `    cmds.hyperShade(assign=shader)`, cls: 'line-add' },
        ],
        diff: [3, 12, 13, 14, 15, 16],
        stats: { add: 5, del: 0, mod: 1 },
    },
    {
        hash: 'p4q5r6s',
        message: 'Remove old move, add scale',
        title: 'Deleting & Replacing',
        desc: `The <code>translate_up</code> function is <span style="color:#ef4444">deleted</span> entirely (lines 7-10 removed). A new <code>scale_obj()</code> function replaces it. Git tracks both deletions and additions — nothing is ever truly lost in the history.`,
        color: '#ef4444',
        lines: [
            { num: 1, code: `${SYN.kw('import')} ${SYN.fn('maya.cmds')} ${SYN.kw('as')} cmds` },
            { num: 2, code: `` },
            { num: 3, code: `${SYN.kw('def')} ${SYN.fn('create_geo')}(name):` },
            { num: 4, code: `    cube = cmds.polyCube(n=name)` },
            { num: 5, code: `    ${SYN.kw('return')} cube` },
            { num: 6, code: `` },
            { num: 7, code: `${SYN.kw('def')} ${SYN.fn('scale_obj')}(obj, factor=${SYN.num('2')}):`, cls: 'line-add' },
            { num: 8, code: `    ${SYN.cm('"""Uniformly scale an object."""')}`, cls: 'line-add' },
            { num: 9, code: `    cmds.scale(factor, factor, factor, obj)`, cls: 'line-add' },
            { num: 10, code: `    ${SYN.kw('return')} obj`, cls: 'line-add' },
            { num: 11, code: `` },
            { num: 12, code: `${SYN.kw('def')} ${SYN.fn('apply_shader')}(obj, color):` },
            { num: 13, code: `    shader = cmds.shadingNode(${SYN.str("'lambert'")}, asShader=${SYN.kw('True')})` },
            { num: 14, code: `    cmds.setAttr(shader + ${SYN.str("'.color'")}, *color)` },
            { num: 15, code: `    cmds.select(obj)` },
            { num: 16, code: `    cmds.hyperShade(assign=shader)` },
        ],
        diff: [7, 8, 9, 10],
        stats: { add: 4, del: 4, mod: 0 },
    },
    {
        hash: 'k8l9m0n',
        message: 'Add main entry point',
        title: 'Tying It All Together',
        desc: `A <code>main()</code> function is added that wires everything together — creating a cube, scaling it, and applying a red shader. This is typical of how a project grows commit by commit, each snapshot building on the last.`,
        color: '#a855f7',
        lines: [
            { num: 1, code: `${SYN.kw('import')} ${SYN.fn('maya.cmds')} ${SYN.kw('as')} cmds` },
            { num: 2, code: `` },
            { num: 3, code: `${SYN.kw('def')} ${SYN.fn('create_geo')}(name):` },
            { num: 4, code: `    cube = cmds.polyCube(n=name)` },
            { num: 5, code: `    ${SYN.kw('return')} cube` },
            { num: 6, code: `` },
            { num: 7, code: `${SYN.kw('def')} ${SYN.fn('scale_obj')}(obj, factor=${SYN.num('2')}):` },
            { num: 8, code: `    ${SYN.cm('"""Uniformly scale an object."""')}` },
            { num: 9, code: `    cmds.scale(factor, factor, factor, obj)` },
            { num: 10, code: `    ${SYN.kw('return')} obj` },
            { num: 11, code: `` },
            { num: 12, code: `${SYN.kw('def')} ${SYN.fn('apply_shader')}(obj, color):` },
            { num: 13, code: `    shader = cmds.shadingNode(${SYN.str("'lambert'")}, asShader=${SYN.kw('True')})` },
            { num: 14, code: `    cmds.setAttr(shader + ${SYN.str("'.color'")}, *color)` },
            { num: 15, code: `    cmds.select(obj)` },
            { num: 16, code: `    cmds.hyperShade(assign=shader)` },
            { num: 17, code: `` },
            { num: 18, code: `${SYN.kw('def')} ${SYN.fn('main')}():`, cls: 'line-add' },
            { num: 19, code: `    cube = create_geo(${SYN.str("'hero_cube'")})`, cls: 'line-add' },
            { num: 20, code: `    scale_obj(cube[${SYN.num('0')}], factor=${SYN.num('3')})`, cls: 'line-add' },
            { num: 21, code: `    apply_shader(cube[${SYN.num('0')}], (${SYN.num('1')}, ${SYN.num('0')}, ${SYN.num('0')}))`, cls: 'line-add' },
            { num: 22, code: `` },
            { num: 23, code: `${SYN.kw('if')} __name__ == ${SYN.str("'__main__'")}:`, cls: 'line-add' },
            { num: 24, code: `    main()`, cls: 'line-add' },
        ],
        diff: [18, 19, 20, 21, 23, 24],
        stats: { add: 6, del: 0, mod: 0 },
    },
];

// ── DOM refs ──
const codeContent = document.getElementById('code-content');
const timelineBody = document.getElementById('timeline-body');
const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');
const fileStatus = document.getElementById('file-status');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');

let currentCommit = 0;

// ── Build timeline nodes ──
function buildTimeline() {
    timelineBody.innerHTML = '';
    commits.forEach((c, i) => {
        const isLast = i === commits.length - 1;
        const node = document.createElement('div');
        node.className = 'tl-commit' + (i === currentCommit ? ' active' : '');
        node.dataset.index = i;

        let statsHtml = '';
        if (c.stats.add) statsHtml += `<span class="tl-stat add">+${c.stats.add}</span>`;
        if (c.stats.del) statsHtml += `<span class="tl-stat del">-${c.stats.del}</span>`;
        if (c.stats.mod) statsHtml += `<span class="tl-stat mod">~${c.stats.mod}</span>`;

        node.innerHTML = `
            <div class="tl-dot-col">
                <div class="tl-dot"></div>
                ${!isLast ? '<div class="tl-line"></div>' : ''}
            </div>
            <div class="tl-info">
                <div class="tl-msg">${c.message}</div>
                <div class="tl-hash">${c.hash}</div>
                <div class="tl-stats">${statsHtml}</div>
            </div>
        `;

        node.addEventListener('click', () => goToCommit(i));
        timelineBody.appendChild(node);
    });
}

// ── Render code for a commit ──
function renderCode(commitIndex) {
    const c = commits[commitIndex];
    codeContent.innerHTML = c.lines.map(l => {
        const cls = l.cls ? ` ${l.cls}` : '';
        return `<div class="code-line${cls}"><span class="line-num">${l.num}</span><span class="code-content">${l.code}</span></div>`;
    }).join('');
}

// ── Update everything for a commit ──
function goToCommit(index) {
    currentCommit = index;
    const c = commits[index];

    // Update explanation
    stepNumber.textContent = index + 1;
    stepNumber.style.background = c.color;
    stepNumber.style.boxShadow = `0 0 20px ${c.color}66`;
    stepTitle.textContent = c.title;
    stepDescription.innerHTML = c.desc;
    fileStatus.textContent = `Commit ${index + 1} of ${commits.length}`;

    // Update buttons
    btnPrev.classList.toggle('hidden', index === 0);
    if (index === commits.length - 1) {
        btnNext.textContent = 'Restart';
    } else {
        btnNext.textContent = 'Next Commit →';
    }

    // Update code
    renderCode(index);

    // Update timeline active state
    document.querySelectorAll('.tl-commit').forEach((el, i) => {
        el.classList.toggle('active', i === index);
    });
}

// ── Event listeners ──
btnNext.addEventListener('click', () => {
    if (currentCommit === commits.length - 1) {
        goToCommit(0);
    } else {
        goToCommit(currentCommit + 1);
    }
});

btnPrev.addEventListener('click', () => {
    if (currentCommit > 0) goToCommit(currentCommit - 1);
});

// ── Init ──
buildTimeline();
goToCommit(0);
