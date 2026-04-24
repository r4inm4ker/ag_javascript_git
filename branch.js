const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');

const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

const localRepoMain = document.getElementById('local-repo-main');
const localRepoWip = document.getElementById('local-repo-wip');

const wipTag = document.getElementById('wip-tag');
const headTagWip = document.getElementById('head-tag-wip');
const baseLabelsWip = document.getElementById('base-labels-wip');

const wipCommitLine = document.getElementById('wip-commit-line');
const newCommit = document.getElementById('new-commit');
const newCommitLabels = document.getElementById('new-commit-labels');

const codeContent = document.getElementById('code-content');
const fileStatus = document.getElementById('file-status');

const baseCode = `
<div class="code-line" style="border-left: 3px solid transparent;"><span class="line-num">1</span><span class="code-content"><span style="color:#c084fc">import</span> <span style="color:#60a5fa">maya.cmds</span> as cmds</span></div>
<div class="code-line" style="border-left: 3px solid transparent;"><span class="line-num">2</span><span class="code-content"><span style="color:#c084fc">def</span> <span style="color:#60a5fa">create_cube</span>(name):</span></div>
<div class="code-line" style="border-left: 3px solid transparent;"><span class="line-num">3</span><span class="code-content">    cube = cmds.polyCube(n=name)</span></div>
`;

const addedCode = `
<div class="code-line line-add" style="opacity:0; animation: slideInRight 0.3s forwards;"><span class="line-num">4</span><span class="code-content">    cmds.move(0, 5, 0, cube[0])</span></div>
<div class="code-line line-add" style="opacity:0; animation: slideInRight 0.3s forwards 0.1s;"><span class="line-num">5</span><span class="code-content">    <span style="color:#c084fc">return</span> cube</span></div>
`;

const steps = [
    {
        num: 1,
        title: "The Local Repository",
        desc: "You are currently on the 'main' branch. The HEAD pointer indicates your current working context.",
        actionBtn: "git checkout -b wip",
        color: "#10b981",
        command: "git checkout -b wip" // Green
    },
    {
        num: 2,
        title: "Creating a Branch",
        desc: "Running 'git checkout -b wip' creates a new branch named 'wip'. We visualize this as a separate Local context on the right to show how branching creates an independent parallel workflow.",
        actionBtn: "git commit -m 'Implement Maya cmds...'",
        color: "#a855f7",
        command: "git commit -m 'Implement Maya cmds...'" // Purple
    },
    {
        num: 3,
        title: "Making a Commit",
        desc: "When you make a new commit, it is added to the current branch ('wip'). The 'wip' pointer and HEAD move forward to the new commit in your wip working context, while the 'main' context stays unchanged.",
        actionBtn: "Restart Tutorial",
        color: "#a855f7" // Purple
    }
];

let currentStep = 0;

codeContent.innerHTML = baseCode;

updateUI(0);

btnNext.addEventListener('click', () => {
    currentStep++;
    
    if (currentStep === 1) {
        // Step 2: Show branch creation -> Fade in the WIP layout on the right
        localRepoMain.classList.remove('active-repo');
        localRepoMain.classList.add('dimmed');
        
        // Ensure styling triggers
        localRepoWip.style.pointerEvents = 'auto';
        localRepoWip.style.opacity = '1';
        localRepoWip.style.transform = 'scale(1)';
        localRepoWip.classList.add('active-repo');
        
        wipTag.classList.remove('hidden');
        wipTag.classList.add('pop-in');
        headTagWip.classList.remove('hidden');
        headTagWip.classList.add('pop-in');
        
        setTimeout(() => {
            codeContent.insertAdjacentHTML('beforeend', addedCode);
            fileStatus.innerHTML = 'Modified (Unstaged)';
            fileStatus.style.color = '#f59e0b';
            fileStatus.style.background = 'rgba(245, 158, 11, 0.15)';
        }, 500);
        
        updateUI(currentStep);
    } else if (currentStep === 2) {
        // Step 3: Show new commit branching off
        btnNext.classList.add('hidden');
        btnReset.classList.remove('hidden');
        
        wipCommitLine.classList.remove('hidden');
        newCommit.classList.remove('hidden');
        
        // Move HEAD and wip tag to the new commit smoothly
        setTimeout(() => {
            newCommitLabels.appendChild(wipTag);
            newCommitLabels.appendChild(headTagWip);
        }, 100);
        
        fileStatus.innerHTML = 'Unmodified';
        fileStatus.style.color = '#94a3b8';
        fileStatus.style.background = 'rgba(255,255,255,0.1)';
        document.querySelectorAll('.line-add').forEach(el => {
            el.style.borderLeft = '3px solid transparent';
            el.style.background = 'transparent';
        });

        updateUI(currentStep);
    }
});

btnReset.addEventListener('click', () => {
    currentStep = 0;
    
    // Step 1: Hide second layout completely
    localRepoMain.classList.add('active-repo');
    localRepoMain.classList.remove('dimmed');
    
    localRepoWip.style.opacity = '0';
    localRepoWip.style.pointerEvents = 'none';
    localRepoWip.style.transform = 'scale(0.95)';
    localRepoWip.classList.remove('active-repo');
    
    // Reset branch tags back to base commit
    baseLabelsWip.appendChild(wipTag);
    baseLabelsWip.appendChild(headTagWip);
    
    wipTag.classList.add('hidden');
    wipTag.classList.remove('pop-in');
    headTagWip.classList.add('hidden');
    headTagWip.classList.remove('pop-in');
    
    // Hide new commit
    wipCommitLine.classList.add('hidden');
    newCommit.classList.add('hidden');
    
    btnNext.classList.remove('hidden');
    btnReset.classList.add('hidden');
    
    codeContent.innerHTML = baseCode;
    fileStatus.innerHTML = 'Unmodified';
    fileStatus.style.color = '#94a3b8';
    fileStatus.style.background = 'rgba(255,255,255,0.1)';
    
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
