// ─── Element refs ─────────────────────────────────────────────────────────────
const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');
const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDesc = document.getElementById('step-description');
const stepBlock = document.getElementById('step-indicator-block');

const localPanel = document.getElementById('local-panel');
const remotePanel = document.getElementById('remote-panel');
const localCode = document.getElementById('local-code');
const remoteCode = document.getElementById('remote-code');
const localBadge = document.getElementById('local-conflict-badge');
const remoteBadge = document.getElementById('remote-conflict-badge');
const localCommits = document.getElementById('local-commits');

const conflictViewer = document.getElementById('conflict-viewer');
const viewerBody = document.getElementById('viewer-body');
const codeStatus = document.getElementById('code-status');

const termBody = document.getElementById('terminal-body');
const arrowLeft = document.getElementById('arrow-left');
const arrowRight = document.getElementById('arrow-right');

let currentStep = 0;

// ─── Step definitions ─────────────────────────────────────────────────────────
const steps = [
    {
        num: 1, color: '#ef4444', glow: 'rgba(239,68,68,0.4)',
        title: 'The Setup',
        btnLabel: 'git pull origin main', btnMono: true,
        desc: `You and a teammate both edited <code>create_geo.py</code> on different branches.
               The <strong style="color:#3b82f6;">local</strong> branch (main) set
               <code>cmds.rotate()</code>; the
               <strong style="color:#ec4899;">remote</strong> (origin/main) set
               <code>cmds.move()</code>. Both touch the same lines — Git cannot
               auto-merge.`,
    },
    {
        num: 2, color: '#ef4444', glow: 'rgba(239,68,68,0.4)',
        title: 'Pull Failed — CONFLICT',
        btnLabel: 'Inspect Conflict Markers',
        desc: `<code>git pull</code> <strong style="color:#ef4444;">failed</strong>.
               Git has written <strong>conflict markers</strong> into
               <code>create_geo.py</code> in the working copy (centre). Your code
               (<code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code>) and their code
               (<code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>) sit side-by-side, separated
               by <code>=======</code>.`,
    },
    {
        num: 3, color: '#f59e0b', glow: 'rgba(245,158,11,0.4)',
        title: 'Understand the Conflict',
        btnLabel: 'Resolve the Conflict',
        desc: `<strong style="color:#3b82f6;">Your code</strong>: <code>cmds.rotate(0, 45, 0)</code>
               (rotate 45 deg).<br><br>
               <strong style="color:#ec4899;">Their code</strong>: <code>cmds.move(0, 5, 0)</code>
               (translate up).<br><br>
               You must pick a winner — or combine both — and remove all markers manually.`,
    },
    {
        num: 4, color: '#10b981', glow: 'rgba(16,185,129,0.4)',
        title: 'Conflict Resolved',
        btnLabel: 'git add create_geo.py && git commit',
        desc: `You kept <strong style="color:#ec4899;">both transformations</strong>
               so the cube translates and rotates.
               All conflict markers removed — the working copy is clean again.`,
    },
    {
        num: 5, color: '#10b981', glow: 'rgba(16,185,129,0.4)',
        title: 'Merge Commit Created',
        btnLabel: 'Restart Tutorial',
        desc: `Git creates a <strong style="color:#10b981;">merge commit</strong>
               that permanently ties both histories together. Your local branch now has
               all of <code>origin/main</code>'s changes plus your own — conflict resolved ✓`,
    },
];

// ─── Python snippets ──────────────────────────────────────────────────────────

// YOUR version (local — Add rotation commit)
const localLines = [
    { cls: 'ln-normal', tc: 'cm', code: '# geo/create_geo.py — LOCAL (main)' },
    { cls: 'ln-normal', tc: 'neutral', code: '' },
    { cls: 'ln-normal', tc: 'neutral', code: 'import maya.cmds as cmds' },
    { cls: 'ln-normal', tc: 'neutral', code: '' },
    { cls: 'ln-normal', tc: 'fn', code: 'def create_geometry(name="myCube"):' },
    { cls: 'ln-normal', tc: 'cm', code: '    """Generate primitive cube."""' },
    { cls: 'ln-normal', tc: 'neutral', code: '    cube = cmds.polyCube(n=name, w=2, h=2, d=2)' },
    { cls: 'hi-ours', tc: 'ours-text', code: '    cmds.rotate(0, 45, 0, cube[0])  # ← YOUR change' },
    { cls: 'ln-normal', tc: 'neutral', code: '    return cube' }
];

