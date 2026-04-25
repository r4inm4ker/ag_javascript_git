// ── Syntax helpers ──
const S = {
    kw: (t) => `<span style="color:#c084fc">${t}</span>`,
    fn: (t) => `<span style="color:#60a5fa">${t}</span>`,
    str: (t) => `<span style="color:#a5d6a7">${t}</span>`,
    cm: (t) => `<span style="color:#6b7280;font-style:italic">${t}</span>`,
    num: (t) => `<span style="color:#f59e0b">${t}</span>`,
};

// ── Blame data — create_geo.py with two authors ──
const blameData = [
    { num: 1,  code: `${S.kw('import')} ${S.fn('maya.cmds')} ${S.kw('as')} cmds`,                           author: 'Aisha', hash: 'a1b2c3d', date: '2025-09-12', msg: 'Initial project setup' },
    { num: 2,  code: ``,                                                                                      author: 'Aisha', hash: 'a1b2c3d', date: '2025-09-12', msg: 'Initial project setup' },
    { num: 3,  code: `${S.kw('def')} ${S.fn('create_cube')}(name):`,                                          author: 'Aisha', hash: 'a1b2c3d', date: '2025-09-12', msg: 'Initial project setup' },
    { num: 4,  code: `    cube = cmds.polyCube(n=name)`,                                                      author: 'Aisha', hash: 'a1b2c3d', date: '2025-09-12', msg: 'Initial project setup' },
    { num: 5,  code: `    ${S.kw('return')} cube`,                                                            author: 'Aisha', hash: 'a1b2c3d', date: '2025-09-12', msg: 'Initial project setup' },
    { num: 6,  code: ``,                                                                                      author: 'Aisha', hash: 'a1b2c3d', date: '2025-09-12', msg: 'Initial project setup' },
    { num: 7,  code: `${S.kw('def')} ${S.fn('scale_obj')}(obj, factor=${S.num('2')}):`,                       author: 'Ben',   hash: 'e4f5g6h', date: '2025-09-15', msg: 'Add scale utility' },
    { num: 8,  code: `    ${S.cm('"""Uniformly scale an object."""')}`,                                        author: 'Ben',   hash: 'e4f5g6h', date: '2025-09-15', msg: 'Add scale utility' },
    { num: 9,  code: `    cmds.scale(factor, factor, factor, obj)`,                                            author: 'Ben',   hash: 'e4f5g6h', date: '2025-09-15', msg: 'Add scale utility' },
    { num: 10, code: `    ${S.kw('return')} obj`,                                                             author: 'Ben',   hash: 'e4f5g6h', date: '2025-09-15', msg: 'Add scale utility' },
    { num: 11, code: ``,                                                                                      author: 'Ben',   hash: 'e4f5g6h', date: '2025-09-15', msg: 'Add scale utility' },
    { num: 12, code: `${S.kw('def')} ${S.fn('apply_shader')}(obj, color):`,                                   author: 'Aisha', hash: 'j7k8l9m', date: '2025-09-18', msg: 'Add shader system' },
    { num: 13, code: `    shd = cmds.shadingNode(${S.str("'lambert'")}, asShader=${S.kw('True')})`,            author: 'Aisha', hash: 'j7k8l9m', date: '2025-09-18', msg: 'Add shader system' },
    { num: 14, code: `    cmds.setAttr(shd + ${S.str("'.color'")}, *color)`,                                  author: 'Aisha', hash: 'j7k8l9m', date: '2025-09-18', msg: 'Add shader system' },
    { num: 15, code: `    cmds.select(obj)`,                                                                   author: 'Aisha', hash: 'j7k8l9m', date: '2025-09-18', msg: 'Add shader system' },
    { num: 16, code: `    cmds.hyperShade(assign=shd)`,                                                        author: 'Aisha', hash: 'j7k8l9m', date: '2025-09-18', msg: 'Add shader system' },
    { num: 17, code: ``,                                                                                      author: 'Aisha', hash: 'j7k8l9m', date: '2025-09-18', msg: 'Add shader system' },
    { num: 18, code: `${S.kw('def')} ${S.fn('main')}():`,                                                     author: 'Ben',   hash: 'p4q5r6s', date: '2025-09-20', msg: 'Wire up main entry point' },
    { num: 19, code: `    cube = create_cube(${S.str("'hero_cube'")})`,                                        author: 'Ben',   hash: 'p4q5r6s', date: '2025-09-20', msg: 'Wire up main entry point' },
    { num: 20, code: `    scale_obj(cube[${S.num('0')}], factor=${S.num('3')})`,                               author: 'Ben',   hash: 'p4q5r6s', date: '2025-09-20', msg: 'Wire up main entry point' },
    { num: 21, code: `    apply_shader(cube[${S.num('0')}], (${S.num('1')}, ${S.num('0')}, ${S.num('0')}))`,   author: 'Ben',   hash: 'p4q5r6s', date: '2025-09-20', msg: 'Wire up main entry point' },
];

