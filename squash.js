const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');

const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

const wipTag = document.getElementById('wip-tag');
const headTag = document.getElementById('head-tag');

const topCommit = document.getElementById('top-commit');
const squashLine = document.getElementById('squash-line');
const bottomCommit = document.getElementById('bottom-commit');
const bottomText = document.getElementById('bottom-text');
const bottomHash = document.getElementById('bottom-hash');
const bottomDot = document.getElementById('bottom-dot');
const bottomLabels = document.getElementById('bottom-labels');
const topCommitFiller = document.getElementById('top-commit-filler');
const topDot = document.getElementById('top-dot');

const codeContent = document.getElementById('code-content');
const fileStatus = document.getElementById('file-status');

const baseCode = `
<div class="code-line"><span class="line-num">1</span><span class="code-content"><span style="color:#c084fc">import</span> <span style="color:#60a5fa">maya.cmds</span> as cmds</span></div>
<div class="code-line"><span class="line-num">2</span><span class="code-content"><span style="color:#c084fc">def</span> <span style="color:#60a5fa">create_cube</span>(name):</span></div>
<div class="code-line"><span class="line-num">3</span><span class="code-content">    cube = cmds.polyCube(n=name)</span></div>
`;
const commit1Code = `
<div class="code-line transition-squash" id="code-commit-1"><span class="line-num">4</span><span class="code-content">    cmds.move(0, 5, 0, cube[0]) <span style="color:#a855f7"># translate</span></span></div>
`;
const commit2Code = `
<div class="code-line transition-squash" id="code-commit-2"><span class="line-num">5</span><span class="code-content">    cmds.scale(10, 10, 10, cube[0]) <span style="color:#a855f7"># scale</span></span></div>
`;
const returnCode = `
<div class="code-line transition-squash" id="code-return"><span class="line-num" id="line-return-num">6</span><span class="code-content">    <span style="color:#c084fc">return</span> cube</span></div>
`;

function initEditor() {
    if (!codeContent) return;
    codeContent.innerHTML = baseCode + commit1Code + commit2Code + returnCode;
    if (fileStatus) {
        fileStatus.textContent = 'Pending Squash';
        fileStatus.style.color = '#a855f7';
        fileStatus.style.background = 'rgba(168, 85, 247, 0.15)';
    }
}

const steps = [
    {
        num: 1,
        title: "Commit 1: Translate",
        desc: "First, you made a WIP commit to translate the Maya cube.",
        actionBtn: "Next Commit",
        color: "#a855f7" // Purple
    },
    {
        num: 2,
        title: "Commit 2: Scale",
        desc: "Later, you added a second commit to scale the cube.",
        actionBtn: "Review History",
        color: "#a855f7" // Purple
    },
    {
        num: 3,
        title: "The Messy History",
        desc: "You've been working on the 'wip' branch and made several small 'work in progress' commits. Before pushing, you want to clean up your history by combining (squashing) them into one.",
        actionBtn: "Interactive Rebase",
        color: "#a855f7" // Purple
    },
    {
        num: 4,
        title: "Squashing...",
        desc: "Git rebase intercepts the commits. We tell Git to 'pick' the first commit and 'squash' the second one into it. They mathematically compress into a single logical changeset.",
        actionBtn: "Squashing...",
        color: "#f59e0b" // Orange
    },
    {
        num: 3,
        title: "Squash Complete",
        desc: "The commits are now perfectly merged into one unified 'translate and scale cube' commit with a brand new hash. Your branch is pristine!",
        actionBtn: "Restart Tutorial",
        color: "#10b981" // Green
    }
];

let currentStep = 0;
let isAnimating = false;

updateUI(0);
initEditor();

// Initial Highlight
setTimeout(() => {
    const codeComm1 = document.getElementById('code-commit-1');
    if (codeComm1) codeComm1.classList.add('line-highlight');
    bottomDot.classList.add('squash-glow');
    bottomCommit.classList.add('commit-row-highlight');
}, 50);

// For resetting purposes, store original values
const origText = "tmp: translate cube";
const origHash = "k8l9m0n";

