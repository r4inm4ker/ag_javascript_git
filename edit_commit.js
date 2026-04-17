const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');

const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

const codeContent = document.getElementById('code-content');
const fileStatus = document.getElementById('file-status');
const termContent = document.getElementById('term-content');
const repoCommits = document.getElementById('repo-commits');
const tb = document.getElementById('terminal-body');

const steps = [
    {
        num: 1,
        title: "Editing the File",
        desc: "You have opened 'create_geo.py' in your editor. Let's write some new code to generate primitive geometry.",
        actionBtn: "Write Code",
        color: "#3b82f6" // Blue
    },
    {
        num: 2,
        title: "Staging the Changes",
        desc: "You've securely saved changes, and Git sees the file as 'modified'. To include these in your next commit, you must stage them to the index using 'git add'.",
        actionBtn: "git add create_geo.py",
        color: "#f59e0b" // Orange
    },
    {
        num: 3,
        title: "Committing",
        desc: "The file is now staged. Running 'git commit' wraps these tracked changes into a permanent snapshot in your local history.",
        actionBtn: "git commit -m \"Add Maya cube tool\"",
        color: "#10b981" // Green
    },
    {
        num: 4,
        title: "Commit Created!",
        desc: "Your local repository now contains the new commit. The working directory is completely clean and ready for your next task.",
        actionBtn: "Restart Tutorial",
        color: "#a855f7" // Purple
    }
];

let currentStep = 0;
let isAnimating = false;

// Base code HTML
const baseCode = `
<div class="code-line" style="border-left: 3px solid transparent;"><span class="line-num">1</span><span class="code-content"><span style="color:#c084fc">import</span> <span style="color:#60a5fa">maya.cmds</span> as cmds<br></span></div>
<div class="code-line" style="border-left: 3px solid transparent;"><span class="line-num">2</span><span class="code-content"><span style="color:#c084fc">def</span> <span style="color:#60a5fa">create_cube</span>(name):</span></div>
`;

// Added code HTML
const addedCode = `
<div class="code-line line-add" style="opacity:0; animation: slideInRight 0.3s forwards;"><span class="line-num">3</span><span class="code-content"></span></div>
<div class="code-line line-add" style="opacity:0; animation: slideInRight 0.3s forwards 0.1s;"><span class="line-num">4</span><span class="code-content">cube = cmds.polyCube(n=name)</span></div>
<div class="code-line line-add" style="opacity:0; animation: slideInRight 0.3s forwards 0.2s;"><span class="line-num">5</span><span class="code-content">    cmds.move(0, 5, 0, cube[0])</span></div>
<div class="code-line line-add" style="opacity:0; animation: slideInRight 0.3s forwards 0.3s;"><span class="line-num">6</span><span class="code-content">    <span style="color:#c084fc">return</span> cube</span></div>
<div class="code-line line-add" style="opacity:0; animation: slideInRight 0.3s forwards 0.4s;"><span class="line-num">7</span><span class="code-content"></span></div>
`;

const baseCommit = `
<div class="commit-node main-track relative-node">
    <div class="commit-dot main-bg"></div>
    <div class="commit-msg">
        <span>Initial commit</span>
        <span class="commit-hash" style="font-family: monospace; font-size: 0.8rem; color: var(--text-muted);">a1b2c3d</span>
    </div>
    <div class="labels-container" id="local-base-labels">
        <span class="branch-tag main-tag">main</span>
        <span class="head-tag">HEAD</span>
    </div>
</div>`;

const termInit = `
<div><span class="t-prompt">$</span> <span class="t-cmd">git status</span></div>
<div class="t-info">On branch main<br>nothing to commit, working tree clean</div>
`;

function init() {
    codeContent.innerHTML = baseCode;
    repoCommits.innerHTML = baseCommit;
    termContent.innerHTML = termInit;
    fileStatus.innerHTML = `Unmodified`;
    fileStatus.style.color = '#94a3b8';
    fileStatus.style.background = 'rgba(255,255,255,0.1)';
    updateUI(0);
}

function updateUI(idx) {
    const step = steps[idx];
    stepNumber.textContent = step.num;
    stepTitle.textContent = step.title;
    stepDescription.textContent = step.desc;
    btnNext.textContent = step.actionBtn;
    stepNumber.style.background = step.color;
    stepNumber.style.boxShadow = `0 0 20px ${step.color}66`;
}

