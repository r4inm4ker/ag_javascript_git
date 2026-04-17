const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');

const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

const localRepoMain = document.getElementById('local-repo-main');
const localRepoFeature = document.getElementById('local-repo-feature');

const featureTag = document.getElementById('feature-tag');
const headTagFeature = document.getElementById('head-tag-feature');
const baseLabelsFeature = document.getElementById('base-labels-feature');

const featureCommitLine = document.getElementById('feature-commit-line');
const newCommit = document.getElementById('new-commit');
const newCommitLabels = document.getElementById('new-commit-labels');

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
        desc: "Running 'git checkout -b feature' creates a new branch named 'feature'. We visualize this as a separate Local context on the right to show how branching creates an independent parallel workflow.",
        actionBtn: "git commit -m 'Implement Maya cmds...'",
        color: "#a855f7" // Purple
    },
    {
        num: 3,
        title: "Making a Commit",
        desc: "When you make a new commit, it is added to the current branch ('feature'). The 'feature' pointer and HEAD move forward to the new commit in your feature working context, while the 'main' context stays unchanged.",
        actionBtn: "Restart Tutorial",
        color: "#a855f7" // Purple
    }
];

let currentStep = 0;

updateUI(0);

btnNext.addEventListener('click', () => {
    currentStep++;
    
    if (currentStep === 1) {
        // Step 2: Show branch creation -> Fade in the Feature layout on the right
        localRepoMain.classList.remove('active-repo');
        localRepoMain.classList.add('dimmed');
        
        // Ensure styling triggers
        localRepoFeature.style.pointerEvents = 'auto';
        localRepoFeature.style.opacity = '1';
        localRepoFeature.style.transform = 'scale(1)';
        localRepoFeature.classList.add('active-repo');
        
        featureTag.classList.remove('hidden');
        featureTag.classList.add('pop-in');
        headTagFeature.classList.remove('hidden');
        headTagFeature.classList.add('pop-in');
        
        updateUI(currentStep);
    } else if (currentStep === 2) {
        // Step 3: Show new commit branching off
        btnNext.classList.add('hidden');
        btnReset.classList.remove('hidden');
        
        featureCommitLine.classList.remove('hidden');
        newCommit.classList.remove('hidden');
        
        // Move HEAD and feature tag to the new commit smoothly
        setTimeout(() => {
            newCommitLabels.appendChild(featureTag);
            newCommitLabels.appendChild(headTagFeature);
        }, 100);
        
        updateUI(currentStep);
    }
});

btnReset.addEventListener('click', () => {
    currentStep = 0;
    
    // Step 1: Hide second layout completely
    localRepoMain.classList.add('active-repo');
    localRepoMain.classList.remove('dimmed');
    
    localRepoFeature.style.opacity = '0';
    localRepoFeature.style.pointerEvents = 'none';
    localRepoFeature.style.transform = 'scale(0.95)';
    localRepoFeature.classList.remove('active-repo');
    
    // Reset branch tags back to base commit
    baseLabelsFeature.appendChild(featureTag);
    baseLabelsFeature.appendChild(headTagFeature);
    
    featureTag.classList.add('hidden');
    featureTag.classList.remove('pop-in');
    headTagFeature.classList.add('hidden');
    headTagFeature.classList.remove('pop-in');
    
    // Hide new commit
    featureCommitLine.classList.add('hidden');
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