btnNext.addEventListener('click', () => {
    if (isAnimating) return;

    currentStep++;

    if (currentStep === 1) {
        // Step 1 -> 2 (Commit 2: Scale)
        const codeComm1 = document.getElementById('code-commit-1');
        const codeComm2 = document.getElementById('code-commit-2');
        if (codeComm1) codeComm1.classList.remove('line-highlight');
        bottomDot.classList.remove('squash-glow');
        bottomCommit.classList.remove('commit-row-highlight');
        
        if (codeComm2) codeComm2.classList.add('line-highlight');
        if (topDot) topDot.classList.add('squash-glow');
        topCommit.classList.add('commit-row-highlight');
        
        btnNext.style.background = '#a855f7';
        updateUI(currentStep);
    } else if (currentStep === 2) {
        // Step 2 -> 3 (The Messy History)
        const codeComm2 = document.getElementById('code-commit-2');
        if (codeComm2) codeComm2.classList.remove('line-highlight');
        if (topDot) topDot.classList.remove('squash-glow');
        topCommit.classList.remove('commit-row-highlight');

        updateUI(currentStep);
    } else if (currentStep === 3) {
        isAnimating = true;
        updateUI(currentStep);
        btnNext.disabled = true;
        btnNext.style.opacity = '0.5';

        // Wait mechanically
        setTimeout(() => {
            // Squashing animation: The top commit slides completely down over the bottom commit
            // and the line connecting them shrinks to 0 height

            topCommit.style.transform = `translateY(40px) scale(0.9)`;
            topCommit.style.opacity = '0.4';
            topCommitFiller.style.opacity = '0';

            squashLine.style.transformOrigin = 'bottom';
            squashLine.style.transform = `scaleY(0)`;
            squashLine.style.opacity = '0';
            
            const codeComm1 = document.getElementById('code-commit-1');
            const codeComm2 = document.getElementById('code-commit-2');
            
            if (codeComm1) codeComm1.classList.add('line-highlight');
            if (codeComm2) codeComm2.classList.add('line-highlight');

            if (fileStatus) {
                fileStatus.textContent = 'Squashing...';
                fileStatus.style.color = '#f59e0b';
                fileStatus.style.background = 'rgba(245, 158, 11, 0.15)';
            }

            setTimeout(() => {
                // Flash and unify
                bottomDot.classList.add('squash-glow');
                topCommit.style.opacity = '0';
                topCommit.style.display = 'none';

                // Change text of bottom commit to unified text
                bottomText.textContent = "translate and scale cube";
                bottomText.style.fontWeight = "600";
                bottomHash.textContent = "s2q3u4a";

                // Move tags down logically
                bottomLabels.appendChild(wipTag);
                bottomLabels.appendChild(headTag);

                if (codeComm1) {
                    codeComm1.style.background = 'rgba(16, 185, 129, 0.2)';
                    codeComm1.style.borderLeftColor = '#10b981';
                }
                if (codeComm2) {
                    codeComm2.style.background = 'rgba(16, 185, 129, 0.2)';
                    codeComm2.style.borderLeftColor = '#10b981';
                }

                setTimeout(() => {
                    bottomDot.classList.remove('squash-glow');

                    if (codeComm1) {
                        codeComm1.classList.remove('line-highlight');
                        codeComm1.style.background = '';
                        codeComm1.style.borderLeftColor = 'transparent';
                    }
                    if (codeComm2) {
                        codeComm2.classList.remove('line-highlight');
                        codeComm2.style.background = '';
                        codeComm2.style.borderLeftColor = 'transparent';
                    }

                    if (fileStatus) {
                        fileStatus.textContent = 'Squashed';
                        fileStatus.style.color = '#10b981';
                        fileStatus.style.background = 'rgba(16, 185, 129, 0.15)';
                    }

                    isAnimating = false;
                    currentStep++;
                    updateUI(currentStep);
                    btnNext.disabled = false;
                    btnNext.style.opacity = '1';
                    btnNext.style.background = '#10b981';
                    btnNext.classList.add('hidden');
                    btnReset.classList.remove('hidden');

                    stepNumber.style.background = steps[currentStep].color;
                    stepNumber.style.boxShadow = `0 0 20px rgba(16, 185, 129, 0.4)`;
                }, 800);
            }, 600);
        }, 300);
    }
});

btnReset.addEventListener('click', () => {
    currentStep = 0;

    // Reset DOM elements
    topCommit.style.display = 'flex';

    initEditor();

    setTimeout(() => {
        topCommit.style.transform = 'translateY(0) scale(1)';
        topCommit.style.opacity = '1';
        topCommitFiller.style.opacity = '1';

        squashLine.style.transform = 'scaleY(1)';
        squashLine.style.opacity = '1';

        bottomText.textContent = origText;
        bottomText.style.fontWeight = "400";
        bottomHash.textContent = origHash;

        document.getElementById('top-labels').appendChild(wipTag);
        document.getElementById('top-labels').appendChild(headTag);
    }, 50);

    btnNext.classList.remove('hidden');
    btnReset.classList.add('hidden');
    btnNext.disabled = false;
    btnNext.style.opacity = '1';
    btnNext.style.background = '#a855f7';

    updateUI(currentStep);

    setTimeout(() => {
        const codeComm1 = document.getElementById('code-commit-1');
        const codeComm2 = document.getElementById('code-commit-2');
        if (codeComm1) codeComm1.classList.add('line-highlight');
        if (codeComm2) codeComm2.classList.remove('line-highlight');
        bottomDot.classList.add('squash-glow');
        bottomCommit.classList.add('commit-row-highlight');
        if (topDot) topDot.classList.remove('squash-glow');
        topCommit.classList.remove('commit-row-highlight');
    }, 50);
});

function updateUI(stepIndex) {
    const step = steps[stepIndex];
    stepNumber.textContent = step.num;
    stepTitle.textContent = step.title;
    stepDescription.textContent = step.desc;
    btnNext.textContent = step.actionBtn;

    stepNumber.style.background = step.color;
    stepNumber.style.boxShadow = `0 0 20px ${step.color}66`;
}
