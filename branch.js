const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');

const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

const featureTag = document.getElementById('feature-tag');
const headTag = document.getElementById('head-tag');
const branchSplit = document.getElementById('branch-split');
const newCommit = document.getElementById('new-commit');
const newCommitLabels = document.getElementById('new-commit-labels');
const baseLabels = document.getElementById('base-labels');
const currentBranchBadge = document.getElementById('current-branch-badge');
const headerBranchName = document.getElementById('header-branch-name');

const steps = [
    {
        num: 1,
        title: "The Local Repository",
        desc: "You are currently on the 'main' branch. The HEAD pointer indicates your current working context.",
        actionBtn: "git checkout -b feature",
        color: "#10b981" // Green
    },
    {
        num: 2,
        title: "Creating a Branch",
        desc: "Running 'git checkout -b feature' creates a new branch named 'feature' pointing to the same commit as 'main', and moves HEAD to it.",
        actionBtn: "git commit -m 'Implement login...'",
        color: "#a855f7" // Purple
    },
    {
        num: 3,
        title: "Making a Commit",
        desc: "When you make a new commit, it is added to the current branch ('feature'). The 'feature' pointer and HEAD move forward to the new commit, while 'main' stays behind.",
        actionBtn: "Restart Tutorial",
        color: "#a855f7" // Purple
    }
];

let currentStep = 0;

updateUI(0);

btnNext.addEventListener('click', () => {
    currentStep++;
    
    if (currentStep === 1) {
        // Step 2: Show branch creation
        featureTag.classList.remove('hidden');
        featureTag.classList.add('pop-in');
        
        // Update header visually
        currentBranchBadge.style.color = '#a855f7';
        headerBranchName.textContent = 'feature';
        
        updateUI(currentStep);
    } else if (currentStep === 2) {
        // Step 3: Show new commit branching off
        btnNext.classList.add('hidden');
        btnReset.classList.remove('hidden');
        
        branchSplit.classList.remove('hidden');
        branchSplit.style.animation = 'drawPath 0.5s ease forwards';
        
        newCommit.classList.remove('hidden');
        
        // Move HEAD and feature tag to the new commit smoothly
        setTimeout(() => {
            newCommitLabels.appendChild(featureTag);
            newCommitLabels.appendChild(headTag);
        }, 100);
        
        updateUI(currentStep);
    }
});

btnReset.addEventListener('click', () => {
    currentStep = 0;
    
    // Reset branch tags back to base commit
    baseLabels.appendChild(featureTag);
    baseLabels.appendChild(headTag);
    
    featureTag.classList.add('hidden');
    featureTag.classList.remove('pop-in');
    
    // Reset header
    currentBranchBadge.style.color = 'var(--text-muted)';
    headerBranchName.textContent = 'main';
    
    // Hide new commit
    branchSplit.classList.add('hidden');
    newCommit.classList.add('hidden');
    
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
