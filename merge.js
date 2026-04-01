const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');

const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

const wipTag = document.getElementById('wip-tag');
const headTag = document.getElementById('head-tag');
const wipLabelsBase = document.getElementById('wip-labels-base');

const mainTargetDot = document.getElementById('main-target-dot');
const mergeTargetArea = document.getElementById('merge-target-area');

const steps = [
    {
        num: 1,
        title: "The Diverged State",
        desc: "You are on 'wip' (left) which has an older unique commit. The 'main' branch (right) has a newer unique commit. You need to merge main into wip.",
        actionBtn: "git merge main",
        color: "#8b5cf6" // Purple
    },
    {
        num: 2,
        title: "Merging...",
        desc: "Since 'main' has a newer commit, Git carries it over and stacks it temporally on top of your older 'wip' commit, creating a clean chronological timeline.",
        actionBtn: "Merging...",
        color: "#f59e0b" // Orange
    },
    {
        num: 3,
        title: "Integrated",
        desc: "Merge complete! The 'Update dependencies' commit is successfully stacked on top of your branch timeline, capped with a merge confirmation.",
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
        
        mainTargetDot.style.boxShadow = '0 0 25px #10b981';
        
        // Stack the main commit directly under the wip commit, 
        // then the merge commit directly under it.
        const structure = `
            <div class="commit-line" style="margin-left: calc(1.2rem + 38px); background: #06b6d4; width: 2px; height: 1.5rem; margin-top: 0.2rem; margin-bottom: -0.2rem; display:none;" id="target-main-line"></div>
            <div class="commit-node feature-track relative-node" id="target-main-commit" style="display:none;">
                <div class="commit-dot main-bg" id="target-main-dot"></div>
                <div class="commit-msg">
                    <span class="main-color">Update dependencies</span>
                    <span class="commit-hash">x5y6z7w</span>
                </div>
            </div>
            
            <div class="commit-line" style="margin-left: calc(1.2rem + 38px); background: #8b5cf6; width: 2px; height: 1.5rem; margin-top: 0.2rem; margin-bottom: -0.2rem; display:none;" id="target-merge-line"></div>
            <div class="commit-node feature-track relative-node" id="target-merge-commit" style="display:none;">
                <div class="commit-dot" style="background: #8b5cf6;" id="target-merge-dot"></div>
                <div class="commit-msg">
                    <span style="color: #8b5cf6; font-weight: 600;">Merge branch 'main'</span>
                    <span class="commit-hash">m1n2o3p</span>
                </div>
                <div class="labels-container" id="new-wip-labels"></div>
            </div>
        `;
            
        mergeTargetArea.insertAdjacentHTML('beforeend', structure);
        
        const targetMainLine = document.getElementById('target-main-line');
        const targetMainCommit = document.getElementById('target-main-commit');
        const targetMainDot = document.getElementById('target-main-dot');
        
        const targetMergeLine = document.getElementById('target-merge-line');
        const targetMergeCommit = document.getElementById('target-merge-commit');
        const targetMergeDot = document.getElementById('target-merge-dot');
        const newWipLabels = document.getElementById('new-wip-labels');
        
        setTimeout(() => {
            // Particle travels to the newly appended main commit dot
            animateMergePull(mainTargetDot, targetMainDot, targetMainCommit).then(() => {
                mainTargetDot.style.boxShadow = 'none';
                
                // Pop in the imported main commit
                targetMainLine.style.display = 'block';
                targetMainLine.style.animation = 'popIn 0.3s ease forwards';
                targetMainCommit.style.display = 'flex';
                targetMainCommit.style.animation = 'popIn 0.5s ease forwards';
                
                // Then immediately pop in the merge commit right below it
                setTimeout(() => {
                    targetMergeLine.style.display = 'block';
                    targetMergeLine.style.animation = 'popIn 0.3s ease forwards';
                    targetMergeCommit.style.display = 'flex';
                    targetMergeCommit.style.animation = 'popIn 0.5s ease forwards';
                    
                    setTimeout(() => {
                        targetMergeDot.style.boxShadow = "0 0 25px #8b5cf6";
                        
                        // Move tags down to final merge commit
                        newWipLabels.appendChild(wipTag);
                        newWipLabels.appendChild(headTag);
                        
                        setTimeout(() => {
                            targetMergeDot.style.boxShadow = "none";
                            
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
                    }, 400);
                }, 400);
            });
        }, 500);
    }
});

btnReset.addEventListener('click', () => {
    currentStep = 0;
    
    mainTargetDot.style.boxShadow = "none";
    
    // Reset tags back to wip base
    wipLabelsBase.appendChild(wipTag);
    wipLabelsBase.appendChild(headTag);
    
    // Clear dynamic DOM edits
    mergeTargetArea.innerHTML = '';
    
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

function animateMergePull(sourceEl, targetEl, parentNode) {
    return new Promise(resolve => {
        parentNode.style.display = 'flex';
        parentNode.style.opacity = '0';
        
        const srcRect = sourceEl.getBoundingClientRect();
        const dstRect = targetEl.getBoundingClientRect();
        
        parentNode.style.display = 'none';
        parentNode.style.opacity = '1';
        
        const particle = document.createElement('div');
        particle.className = 'merge-particle';
        
        particle.style.left = `${srcRect.left - 1}px`;
        particle.style.top = `${srcRect.top - 1}px`;
        document.body.appendChild(particle);
        
        const deltaX = dstRect.left - srcRect.left;
        const deltaY = dstRect.top - srcRect.top;
        
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes mergeArcPull {
                0% { transform: translate(0, 0) scale(1); opacity: 1; filter: hue-rotate(0deg); }
                50% { transform: translate(${deltaX/2}px, ${deltaY - 60}px) scale(1.5); opacity: 1; filter: hue-rotate(-20deg); }
                100% { transform: translate(${deltaX}px, ${deltaY}px) scale(1); opacity: 0; filter: hue-rotate(0deg); }
            }
        `;
        document.head.appendChild(style);
        particle.style.animation = 'mergeArcPull 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards';
        
        setTimeout(() => {
            particle.remove();
            style.remove();
            resolve();
        }, 850);
    });
}
