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

const steps = [
    {
        num: 1,
        title: "The Messy History",
        desc: "You've been working on the 'wip' branch and made several small 'work in progress' commits. Before pushing, you want to clean up your history by combining (squashing) them into one.",
        actionBtn: "Interactive Rebase",
        color: "#a855f7" // Purple
    },
    {
        num: 2,
        title: "Squashing...",
        desc: "Git rebase intercepts the commits. We tell Git to 'pick' the first commit and 'squash' the second one into it. They mathematically compress into a single logical changeset.",
        actionBtn: "Squashing...",
        color: "#f59e0b" // Orange
    },
    {
        num: 3,
        title: "Squash Complete",
        desc: "The commits are now perfectly merged into one unified 'Feature: complete polyCube tool' commit with a brand new hash. Your branch is pristine!",
        actionBtn: "Restart Tutorial",
        color: "#10b981" // Green
    }
];

let currentStep = 0;
let isAnimating = false;

updateUI(0);

// For resetting purposes, store original values
const origText = "WIP: start polyCube script";
const origHash = "k8l9m0n";

btnNext.addEventListener('click', () => {
    if (isAnimating) return;
    
    currentStep++;
    
    if (currentStep === 1) {
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
            
            setTimeout(() => {
                // Flash and unify
                bottomDot.classList.add('squash-glow');
                topCommit.style.opacity = '0';
                topCommit.style.display = 'none';
                
                // Change text of bottom commit to unified text
                bottomText.textContent = "Feature: complete polyCube tool";
                bottomText.style.fontWeight = "600";
                bottomHash.textContent = "s2q3u4a";
                
                // Move tags down logically
                bottomLabels.appendChild(wipTag);
                bottomLabels.appendChild(headTag);
                
                setTimeout(() => {
                    bottomDot.classList.remove('squash-glow');
                    
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