// THEIR version (remote origin/main — Translate cube up commit)
const remoteLines = [
    { cls: 'ln-normal', tc: 'cm', code: '# geo/create_geo.py — REMOTE (origin/main)' },
    { cls: 'ln-normal', tc: 'neutral', code: '' },
    { cls: 'ln-normal', tc: 'neutral', code: 'import maya.cmds as cmds' },
    { cls: 'ln-normal', tc: 'neutral', code: '' },
    { cls: 'ln-normal', tc: 'fn', code: 'def create_geometry(name="myCube"):' },
    { cls: 'ln-normal', tc: 'cm', code: '    """Generate primitive cube."""' },
    { cls: 'ln-normal', tc: 'neutral', code: '    cube = cmds.polyCube(n=name, w=2, h=2, d=2)' },
    { cls: 'hi-theirs', tc: 'theirs-text', code: '    cmds.move(0, 5, 0, cube[0])  # ← THEIR change' },
    { cls: 'ln-normal', tc: 'neutral', code: '    return cube' }
];

// WORKING COPY — initial clean state (local version, no markers)
const workingCleanLines = [
    { cls: 'ln-normal', tc: 'cm', code: '# geo/create_geo.py' },
    { cls: 'ln-normal', tc: 'neutral', code: '' },
    { cls: 'ln-normal', tc: 'neutral', code: 'import maya.cmds as cmds' },
    { cls: 'ln-normal', tc: 'neutral', code: '' },
    { cls: 'ln-normal', tc: 'fn', code: 'def create_geometry(name="myCube"):' },
    { cls: 'ln-normal', tc: 'cm', code: '    """Generate primitive cube."""' },
    { cls: 'ln-normal', tc: 'neutral', code: '    cube = cmds.polyCube(n=name, w=2, h=2, d=2)' },
    { cls: 'hi-label', tc: 'ours-text', code: '    cmds.rotate(0, 45, 0, cube[0])  # your local value' },
    { cls: 'ln-normal', tc: 'neutral', code: '    return cube' }
];

// WORKING COPY — after git pull: conflict markers injected
const conflictLines = [
    { cls: 'ln-normal', tc: 'cm', code: '# geo/create_geo.py' },
    { cls: 'ln-normal', tc: 'neutral', code: '' },
    { cls: 'ln-normal', tc: 'neutral', code: 'import maya.cmds as cmds' },
    { cls: 'ln-normal', tc: 'neutral', code: '' },
    { cls: 'ln-normal', tc: 'fn', code: 'def create_geometry(name="myCube"):' },
    { cls: 'ln-normal', tc: 'cm', code: '    """Generate primitive cube."""' },
    { cls: 'ln-normal', tc: 'neutral', code: '    cube = cmds.polyCube(n=name, w=2, h=2, d=2)' },
    { cls: 'ln-marker', tc: 'marker-text', code: '<<<<<<< HEAD' },
    { cls: 'ln-ours', tc: 'ours-text', code: '    cmds.rotate(0, 45, 0, cube[0])  # (YOUR change)' },
    { cls: 'ln-marker', tc: 'marker-text', code: '=======' },
    { cls: 'ln-theirs', tc: 'theirs-text', code: '    cmds.move(0, 5, 0, cube[0])  # (THEIR change)' },
    { cls: 'ln-marker', tc: 'marker-text', code: '>>>>>>> p4q5r6s (Translate cube up)' },
    { cls: 'ln-normal', tc: 'neutral', code: '    return cube' }
];

// WORKING COPY — after resolution
const resolvedLines = [
    { cls: 'ln-normal', tc: 'cm', code: '# geo/create_geo.py' },
    { cls: 'ln-normal', tc: 'neutral', code: '' },
    { cls: 'ln-normal', tc: 'neutral', code: 'import maya.cmds as cmds' },
    { cls: 'ln-normal', tc: 'neutral', code: '' },
    { cls: 'ln-normal', tc: 'fn', code: 'def create_geometry(name="myCube"):' },
    { cls: 'ln-normal', tc: 'cm', code: '    """Generate primitive cube."""' },
    { cls: 'ln-normal', tc: 'neutral', code: '    cube = cmds.polyCube(n=name, w=2, h=2, d=2)' },
    { cls: 'ln-resolved', tc: 'resolved-text', code: '# Resolved: Kept both transformations' },
    { cls: 'ln-resolved', tc: 'resolved-text', code: '    cmds.move(0, 5, 0, cube[0])' },
    { cls: 'ln-resolved', tc: 'resolved-text', code: '    cmds.rotate(0, 45, 0, cube[0])' },
    { cls: 'ln-normal', tc: 'neutral', code: '    return cube' }
];