// ── Steps ──
const steps = [
    {
        num: 1,
        title: 'The File',
        desc: `You're looking at <code>create_geo.py</code> — a Maya tools script edited by two developers: <strong style="color:#06b6d4">Aisha</strong> and <strong style="color:#f59e0b">Ben</strong>. Something is wrong with a line and you need to find out who wrote it.`,
        actionBtn: 'git blame create_geo.py',
        color: '#6366f1',
        command: 'git blame create_geo.py',
    },
    {
        num: 2,
        title: 'Blame Annotations',
        desc: `Git annotates every single line with the <strong>author</strong>, <strong>commit hash</strong>, and <strong>date</strong> of the last change. Lines are color-coded by author — <span style="color:#06b6d4">cyan for Aisha</span>, <span style="color:#f59e0b">amber for Ben</span>. Click any line to inspect the commit.`,
        actionBtn: 'Explore Lines',
        color: '#6366f1',
        command: null,
    },
];

// ── DOM ──
const codeContent = document.getElementById('code-content');
const fileStatus = document.getElementById('file-status');
const detailEmpty = document.getElementById('detail-empty');
const detailCard = document.getElementById('detail-card');
const detailAvatar = document.getElementById('detail-avatar');
const detailAuthor = document.getElementById('detail-author');
const detailHash = document.getElementById('detail-hash');
const detailDate = document.getElementById('detail-date');
const detailMsg = document.getElementById('detail-msg');
const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');
const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');

let currentStep = 0;
let blameActive = false;

function authorClass(author) {
    return author === 'Aisha' ? 'a' : 'b';
}

// ── Render code lines ──
function renderCode(showBlame) {
    blameActive = showBlame;
    codeContent.innerHTML = blameData.map((l, i) => {
        const ac = authorClass(l.author);
        const blameClass = showBlame ? ' blame-visible' : '';
        return `<div class="code-line${blameClass}" data-index="${i}">` +
            `<span class="blame-author author-${ac}">${l.author}</span>` +
            `<span class="blame-hash">${l.hash}</span>` +
            `<span class="line-num">${l.num}</span>` +
            `<span class="code-content">${l.code}</span>` +
            `</div>`;
    }).join('');

    // Stagger animation for blame reveal
    if (showBlame) {
        const lines = codeContent.querySelectorAll('.code-line');
        lines.forEach((el, i) => {
            const author = el.querySelector('.blame-author');
            const hash = el.querySelector('.blame-hash');
            author.style.transitionDelay = `${i * 40}ms`;
            hash.style.transitionDelay = `${i * 40 + 20}ms`;
        });
    }

    // Click handlers
    codeContent.querySelectorAll('.code-line').forEach(el => {
        el.addEventListener('click', () => {
            if (!blameActive) return;
            const idx = parseInt(el.dataset.index);
            selectLine(idx, el);
        });
    });
}

// ── Select a line and show details ──
function selectLine(index, el) {
    const data = blameData[index];

    // Highlight the line
    codeContent.querySelectorAll('.code-line').forEach(l => l.classList.remove('active'));
    el.classList.add('active');

    // Also highlight all lines from same commit
    codeContent.querySelectorAll('.code-line').forEach(l => {
        const i = parseInt(l.dataset.index);
        if (blameData[i].hash === data.hash) {
            l.style.background = 'rgba(99, 102, 241, 0.06)';
        } else {
            l.style.background = '';
        }
    });
    el.style.background = 'rgba(99, 102, 241, 0.12)';

    // Show detail card
    const ac = authorClass(data.author);
    detailEmpty.style.display = 'none';
    detailCard.classList.add('visible');
    detailAvatar.textContent = data.author[0];
    detailAvatar.className = `author-avatar avatar-${ac}`;
    detailAuthor.textContent = data.author;
    detailAuthor.style.color = ac === 'a' ? '#06b6d4' : '#f59e0b';
    detailHash.textContent = data.hash;
    detailDate.textContent = data.date;
    detailMsg.textContent = data.msg;
    detailMsg.style.borderLeftColor = ac === 'a' ? '#06b6d4' : '#f59e0b';
}

// ── Update explanation panel ──
function updateUI(stepIndex) {
    const step = steps[stepIndex];
    stepNumber.textContent = step.num;
    stepTitle.textContent = step.title;
    if (step.command) {
        stepDescription.innerHTML = step.desc + '<br><br><code class="command-code">$ ' + step.command + '</code>';
    } else {
        stepDescription.innerHTML = step.desc;
    }
    btnNext.textContent = step.actionBtn;
    stepNumber.style.background = step.color;
    stepNumber.style.boxShadow = `0 0 20px ${step.color}66`;
}

// ── Events ──
btnNext.addEventListener('click', () => {
    if (currentStep === 0) {
        currentStep = 1;
        updateUI(1);
        renderCode(true);
        fileStatus.textContent = 'Blamed';
        fileStatus.style.color = '#6366f1';
        fileStatus.style.background = 'rgba(99, 102, 241, 0.15)';
        btnNext.classList.add('hidden');
        btnReset.classList.remove('hidden');
    }
});

btnReset.addEventListener('click', () => {
    currentStep = 0;
    updateUI(0);
    renderCode(false);
    fileStatus.textContent = 'Source';
    fileStatus.style.color = '#94a3b8';
    fileStatus.style.background = 'rgba(255,255,255,0.1)';
    detailEmpty.style.display = '';
    detailCard.classList.remove('visible');
    btnNext.classList.remove('hidden');
    btnReset.classList.add('hidden');
});

// ── Init ──
updateUI(0);
renderCode(false);