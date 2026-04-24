const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');

const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

const uncommittedCode = document.getElementById('uncommitted-code');
const lineNumLast = document.getElementById('line-num-last');

const stashContainer = document.getElementById('stash-container');
const emptyStash = document.getElementById('empty-stash');
const stashItem = document.getElementById('stash-item');

const newCommit = document.getElementById('new-commit');
const newCommitLine = document.getElementById('new-commit-line');

const steps = [
    {
        num: 1,
        title: "Clean Working Directory",
        desc: "You have a clean working directory with a simple `create_geo.py` file.",
        actionBtn: "Start Writing Code",
        color: "#10b981" // Green
    },
    {
        num: 2,
        title: "Uncommitted Changes",
        desc: "You started experimentally drafting Maya cmds logic, but suddenly you need to switch branches to fix an urgent bug! You aren't ready to commit this incomplete code.",
        actionBtn: "git stash",
        color: "#f59e0b",
        command: "git stash" // Orange
    },
    {
        num: 3,
        title: "Safely Stashed",
        desc: "Running `git stash` isolates your uncommitted changes and stores them safely in an isolated stack. Your working directory is instantly completely clean again, ready to switch branches or fix bugs.",
        actionBtn: "git merge main",
        color: "#3b82f6",
        command: "git merge main" // Blue
    },
    {
        num: 4,
        title: "Merging the Bugfix",
        desc: "With your working directory newly clean, you freely merged the hotfix from `main` into your local `wip` branch history without any conflicting unsaved files blocking you.",
        actionBtn: "git stash pop",
        color: "#10b981",
        command: "git stash pop" // Green
    },
    {
        num: 5,
        title: "Restoring Changes",
        desc: "After handling the hotfix merge, you run `git stash pop` to selectively pull your unfinished draft out of the stash stack and resume exactly where you left off, functionally directly on top of the newly integrated history!",
        actionBtn: "Restart Tutorial",
        color: "#a855f7" // Purple
    }
];

let currentStep = 0;
updateUI(0);

btnNext.addEventListener('click', () => {
    currentStep++;
    
    if (currentStep === 1) {
        // Show dirty code changes
        uncommittedCode.style.display = 'block';
        setTimeout(() => {
            uncommittedCode.style.opacity = '1';
        }, 50);
        lineNumLast.textContent = '6'; // shifted down 2 lines
        
        // Ensure stash container is visible structurally
        stashContainer.style.opacity = '1';
        
        updateUI(currentStep);
        
    } else if (currentStep === 2) {
        // git stash
        // Hide dirty code
        uncommittedCode.style.opacity = '0';
        setTimeout(() => {
            uncommittedCode.style.display = 'none';
            lineNumLast.textContent = '4';
        }, 500);
        
        // Show stash item
        emptyStash.style.display = 'none';
        stashItem.classList.add('visible');
        
        updateUI(currentStep);
        
    } else if (currentStep === 3) {
        // git merge main
        
        // Show the new merge commit in the history stack
        newCommit.style.display = 'flex';
        newCommitLine.style.display = 'block';
        
        setTimeout(() => {
            newCommit.style.opacity = '1';
            newCommitLine.style.opacity = '1';
        }, 50);
        
        updateUI(currentStep);
        
    } else if (currentStep === 4) {
        // git stash pop
        btnNext.classList.add('hidden');
        btnReset.classList.remove('hidden');
        
        // Hide stash item
        stashItem.classList.remove('visible');
        setTimeout(() => {
            emptyStash.style.display = 'flex';
        }, 500);
        
        // Reapply code changes
        uncommittedCode.style.display = 'block';
        setTimeout(() => {
            uncommittedCode.style.opacity = '1';
            lineNumLast.textContent = '6';
        }, 50);
        
        updateUI(currentStep);
    }
});

btnReset.addEventListener('click', () => {
    currentStep = 0;
    
    // Reset Everything
    uncommittedCode.style.opacity = '0';
    uncommittedCode.style.display = 'none';
    lineNumLast.textContent = '4';
    
    stashContainer.style.opacity = '0';
    emptyStash.style.display = 'flex';
    stashItem.classList.remove('visible');
    
    newCommit.style.opacity = '0';
    newCommitLine.style.opacity = '0';
    setTimeout(() => {
        newCommit.style.display = 'none';
        newCommitLine.style.display = 'none';
    }, 500);
    
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
