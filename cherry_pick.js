const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');

const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

const wipTag = document.getElementById('wip-tag');
const headTag = document.getElementById('head-tag');

const sourceDot = document.getElementById('source-target-dot');
const wipTarget = document.getElementById('wip-target');
const wipLabels = document.getElementById('wip-labels-base');
const testRepo = document.getElementById('test-repo');

const steps = [
    {
        num: 1,
        title: "The Target Commit",
        desc: "You are checked out on 'wip' (left). Your colleague added a useful coordinate transform code on 'test' (right). You want that specific code without merging their whole branch.",
        actionBtn: "git cherry-pick z9y8x7w",
        color: "#06b6d4" // Cyan
    },
    {
        num: 2,
        title: "Cherry-Picking...",
        desc: "Git mathematically extracts exactly the changes made in that single specific commit, ignores the rest of the 'test' branch, and floats a copy over to your active branch.",
        actionBtn: "Cherry-Picking...",
        color: "#f59e0b" // Orange
    },
    {
        num: 3,
        title: "Cherry-Pick Complete",
        desc: "The commit has been successfully applied to your 'wip' branch! It receives a fresh commit signature but contains identical code changes.",
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
        
        // Temporarily activate the right pane visually
        testRepo.classList.remove('dimmed');
        testRepo.classList.add('active-repo');
        
        // Setup target hidden node vertically on left track
        // To match standard feature-track, margin-left: calc(1.2rem + 38px);
        const commitLine = `<div class="commit-line" style="margin-left: calc(1.2rem + 38px); background: #06b6d4; width: 2px; height: 1.5rem; margin-top: 0.2rem; margin-bottom: -0.2rem; display:none;" id="target-line"></div>`;
        const commitNode = `
            <div class="commit-node feature-track relative-node" id="target-commit" style="display:none;">
                <div class="commit-dot wip-bg" id="target-dot"></div>
                <div class="commit-msg">
                    <span class="wip-color">Translate cube up</span>
                    <span class="commit-hash">c8d7e6f</span>
                </div>
                <div class="labels-container" id="new-wip-labels"></div>
            </div>`;
            
        wipTarget.insertAdjacentHTML('beforeend', commitLine);
        wipTarget.insertAdjacentHTML('beforeend', commitNode);
        
        const targetNode = document.getElementById('target-commit');
        const targetLine = document.getElementById('target-line');
        const targetDot = document.getElementById('target-dot');
        const newWipLabels = document.getElementById('new-wip-labels');
        
        // Highlight source
        sourceDot.style.boxShadow = '0 0 25px #f59e0b';
        
        // Animate dynamic arc directly across panes using our generic calculation algorithm
        animateCherryPick(sourceDot, targetDot, targetNode).then(() => {
            sourceDot.style.boxShadow = '0 0 10px currentColor';
            
            // Pop in new exact line and commit
            targetLine.style.display = 'block';
            targetLine.style.animation = 'popIn 0.3s ease forwards';
            
            targetNode.style.display = 'flex';
            targetNode.style.animation = 'popIn 0.5s ease forwards';
            
            // Move tracking tags up
            setTimeout(() => {
                newWipLabels.appendChild(wipTag);
                newWipLabels.appendChild(headTag);
                
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
            }, 500);
        });
    }
});

btnReset.addEventListener('click', () => {
    currentStep = 0;
    
    // Dim the test repo again
    testRepo.classList.add('dimmed');
    testRepo.classList.remove('active-repo');
    
    // Reset tags
    wipLabels.appendChild(wipTag);
    wipLabels.appendChild(headTag);
    
    // Clear dynamic DOM edits
    wipTarget.innerHTML = '';
    
    btnNext.classList.remove('hidden');
    btnReset.classList.add('hidden');
    btnNext.disabled = false;
    btnNext.style.opacity = '1';
    btnNext.style.background = steps[0].color;
    
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

function animateCherryPick(sourceEl, targetEl, parentNode) {
    return new Promise(resolve => {
        // Evaluate geometry by forcing layout secretly on parent
        parentNode.style.display = 'flex';
        parentNode.style.opacity = '0';
        
        const srcRect = sourceEl.getBoundingClientRect();
        const dstRect = targetEl.getBoundingClientRect();
        
        // Return to hidden
        parentNode.style.display = 'none';
        parentNode.style.opacity = '1';
        
        const particle = document.createElement('div');
        particle.className = 'cherry-particle';
        
        // Exact pixel map alignment visually to DOM
        particle.style.left = `${srcRect.left - 1}px`;
        particle.style.top = `${srcRect.top - 1}px`;
        document.body.appendChild(particle);
        
        const deltaX = dstRect.left - srcRect.left;
        const deltaY = dstRect.top - srcRect.top;
        
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes dynamicArc {
                0% { transform: translate(0, 0) scale(1); opacity: 1; filter: hue-rotate(0deg); }
                50% { transform: translate(${deltaX/2}px, ${deltaY - 60}px) scale(1.5); opacity: 1; filter: hue-rotate(-20deg); }
                100% { transform: translate(${deltaX}px, ${deltaY}px) scale(1); opacity: 0; filter: hue-rotate(-40deg); }
            }
        `;
        document.head.appendChild(style);
        particle.style.animation = 'dynamicArc 1s cubic-bezier(0.25, 1, 0.5, 1) forwards';
        
        setTimeout(() => {
            particle.remove();
            style.remove();
            resolve();
        }, 1000);
    });
}
