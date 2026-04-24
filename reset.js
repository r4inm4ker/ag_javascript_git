const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');

const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

const codeContent = document.getElementById('code-content');
const fileStatus = document.getElementById('file-status');

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
        title: "The Broken Code",
        desc: "You've made a new commit locally on the 'wip' branch. Oh no! You realize the commit completely breaks the build and you want to pretend it never happened.",
        actionBtn: "git reset --hard HEAD~1",
        color: "#ef4444",
        command: "git reset --hard HEAD~1" // Red
    },
    {
        num: 2,
        title: "Resetting...",
        desc: "Git forcefully moves the 'wip' branch pointer and HEAD back by 1 commit (HEAD~1). Because of '--hard', it also forcefully deletes the broken changes from your local files.",
        actionBtn: "Resetting...",
        color: "#f59e0b" // Orange
    },
    {
        num: 3,
        title: "Reset Complete",
        desc: "The broken commit has been detached and deleted from history natively. You are now safely back to a completely clean, working state on the previous commit!",
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
<div class="code-line line-del transition-fade" id="code-broken-1"><span class="line-num">5</span><span class="code-content">    <span style="color:#ef4444"># also scale the cube</span></span></div>
<div class="code-line line-del transition-fade" id="code-broken-2"><span class="line-num">6</span><span class="code-content">    cmds.scale(100, 100, 100, cube[0])</span></div>
`;
const returnCode = `
<div class="code-line transition-fade" id="code-return"><span class="line-num" id="line-return-num">7</span><span class="code-content">    <span style="color:#c084fc">return</span> cube</span></div>
`;

function initEditor() {
    if (!codeContent) return;
    codeContent.innerHTML = baseCode + brokenCode + returnCode;
    fileStatus.textContent = 'Broken';
    fileStatus.style.color = '#ef4444';
    fileStatus.style.background = 'rgba(239, 68, 68, 0.15)';
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

        // 1. Move labels back safely to the previous commit
        safeLabels.appendChild(wipTag);
        safeLabels.appendChild(headTag);

        // Turn previous commit green temporarily to show success
        safeDot.style.boxShadow = '0 0 20px #10b981';
        safeText.style.color = '#10b981';

        // 2. Animate the disconnected commit away
        setTimeout(() => {
            brokenCommit.style.opacity = '0.3';
            brokenCommit.style.transform = 'translateX(30px)';
            brokenLine.style.opacity = '0.3';

            // Turn dot red and text grey to show it's dead
            brokenDot.style.background = '#ef4444';
            brokenDot.style.color = '#ef4444';
            brokenText.style.textDecoration = 'line-through';
            brokenText.style.color = 'var(--text-muted)';

            const broken1 = document.getElementById('code-broken-1');
            const broken2 = document.getElementById('code-broken-2');
            if (broken1) broken1.style.opacity = '0';
            if (broken2) broken2.style.opacity = '0';

            setTimeout(() => {
                brokenCommit.style.opacity = '0';
                brokenLine.style.opacity = '0';

                setTimeout(() => {
                    // Finally remove from visual space entirely
                    brokenCommit.style.display = 'none';
                    brokenLine.style.display = 'none';

                    const broken1 = document.getElementById('code-broken-1');
                    const broken2 = document.getElementById('code-broken-2');
                    const lineNum = document.getElementById('line-return-num');

                    if (broken1) broken1.style.display = 'none';
                    if (broken2) broken2.style.display = 'none';
                    if (lineNum) lineNum.textContent = '5';

                    if (fileStatus) {
                        fileStatus.textContent = 'Clean';
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

                    // Highlight step 3 UI special case
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
        brokenText.style.color = '#ef4444';

        brokenLabels.appendChild(wipTag);
        brokenLabels.appendChild(headTag);
    }, 50);

    btnNext.classList.remove('hidden');
    btnReset.classList.add('hidden');
    btnNext.disabled = false;
    btnNext.style.opacity = '1';
    btnNext.style.background = '#ef4444';

    updateUI(currentStep);
});

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