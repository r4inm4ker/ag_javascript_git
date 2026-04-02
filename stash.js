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

const steps = [
    {
        num: 1,
        title: "Clean Working Directory",
        desc: "You have a clean working directory with a simple `auth.py` file.",
        actionBtn: "Start Writing Code",
        color: "#10b981" // Green
    },
    {
        num: 2,
        title: "Uncommitted Changes",
        desc: "You started experimentally drafting token generation logic, but suddenly you need to switch branches to fix an urgent bug! You aren't ready to commit this incomplete code.",
        actionBtn: "git stash",
        color: "#f59e0b" // Orange
    },
    {
        num: 3,
        title: "Safely Stashed",
        desc: "Running `git stash` isolates your uncommitted changes and stores them safely in an isolated stack. Your working directory is instantly completely clean again, ready to switch branches or fix bugs.",
        actionBtn: "git stash pop",
        color: "#10b981" // Green
    },
    {
        num: 4,
        title: "Restoring Changes",
        desc: "After fixing the bug, you run `git stash pop` to selectively pull the unfinished code out of the stash stack and resume exactly where you left off.",
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
        lineNumLast.textContent = '5'; // shifted down 2 lines
        
        // Ensure stash container is visible structurally
        stashContainer.style.opacity = '1';
        
        updateUI(currentStep);
        
    } else if (currentStep === 2) {
        // git stash
        // Hide dirty code
        uncommittedCode.style.opacity = '0';
        setTimeout(() => {
            uncommittedCode.style.display = 'none';
            lineNumLast.textContent = '3';
        }, 500);
        
        // Show stash item
        emptyStash.style.display = 'none';
        stashItem.classList.add('visible');
        
        updateUI(currentStep);
        
    } else if (currentStep === 3) {
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
            lineNumLast.textContent = '5';
        }, 50);
        
        updateUI(currentStep);
    }
});

btnReset.addEventListener('click', () => {
    currentStep = 0;
    
    // Reset Everything
    uncommittedCode.style.opacity = '0';
    uncommittedCode.style.display = 'none';
    lineNumLast.textContent = '3';
    
    stashContainer.style.opacity = '0';
    emptyStash.style.display = 'flex';
    stashItem.classList.remove('visible');
    
    btnNext.classList.remove('hidden');
    btnReset.classList.add('hidden');
    
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
