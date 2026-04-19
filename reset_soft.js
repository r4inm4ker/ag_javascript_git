const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');

const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

const codeContent = document.getElementById('code-content');
const fileStatus = document.getElementById('file-status');
const stagedBadge = document.getElementById('staged-badge');

const wipTag = document.getElementById('wip-tag');
const headTag = document.getElementById('head-tag');
const safeLabels = document.getElementById('safe-labels');
const brokenLabels = document.getElementById('broken-labels');

const brokenCommit = document.getElementById('broken-commit');
const brokenLine = document.getElementById('broken-line');
const brokenDot = document.getElementById('broken-dot');
const brokenText = document.getElementById('broken-text');

const safeDot = document.getElementById('safe-dot');
const safeText = document.getElementById('safe-text');

const steps = [
    {
        num: 1,
        title: "The Scale Commit",
        desc: "You committed a 'Scale cube' change to the 'wip' branch but realized the commit message needs to be fixed. You want to undo the commit but keep your changes staged and ready.",
        actionBtn: "git reset --soft HEAD~1",
        color: "#f59e0b" // Amber
    },
    {
        num: 2,
        title: "Soft Resetting...",
        desc: "Git moves the 'wip' branch pointer and HEAD back by 1 commit. Unlike --hard, your changes are NOT deleted — they are moved back to the staging area (index) so you can re-commit them.",
        actionBtn: "Resetting...",
        color: "#3b82f6" // Blue
    },
    {
        num: 3,
        title: "Reset Complete",
        desc: "The commit is gone from history, but all your code changes are still staged! You can now run 'git commit' again with a better message. Your work is completely safe.",
        actionBtn: "Restart Tutorial",
        color: "#10b981" // Green
    }
];

let currentStep = 0;
let isAnimating = false;

const baseCode = `
<div class="code-line"><span class="line-num">1</span><span class="code-content"><span style="color:#c084fc">import</span> <span style="color:#60a5fa">maya.cmds</span> as cmds</span></div>
<div class="code-line"><span class="line-num">2</span><span class="code-content"><span style="color:#c084fc">def</span> <span style="color:#60a5fa">create_cube</span>(name):</span></div>
<div class="code-line"><span class="line-num">3</span><span class="code-content">    cube = cmds.polyCube(n=name)</span></div>
<div class="code-line"><span class="line-num">4</span><span class="code-content">    cmds.move(0, 5, 0, cube[0])</span></div>
`;
const brokenCode = `
<div class="code-line line-del transition-fade" id="code-broken-1"><span class="line-num">5</span><span class="code-content">    <span style="color:#f59e0b"># also scale the cube</span></span></div>
<div class="code-line line-del transition-fade" id="code-broken-2"><span class="line-num">6</span><span class="code-content">    cmds.scale(100, 100, 100, cube[0])</span></div>
`;
const returnCode = `
<div class="code-line transition-fade" id="code-return"><span class="line-num" id="line-return-num">7</span><span class="code-content">    <span style="color:#c084fc">return</span> cube</span></div>
`;

function initEditor() {
    if (!codeContent) return;
    codeContent.innerHTML = baseCode + brokenCode + returnCode;
    fileStatus.textContent = 'Committed';
    fileStatus.style.color = '#f59e0b';
    fileStatus.style.background = 'rgba(245, 158, 11, 0.15)';
    if (stagedBadge) stagedBadge.classList.remove('visible');
}

updateUI(0);
initEditor();

btnNext.addEventListener('click', () => {
    if (isAnimating) return;

    currentStep++;

    if (currentStep === 1) {
        isAnimating = true;
        updateUI(currentStep);
        btnNext.disabled = true;
        btnNext.style.opacity = '0.5';

        // 1. Move labels back to the safe commit
        safeLabels.appendChild(wipTag);
        safeLabels.appendChild(headTag);

        // Light up safe commit
        safeDot.style.boxShadow = '0 0 20px #10b981';
        safeText.style.color = '#10b981';

        // 2. Animate the soft-reset commit fading (but NOT deleted — slide up & fade)
        setTimeout(() => {
            brokenCommit.style.opacity = '0.3';
            brokenCommit.style.transform = 'translateX(20px)';
            brokenLine.style.opacity = '0.3';

            // Show code as still present but now "staged" (amber highlight)
            const s1 = document.getElementById('code-broken-1');
            const s2 = document.getElementById('code-broken-2');
            if (s1) {
                s1.classList.remove('line-del');
                s1.style.background = 'rgba(245, 158, 11, 0.12)';
                s1.style.borderLeft = '3px solid #f59e0b';
            }
            if (s2) {
                s2.classList.remove('line-del');
                s2.style.background = 'rgba(245, 158, 11, 0.12)';
                s2.style.borderLeft = '3px solid #f59e0b';
            }
            
            brokenText.style.textDecoration = 'line-through';
            brokenText.style.color = 'var(--text-muted)';

            setTimeout(() => {
                brokenCommit.style.opacity = '0';
                brokenLine.style.opacity = '0';

                setTimeout(() => {
                    brokenCommit.style.display = 'none';
                    brokenLine.style.display = 'none';

                    // Update file status to Staged
                    if (fileStatus) {
                        fileStatus.textContent = 'Staged';
                        fileStatus.style.color = '#f59e0b';
                        fileStatus.style.background = 'rgba(245, 158, 11, 0.15)';
                    }
                    if (stagedBadge) stagedBadge.classList.add('visible');

                    const lineNum = document.getElementById('line-return-num');
                    if (lineNum) lineNum.textContent = '7'; // keep line numbers as-is (staged, not deleted)

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
                }, 500);
            }, 1000);
        }, 500);
    }
});

btnReset.addEventListener('click', () => {
    currentStep = 0;

    // Reset DOM elements
    brokenCommit.style.display = 'flex';
    brokenLine.style.display = 'block';

    // Reset safe
    safeDot.style.boxShadow = 'none';
    safeText.style.color = 'var(--text-main)';

    initEditor();

    setTimeout(() => {
        brokenCommit.style.opacity = '1';
        brokenCommit.style.transform = 'translateX(0)';
        brokenLine.style.opacity = '1';

        brokenDot.style.background = '#a855f7';
        brokenDot.style.color = '#a855f7';
        brokenText.style.textDecoration = 'none';
        brokenText.style.color = '#f59e0b';

        brokenLabels.appendChild(wipTag);
        brokenLabels.appendChild(headTag);
    }, 50);

    btnNext.classList.remove('hidden');
    btnReset.classList.add('hidden');
    btnNext.disabled = false;
    btnNext.style.opacity = '1';
    btnNext.style.background = '#f59e0b';

    updateUI(currentStep);
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
