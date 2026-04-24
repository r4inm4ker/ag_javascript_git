const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');

const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

const wipTag = document.getElementById('wip-tag');
const headTag = document.getElementById('head-tag');
const mainLabels = document.getElementById('main-labels');

const mainTargetDot = document.getElementById('main-target-dot');
const newBaseArea = document.getElementById('new-base-area');
const wipWrapper = document.getElementById('wip-wrapper');
const wipHash = document.getElementById('wip-hash');
const wipCommitDot = document.getElementById('wip-commit-dot');

const steps = [
    {
        num: 1,
        title: "The Diverged State",
        desc: "You are working on 'wip' (left). Meanwhile, a new commit was merged into 'main' (right). The base of your work is now outdated.",
        actionBtn: "git rebase main",
        color: "#06b6d4",
        command: "git rebase main" // Cyan
    },
    {
        num: 2,
        title: "Rewriting History...",
        desc: "Git unwinds your 'wip' commits, pulls in the latest 'main' commits as the new base of your branch, and then structurally replays your changes on top.",
        actionBtn: "Rewriting...",
        color: "#f59e0b" // Orange
    },
    {
        num: 3,
        title: "Fast-Forward Ready",
        desc: "The rebase is complete! Your local 'wip' branch now tracks directly ahead of the latest 'main' commit. Note the newly generated commit hash.",
        actionBtn: "Restart Tutorial",
        color: "#10b981" // Green
    }
];

let currentStep = 0;
let isAnimating = false;
let initialHash = "u8v7w6x";

updateUI(0);

btnNext.addEventListener('click', () => {
    if (isAnimating) return;
    
    currentStep++;
    
    if (currentStep === 1) {
        isAnimating = true;
        updateUI(currentStep);
        btnNext.disabled = true;
        btnNext.style.opacity = '0.5';
        
        // Highlight the source commit from main
        mainTargetDot.style.boxShadow = '0 0 25px #10b981';
        
        // Setup the new base commit structure in the left pane (hidden)
        const commitLine = `<div class="commit-line main-bg" style="display:none;" id="target-line"></div>`;
        const commitNode = `
            <div class="commit-node main-track relative-node" id="target-commit" style="display:none;">
                <div class="commit-dot main-bg" id="target-dot"></div>
                <div class="commit-msg">
                    <span class="main-color">Import rig modules</span>
                    <span class="commit-hash">x5y6z7w</span>
                </div>
            </div>`;
            
        newBaseArea.insertAdjacentHTML('beforeend', commitLine);
        newBaseArea.insertAdjacentHTML('beforeend', commitNode);
        
        const targetNode = document.getElementById('target-commit');
        const targetLine = document.getElementById('target-line');
        const targetDot = document.getElementById('target-dot');
        
        // Shift the WIP wrapper down slightly so it visually detaches
        wipWrapper.style.transform = 'translateY(2rem)';
        
        setTimeout(() => {
            // Animate dynamic arc from right to left
            animateRebasePull(mainTargetDot, targetDot, targetNode).then(() => {
                mainTargetDot.style.boxShadow = 'none';
                
                // Pop in the main dependency commits to the left track
                targetLine.style.display = 'block';
                targetLine.style.animation = 'popIn 0.3s ease forwards';
                
                targetNode.style.display = 'flex';
                targetNode.style.animation = 'popIn 0.5s ease forwards';
                
                // Now snap the WIP commit back up into the newly arranged space
                // Wait for the popping to start, then shift WIP
                setTimeout(() => {
                    wipWrapper.style.transform = 'translateY(0)';
                    
                    // Flash the WIP commit to show it's rewritten
                    setTimeout(() => {
                        wipHash.textContent = "d4e5f6g";
                        wipHash.style.color = "#f59e0b";
                        wipCommitDot.style.boxShadow = "0 0 25px #f59e0b";
                        
                        setTimeout(() => {
                            wipHash.style.color = "var(--text-muted)";
                            wipCommitDot.style.boxShadow = "none";
                            
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
                    }, 800);
                }, 400);
            });
        }, 500);
    }
});

btnReset.addEventListener('click', () => {
    currentStep = 0;
    
    // Reset left opacity and transforms
    wipWrapper.style.transform = 'translateY(0)';
    wipHash.textContent = initialHash;
    wipHash.style.color = "var(--text-muted)";
    wipCommitDot.style.boxShadow = "none";
    
    // Clear dynamic DOM edits
    newBaseArea.innerHTML = '';
    
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
    if (step.command) {
        stepDescription.innerHTML = step.desc + '<br><br><code class="command-code">$ ' + step.command + '</code>';
    } else {
        stepDescription.innerHTML = step.desc;
    }
    btnNext.textContent = step.actionBtn;
    
    stepNumber.style.background = step.color;
    stepNumber.style.boxShadow = `0 0 20px ${step.color}66`;
}

function animateRebasePull(sourceEl, targetEl, parentNode) {
    return new Promise(resolve => {
        // Evaluate geometry by forcing layout secretly on parent
        parentNode.style.display = 'flex';
        parentNode.style.opacity = '0';
        
        const srcRect = sourceEl.getBoundingClientRect();
        const dstRect = targetEl.getBoundingClientRect();
        
        parentNode.style.display = 'none';
        parentNode.style.opacity = '1';
        
        const particle = document.createElement('div');
        particle.className = 'rebase-particle';
        
        particle.style.left = `${srcRect.left - 1}px`;
        particle.style.top = `${srcRect.top - 1}px`;
        document.body.appendChild(particle);
        
        const deltaX = dstRect.left - srcRect.left;
        const deltaY = dstRect.top - srcRect.top;
        
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes rebaseArcPull {
                0% { transform: translate(0, 0) scale(1); opacity: 1; filter: hue-rotate(0deg); }
                50% { transform: translate(${deltaX/2}px, ${deltaY - 80}px) scale(1.5); opacity: 1; filter: hue-rotate(-20deg); }
                100% { transform: translate(${deltaX}px, ${deltaY}px) scale(1); opacity: 0; filter: hue-rotate(0deg); }
            }
        `;
        document.head.appendChild(style);
        particle.style.animation = 'rebaseArcPull 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards';
        
        setTimeout(() => {
            particle.remove();
            style.remove();
            resolve();
        }, 1200);
    });
}
