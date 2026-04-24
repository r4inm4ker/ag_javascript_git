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