// ─── Render helpers ───────────────────────────────────────────────────────────
function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const tcMap = {
    'cm': s => `<span class="cm">${esc(s)}</span>`,
    'neutral': s => `<span class="neutral-text">${esc(s)}</span>`,
    'ours-text': s => `<span class="ours-text">${esc(s)}</span>`,
    'theirs-text': s => `<span class="theirs-text">${esc(s)}</span>`,
    'resolved-text': s => `<span class="resolved-text">${esc(s)}</span>`,
    'marker-text': s => `<span class="marker-text">${esc(s)}</span>`,
    'fn': s => `<span class="fn">${esc(s)}</span>`,
};

function buildLine(data, num) {
    const el = document.createElement('div');
    el.className = 'code-line ' + (data.cls || 'ln-normal');
    const render = tcMap[data.tc] || (s => `<span class="neutral-text">${esc(s)}</span>`);
    el.innerHTML = `<span class="line-num">${num}</span><span class="line-code">${render(data.code)}</span>`;
    return el;
}

function renderInto(container, lines, animate = false) {
    container.innerHTML = '';
    lines.forEach((l, i) => {
        const el = buildLine(l, i + 1);
        if (animate) {
            el.style.opacity = '0';
            el.style.transition = `opacity 0.2s ease ${i * 18}ms`;
            container.appendChild(el);
            requestAnimationFrame(() => { el.style.opacity = '1'; });
        } else {
            container.appendChild(el);
        }
    });
}

// ─── Terminal helpers ─────────────────────────────────────────────────────────
function clearTerm() { termBody.innerHTML = ''; }

function addTerm(html, delay = 0) {
    return new Promise(res => {
        setTimeout(() => {
            const s = document.createElement('span');
            s.className = 't-line';
            s.innerHTML = html;
            termBody.appendChild(s);
            requestAnimationFrame(() => s.classList.add('visible'));
            termBody.scrollTop = termBody.scrollHeight;
            res();
        }, delay);
    });
}

// ─── Status helpers ───────────────────────────────────────────────────────────
function setStatus(text, bg, color, border) {
    codeStatus.textContent = text;
    codeStatus.style.background = bg;
    codeStatus.style.color = color;
    codeStatus.style.borderColor = border;
}
function setViewerBorder(color, shadow) {
    conflictViewer.style.borderColor = color;
    conflictViewer.style.boxShadow = shadow;
}

// ─── Step UI ──────────────────────────────────────────────────────────────────
function applyStep(s) {
    stepNumber.textContent = s.num;
    stepTitle.textContent = s.title;
    stepDesc.innerHTML = s.desc;
    stepBlock.style.background = s.color;
    stepBlock.style.boxShadow = `0 0 20px ${s.glow}`;
    btnNext.style.background = s.color;
    if (s.btnMono) {
        btnNext.style.fontFamily = "'JetBrains Mono', monospace";
        btnNext.style.fontSize = '0.88rem';
    } else {
        btnNext.style.fontFamily = '';
        btnNext.style.fontSize = '';
    }
    btnNext.textContent = s.btnLabel;
}

// ─── Initial render ───────────────────────────────────────────────────────────
renderInto(localCode, localLines);
renderInto(remoteCode, remoteLines);
renderInto(viewerBody, workingCleanLines);
applyStep(steps[0]);

