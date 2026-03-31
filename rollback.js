const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');

const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

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
        desc: "You've made two new commits locally on the 'wip' branch. Oh no! You realize the latest commit completely breaks the build and you want to pretend it never happened.",
        actionBtn: "git reset --hard HEAD~1",
        color: "#ef4444" // Red
    },
    {
        num: 2,
        title: "Rolling Back...",
        desc: "Git forcefully moves the 'wip' branch pointer and HEAD back by 1 commit (HEAD~1). Because of '--hard', it also forcefully deletes the broken changes from your local files.",
        actionBtn: "Rolling Back...",
        color: "#f59e0b" // Orange
    },
    {
        num: 3,
        title: "Rollback Complete",
        desc: "The broken commit has been detached and deleted from history natively. You are now safely back to a completely clean, working state on the previous commit!",
        actionBtn: "Restart Tutorial",
        color: "#10b981" // Green
    }
];

let currentStep = 0;
let isAnimating = false;

updateUI(0);

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
            
            setTimeout(() => {
                brokenCommit.style.opacity = '0';
                brokenLine.style.opacity = '0';
                
                setTimeout(() => {
                    // Finally remove from visual space entirely
                    brokenCommit.style.display = 'none';
                    brokenLine.style.display = 'none';
                    
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
    safeDot.style.boxShadow = '0 0 10px currentColor';
    safeText.style.color = 'var(--text-main)';
    
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
    stepDescription.textContent = step.desc;
    btnNext.textContent = step.actionBtn;
    
    stepNumber.style.background = step.color;
    stepNumber.style.boxShadow = `0 0 20px ${step.color}66`;
}
