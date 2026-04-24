const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');

const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');
const stepIndicatorBlock = document.getElementById('step-indicator-block');

const localSourceDot = document.getElementById('local-source-dot');
const remoteTargetDot = document.getElementById('remote-target-dot');
const remoteRepo = document.getElementById('remote-repo');

const remoteHeaderBorder = document.getElementById('remote-header-border');
const remoteHeaderIcon = document.getElementById('remote-header-icon');
const remoteHeaderTitle = document.getElementById('remote-header-title');
const remoteBranchBadge = document.getElementById('remote-branch-badge');
const transferLineVisual = document.getElementById('transfer-line-visual');

const glowRight = document.getElementById('glow-right');

const steps = [
    {
        num: 1,
        title: "The Problem Scope",
        desc: "You have committed new work locally on 'main' (left). However, someone else has pushed a different commit to the remote 'main' (right). The histories have completely diverged.",
        actionBtn: "git push",
        color: "#3b82f6",
        command: "git push" // Blue
    },
    {
        num: 2,
        title: "Attempting Transfer",
        desc: "You try to blindly push your new local commits up to the remote server using the standard push command.",
        actionBtn: "Pushing...",
        color: "#f59e0b" // Orange (warning)
    },
    {
        num: 3,
        title: "Rejected (Non-Fast-Forward)",
        desc: "Push Rejected! The remote server prevents you from overwriting the database. You must first 'git pull' to fetch and resolve the divergence locally before pushing.",
        actionBtn: "Restart Tutorial",
        color: "#ef4444" // Red (error)
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
        
        localSourceDot.style.boxShadow = '0 0 25px #3b82f6';
        
        setTimeout(() => {
            // Animate error push sequence
            animateRejectedPush(localSourceDot, remoteTargetDot, remoteRepo).then(() => {
                localSourceDot.style.boxShadow = 'none';
                
                // Trigger major error visual states
                remoteRepo.style.boxShadow = "0 0 30px rgba(239, 68, 68, 0.4)";
                remoteRepo.style.borderColor = "#ef4444";
                glowRight.style.background = "rgba(239, 68, 68, 0.1)";
                
                remoteHeaderBorder.style.borderBottomColor = "rgba(239, 68, 68, 0.4)";
                remoteHeaderIcon.style.color = "#ef4444";
                remoteHeaderTitle.style.color = "#ef4444";
                
                remoteBranchBadge.style.color = "#ef4444";
                remoteBranchBadge.style.background = "rgba(239, 68, 68, 0.2)";
                remoteBranchBadge.style.borderColor = "#ef4444";
                
                transferLineVisual.style.borderTopColor = "rgba(239, 68, 68, 0.6)";
                
                setTimeout(() => {
                    isAnimating = false;
                    currentStep++;
                    updateUI(currentStep);
                    btnNext.disabled = false;
                    btnNext.style.opacity = '1';
                    btnNext.style.background = '#ef4444';
                    btnNext.classList.add('hidden');
                    btnReset.classList.remove('hidden');
                    
                    stepIndicatorBlock.style.background = steps[currentStep].color;
                    stepIndicatorBlock.style.boxShadow = `0 0 20px rgba(239, 68, 68, 0.4)`;
                }, 400);
            });
        }, 500);
    }
});

btnReset.addEventListener('click', () => {
    currentStep = 0;
    
    localSourceDot.style.boxShadow = "none";
    
    // Reset visual error states
    remoteRepo.style.boxShadow = "0 0 30px rgba(236, 72, 153, 0.15)";
    remoteRepo.style.borderColor = "var(--border-color)";
    glowRight.style.background = "rgba(236, 72, 153, 0.05)";
    
    remoteHeaderBorder.style.borderBottomColor = "rgba(236, 72, 153, 0.2)";
    remoteHeaderIcon.style.color = "#ec4899";
    remoteHeaderTitle.style.color = "var(--text-color)";
    
    remoteBranchBadge.style.color = "#ec4899";
    remoteBranchBadge.style.background = "rgba(236, 72, 153, 0.2)";
    remoteBranchBadge.style.borderColor = "#ec4899";
    
    transferLineVisual.style.borderTopColor = "rgba(239, 68, 68, 0.1)";
    
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
    
    stepIndicatorBlock.style.background = step.color;
    stepIndicatorBlock.style.boxShadow = `0 0 20px ${step.color}66`;
}

function animateRejectedPush(sourceEl, targetEl, containerNode) {
    return new Promise(resolve => {
        const srcRect = sourceEl.getBoundingClientRect();
        const dstRect = targetEl.getBoundingClientRect();
        
        const particle = document.createElement('div');
        particle.className = 'push-particle';
        
        particle.style.left = `${srcRect.left - 1}px`;
        particle.style.top = `${srcRect.top - 1}px`;
        document.body.appendChild(particle);
        
        const deltaX = dstRect.left - srcRect.left;
        const deltaY = dstRect.top - srcRect.top;
        
        // Custom animation: Starts standard blue, hits the remote area, turns red, and dramatically speeds backwards and fades out
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes pushRejectArc {
                0% { transform: translate(0, 0) scale(1); background: #3b82f6; box-shadow: 0 0 15px #3b82f6; opacity: 1; filter: drop-shadow(0 0 10px #3b82f6); }
                60% { transform: translate(${deltaX - 40}px, ${deltaY}px) scale(1.5); background: #3b82f6; box-shadow: 0 0 15px #3b82f6; opacity: 1; filter: drop-shadow(0 0 10px #3b82f6); }
                61% { transform: translate(${deltaX - 35}px, ${deltaY}px) scale(2); background: #ef4444; box-shadow: 0 0 30px #ef4444; opacity: 1; filter: drop-shadow(0 0 20px #ef4444); }
                65% { transform: translate(${deltaX - 35}px, ${deltaY}px) scale(2); background: #ef4444; box-shadow: 0 0 30px #ef4444; opacity: 1; filter: drop-shadow(0 0 20px #ef4444); }
                100% { transform: translate(${deltaX - 150}px, ${deltaY + 50}px) scale(0); background: #ef4444; box-shadow: 0 0 10px #ef4444; opacity: 0; filter: drop-shadow(0 0 10px #ef4444); }
            }
        `;
        document.head.appendChild(style);
        particle.style.animation = 'pushRejectArc 1.4s cubic-bezier(0.25, 1, 0.5, 1) forwards';
        
        // Time the collision to trigger the repo shake
        setTimeout(() => {
            containerNode.classList.add('shake-animation');
            
            setTimeout(() => {
                containerNode.classList.remove('shake-animation');
            }, 600);
        }, 850); // Maps roughly to 61% of 1.4s
        
        setTimeout(() => {
            particle.remove();
            style.remove();
            resolve();
        }, 1400);
    });
}