// ─── Step machine ─────────────────────────────────────────────────────────────
btnNext.addEventListener('click', async () => {
    currentStep++;

    // ── Step 1: git pull → CONFLICT ──────────────────────────────────────────
    if (currentStep === 1) {
        btnNext.disabled = true;
        applyStep(steps[1]);

        clearTerm();
        await addTerm(`<span class="t-prompt">$</span> <span class="t-cmd">git pull origin main</span>`, 0);
        await addTerm(`<span class="t-info">remote: Enumerating objects: 5, done.</span>`, 280);
        await addTerm(`<span class="t-info">remote: Counting objects: 100% (5/5), done.</span>`, 480);
        await addTerm(`<span class="t-info">Unpacking objects: 100% (3/3), done.</span>`, 680);
        await addTerm(`<span class="t-warn">Auto-merging geo/create_geo.py</span>`, 900);
        await addTerm(`<span class="t-err">CONFLICT (content): Merge conflict in geo/create_geo.py</span>`, 1100);
        await addTerm(`<span class="t-err">Automatic merge failed; fix conflicts and then commit the result.</span>`, 1300);
        await addTerm(`<span class="t-prompt">$</span> <span class="t-cmd">_</span>`, 1500);

        // Shake both branch panels
        setTimeout(() => {
            localPanel.classList.add('shake-animation');
            remotePanel.classList.add('shake-animation');
            conflictViewer.classList.add('conflict-glow');
            setTimeout(() => {
                localPanel.classList.remove('shake-animation');
                remotePanel.classList.remove('shake-animation');
            }, 600);
        }, 950);

        // Inject conflict markers into central viewer & show badges
        setTimeout(() => {
            renderInto(viewerBody, conflictLines, true);
            setStatus('CONFLICT', 'rgba(239,68,68,0.20)', '#ef4444', '#ef4444');
            setViewerBorder('rgba(239,68,68,0.5)', '0 0 28px rgba(239,68,68,0.25)');

            localBadge.classList.add('show');
            remoteBadge.classList.add('show');
            arrowLeft.classList.add('active');
            arrowRight.classList.add('active');

            localPanel.style.borderColor = 'rgba(239,68,68,0.45)';
            localPanel.style.boxShadow = '0 0 20px rgba(239,68,68,0.15)';
            remotePanel.style.borderColor = 'rgba(239,68,68,0.45)';
            remotePanel.style.boxShadow = '0 0 20px rgba(239,68,68,0.15)';

            btnNext.disabled = false;
        }, 1600);

        // ── Step 2: Inspect markers ───────────────────────────────────────────────
    } else if (currentStep === 2) {
        applyStep(steps[2]);

        clearTerm();
        await addTerm(`<span class="t-prompt">$</span> <span class="t-cmd">git status</span>`, 0);
        await addTerm(`<span class="t-info">On branch feature/maya-tool</span>`, 220);
        await addTerm(`<span class="t-info">You have unmerged paths.</span>`, 380);
        await addTerm(`<span class="t-err">  (fix conflicts and run "git commit")</span>`, 530);
        await addTerm(`<span class="t-info">Unmerged paths:</span>`, 700);
        await addTerm(`<span class="t-err">	both modified:   geo/create_geo.py</span>`, 860);

        // Pulse the conflict markers
        viewerBody.querySelectorAll('.ln-marker').forEach(m => {
            m.style.background = 'rgba(239,68,68,0.28)';
        });

        // ── Step 3: Resolve ───────────────────────────────────────────────────────
    } else if (currentStep === 3) {
        applyStep(steps[3]);

        clearTerm();
        await addTerm(`<span class="t-info"># Opening create_geo.py in editor...</span>`, 0);
        await addTerm(`<span class="t-info"># Removing conflict markers, picking final code...</span>`, 300);

        setTimeout(() => {
            renderInto(viewerBody, resolvedLines, true);
            setStatus('Resolved ✓', 'rgba(16,185,129,0.20)', '#10b981', '#10b981');
            setViewerBorder('rgba(16,185,129,0.5)', '0 0 28px rgba(16,185,129,0.2)');

            localPanel.style.borderColor = 'rgba(16,185,129,0.35)';
            localPanel.style.boxShadow = '0 0 20px rgba(16,185,129,0.12)';
            remotePanel.style.borderColor = 'rgba(16,185,129,0.35)';
            remotePanel.style.boxShadow = '0 0 20px rgba(16,185,129,0.12)';

            localBadge.classList.remove('show');
            remoteBadge.classList.remove('show');
        }, 600);

        // ── Step 4: Commit ────────────────────────────────────────────────────────
    } else if (currentStep === 4) {
        applyStep(steps[4]);

        clearTerm();
        await addTerm(`<span class="t-prompt">$</span> <span class="t-cmd">git add geo/create_geo.py</span>`, 0);
        await addTerm(`<span class="t-prompt">$</span> <span class="t-cmd">git commit -m "Merge 'main' into feature/maya-tool — resolve transform conflict"</span>`, 340);
        await addTerm(`<span class="t-ok">[feature/maya-tool c4d5e6f] Merge 'main' into feature/maya-tool</span>`, 800);
        await addTerm(`<span class="t-info"> 1 file changed, 2 insertions(+), 8 deletions(-)</span>`, 1000);
        await addTerm(`<span class="t-prompt">$</span> <span class="t-cmd">_</span>`, 1200);

        // Append remote commit + merge commit to local branch
        setTimeout(() => {
            // Remove old HEAD tag first
            const oldHead = localCommits.querySelector('.ours-tag');
            if (oldHead) oldHead.remove();

            // ── Remote commit (b9c8d7e) now in local history ──
            const line1 = document.createElement('div');
            line1.className = 'commit-line';
            line1.style.cssText = 'background:#4b5563; height:6px; margin-left:1rem; opacity:0; animation: popIn 0.4s ease 0.0s forwards;';

            const remoteNode = document.createElement('div');
            remoteNode.className = 'commit-node main-track relative-node';
            remoteNode.style.cssText = 'padding:0.35rem 0.6rem; background:rgba(236,72,153,0.08); border-color:rgba(236,72,153,0.3); opacity:0; animation: popIn 0.5s ease 0.1s forwards;';
            remoteNode.innerHTML = `
                <div class="commit-dot" style="width:10px;height:10px;background:#ec4899;box-shadow:0 0 6px #ec4899;"></div>
                <div class="commit-msg" style="font-size:0.78rem;">
                    <span class="theirs-color">Add rotation</span>
                    <span class="commit-hash">b9c8d7e</span>
                </div>
                <div class="labels-container">
                    <span class="branch-tag theirs-tag" style="font-size:0.65rem;">from origin/main</span>
                </div>`;

            // ── Merge commit (c4d5e6f) ──
            const line2 = document.createElement('div');
            line2.className = 'commit-line';
            line2.style.cssText = 'background:#10b981; height:6px; margin-left:1rem; opacity:0; animation: popIn 0.4s ease 0.3s forwards;';

            const mergeNode = document.createElement('div');
            mergeNode.className = 'commit-node main-track relative-node';
            mergeNode.style.cssText = 'padding:0.35rem 0.6rem; background:rgba(16,185,129,0.12); border-color:rgba(16,185,129,0.4); opacity:0; animation: popIn 0.5s ease 0.4s forwards;';
            mergeNode.innerHTML = `
                <div class="commit-dot" style="width:10px;height:10px;background:#10b981;box-shadow:0 0 8px #10b981;"></div>
                <div class="commit-msg" style="font-size:0.78rem;">
                    <span class="resolved-color">Merge 'main' — resolve conflict</span>
                    <span class="commit-hash">c4d5e6f</span>
                </div>
                <div class="labels-container">
                    <span class="branch-tag resolved-tag" style="font-size:0.65rem;">HEAD</span>
                </div>`;

            localCommits.appendChild(line1);
            localCommits.appendChild(remoteNode);
            localCommits.appendChild(line2);
            localCommits.appendChild(mergeNode);

            arrowLeft.classList.remove('active');
            arrowRight.classList.remove('active');

            btnNext.classList.add('hidden');
            btnReset.classList.remove('hidden');
        }, 1300);


        return;
    }
});

