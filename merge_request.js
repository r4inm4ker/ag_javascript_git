const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');

const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

const mainTag = document.getElementById('main-tag');
const reviewBadge = document.getElementById('review-badge');
const mergeTarget = document.getElementById('merge-target');

const steps = [
    {
        num: 1,
        title: "The Pull Request",
        desc: "Your feature branch has been pushed to the remote repository. A Merge Request connects your branch to 'main', allowing your team to review the code before merging.",
        actionBtn: "Review Code",
        color: "#f59e0b" // Orange
    },
    {
        num: 2,
        title: "Code Review",
        desc: "Teammates can comment on your code, suggest changes, and eventually approve it (Looks Good To Me!). Once approved, it is ready to merge.",
        actionBtn: "Merge Pull Request",
        color: "#10b981" // Green
    },
    {
        num: 3,
        title: "Merge Complete",
        desc: "The feature branch commits are merged back into 'main' via a new 'Merge commit'. The 'main' branch pointer and HEAD move forward to encompass your work!",
        actionBtn: "Restart Tutorial",
        color: "#3b82f6" // Blue
    }
];

let currentStep = 0;

updateUI(0);

btnNext.addEventListener('click', () => {
    currentStep++;
    
    if (currentStep === 1) {
        // Step 2: Show Review Badge
        reviewBadge.classList.add('pop-in');
        
        updateUI(currentStep);
    } else if (currentStep === 2) {
        // Step 3: Trigger Merge
        btnNext.classList.add('hidden');
        btnReset.classList.remove('hidden');
        
        // Ensure gap continuity
        const mergeSplitHTML = `<div class="merge-split" style="opacity:0; animation: drawPath 0.5s ease forwards; animation-delay: 0.1s;"></div>`;
        const newCommitHTML = `
            <div class="commit-node main-track relative-node merge-commit" style="opacity:0; animation: popIn 0.4s ease forwards; animation-delay: 0.5s;">
                <div class="commit-dot main-bg"></div>
                <div class="commit-msg">
                    <span>Merge pull request #1</span>
                    <span class="commit-hash">m9n8p7q</span>
                </div>
                <div class="labels-container" id="new-main-labels">
                    <!-- main tag moves here -->
                </div>
            </div>`;
            
        mergeTarget.insertAdjacentHTML('beforeend', mergeSplitHTML);
        mergeTarget.insertAdjacentHTML('beforeend', newCommitHTML);
        
        // Move the tag upward
        setTimeout(() => {
            document.getElementById('new-main-labels').appendChild(mainTag);
        }, 600);
        
        updateUI(currentStep);
    }
});

btnReset.addEventListener('click', () => {
    currentStep = 0;
    
    // Reset Review
    reviewBadge.classList.remove('pop-in');
    
    // Reset main tag
    document.getElementById('base-labels').appendChild(mainTag);
    
    // Clear merge
    mergeTarget.innerHTML = '';
    
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