btnNext.addEventListener('click', () => {
    if (isAnimating) return;
    
    currentStep++;
    
    if (currentStep === 1) {
        // Option 1 Completed -> Wrote Code
        updateUI(currentStep);
        codeContent.insertAdjacentHTML('beforeend', addedCode);
        
        fileStatus.innerHTML = `Modified (Unstaged)`;
        fileStatus.style.color = '#f59e0b';
        fileStatus.style.background = 'rgba(245, 158, 11, 0.15)';
        fileStatus.style.animation = 'popIn 0.3s forwards';
        
        termContent.innerHTML += `
        <div style="margin-top:0.8rem;"><span class="t-prompt">$</span> <span class="t-cmd">git status</span></div>
        <div class="t-info">Changes not staged for commit:<br>&nbsp;&nbsp;<span style="color:#ef4444">modified:   create_geo.py</span></div>
        `;
        tb.scrollTop = tb.scrollHeight;
        
    } else if (currentStep === 2) {
        // Option 2 Completed -> Git Add
        updateUI(currentStep);
        
        fileStatus.innerHTML = `Staged (Ready)`;
        fileStatus.style.color = '#10b981';
        fileStatus.style.background = 'rgba(16, 185, 129, 0.15)';
        fileStatus.style.animation = 'none';
        setTimeout(() => fileStatus.style.animation = 'popIn 0.3s forwards', 10);
        
        termContent.innerHTML += `
        <div style="margin-top:0.8rem;"><span class="t-prompt">$</span> <span class="t-cmd">git add create_geo.py</span></div>
        <div style="margin-top:0.4rem;"><span class="t-prompt">$</span> <span class="t-cmd">git status</span></div>
        <div class="t-info">Changes to be committed:<br>&nbsp;&nbsp;<span style="color:#10b981">modified:   create_geo.py</span></div>
        `;
        tb.scrollTop = tb.scrollHeight;
        
    } else if (currentStep === 3) {
        // Option 3 Completed -> Git Commit
        updateUI(currentStep);
        isAnimating = true;
        btnNext.classList.add('hidden');
        btnReset.classList.remove('hidden');
        
        fileStatus.innerHTML = `Unmodified`;
        fileStatus.style.color = '#94a3b8';
        fileStatus.style.background = 'rgba(255,255,255,0.1)';
        fileStatus.style.animation = 'none';
        setTimeout(() => fileStatus.style.animation = 'popIn 0.3s forwards', 10);
        
        termContent.innerHTML += `
        <div style="margin-top:0.8rem;"><span class="t-prompt">$</span> <span class="t-cmd">git commit -m "Add Maya cube tool"</span></div>
        <div class="t-info">[main e4f5g6h] Add Maya cube tool<br> 1 file changed, 5 insertions(+)</div>
        `;
        tb.scrollTop = tb.scrollHeight;
        
        // Remove line-add colored border for cleanly committed changes
        document.querySelectorAll('.line-add').forEach(el => {
            el.style.borderLeft = "3px solid transparent";
            el.style.background = "transparent";
        });
        
        const commitLine = `<div class="commit-line main-bg" style="opacity:0; animation: drawPath 0.5s ease forwards;"></div>`;
        const newCommit = `
            <div class="commit-node main-track relative-node" style="opacity:0; animation: slideUp 0.5s ease forwards 0.2s;">
                <div class="commit-dot main-bg"></div>
                <div class="commit-msg" style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
                    <span>Add Maya cube tool</span>
                    <span class="commit-hash" style="font-family: monospace; font-size: 0.8rem; color: var(--text-muted); margin-left: auto;">e4f5g6h</span>
                </div>
                <div class="labels-container" id="new-base-labels" style="padding-left: 0.5rem;">
                </div>
            </div>`;
            
        repoCommits.insertAdjacentHTML('beforeend', commitLine);
        repoCommits.insertAdjacentHTML('beforeend', newCommit);
        
        setTimeout(() => {
            const labels = document.getElementById('new-base-labels');
            labels.appendChild(document.querySelector('.main-tag'));
            labels.appendChild(document.querySelector('.head-tag'));
            isAnimating = false;
        }, 300);
    }
});

btnReset.addEventListener('click', () => {
    currentStep = 0;
    btnReset.classList.add('hidden');
    btnNext.classList.remove('hidden');
    init();
});

// Initialize on load
init();