// ─── Reset ────────────────────────────────────────────────────────────────────
btnReset.addEventListener('click', () => {
    currentStep = 0;

    // Restore branch panels
    localPanel.style.borderColor = 'rgba(59,130,246,0.35)';
    localPanel.style.boxShadow = '0 0 24px rgba(59,130,246,0.1)';
    remotePanel.style.borderColor = 'rgba(236,72,153,0.35)';
    remotePanel.style.boxShadow = '0 0 24px rgba(236,72,153,0.1)';

    // Remove appended merge commit (keep 3 original children)
    while (localCommits.children.length > 3) {
        localCommits.removeChild(localCommits.lastChild);
    }
    // Restore HEAD tag
    const latestNode = document.getElementById('local-latest-commit');
    if (latestNode && !latestNode.querySelector('.ours-tag')) {
        const tag = document.createElement('span');
        tag.className = 'branch-tag ours-tag';
        tag.id = 'local-head-tag';
        tag.style.fontSize = '0.65rem';
        tag.textContent = 'HEAD';
        let lc = latestNode.querySelector('.labels-container');
        if (!lc) {
            lc = document.createElement('div');
            lc.className = 'labels-container';
            latestNode.appendChild(lc);
        }
        lc.appendChild(tag);
    }

    // Restore central viewer
    renderInto(viewerBody, workingCleanLines);
    setStatus('Working copy', 'rgba(255,255,255,0.07)', '#64748b', 'rgba(255,255,255,0.1)');
    setViewerBorder('rgba(148,163,184,0.12)', '');
    conflictViewer.style.boxShadow = '';

    // Hide badges & arrows
    localBadge.classList.remove('show');
    remoteBadge.classList.remove('show');
    arrowLeft.classList.remove('active');
    arrowRight.classList.remove('active');

    // Terminal
    clearTerm();
    const s = document.createElement('span');
    s.className = 't-line visible';
    s.innerHTML = `<span class="t-prompt">$</span> <span class="t-cmd">_</span>`;
    termBody.appendChild(s);

    applyStep(steps[0]);
    btnNext.disabled = false;
    btnNext.classList.remove('hidden');
    btnReset.classList.add('hidden');
});
