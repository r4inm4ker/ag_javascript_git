const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');

const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

const remoteRepo = document.getElementById('remote-repo');
const localRepo = document.getElementById('local-repo');
const remotePushTarget = document.getElementById('remote-push-target');
const particlesContainer = document.getElementById('particles-container');
const remoteFeatureText = document.getElementById('remote-feature-text');
const remoteBranchBadge = document.getElementById('remote-branch-badge');

const steps = [
    {
        num: 1,
        title: "The Local Feature",
        desc: "You have created a new branch called 'feature' locally and made a new commit. The remote repository knows nothing about it yet.",
        actionBtn: "git push origin feature",
        color: "#10b981" // Green
    },
    {
        num: 2,
        title: "Pushing... (git push)",
        desc: "Git securely transfers the new commits and branch pointers up to the remote repository. This makes your work available to your team.",
        actionBtn: "Pushing...",
        color: "#f59e0b" // Orange
    },
    {
        num: 3,
        title: "Push Complete",
        desc: "The remote repository now has your 'feature' branch and the identical new commit. Anyone on the team can now fetch this branch.",
        actionBtn: "Restart Tutorial",
        color: "#3b82f6" // Blue
    }
];

let currentStepIndex = 0;
let isAnimating = false;

updateUI(0);
remoteRepo.classList.add('dimmed');
localRepo.classList.add('active-repo');

btnNext.addEventListener('click', () => {
    if (isAnimating) return;
    
    currentStepIndex++;
    
    if (currentStepIndex === 1) {
        // Step 2: Trigger Push Animation
        updateUI(currentStepIndex);
        btnNext.disabled = true;
        btnNext.style.opacity = '0.5';
        
        remoteRepo.classList.remove('dimmed');
        remoteRepo.classList.add('active-repo');
        
        startPushAnimation().then(() => {
            // Move to step 3 when done
            currentStepIndex++;
            updateUI(currentStepIndex);
            btnNext.disabled = false;
            btnNext.style.opacity = '1';
            btnNext.classList.add('hidden');
            btnReset.classList.remove('hidden');
            
            // Highlight step 3 UI special case
            stepNumber.style.background = steps[currentStepIndex].color;
            stepNumber.style.boxShadow = `0 0 20px rgba(59, 130, 246, 0.4)`;
        });
    }
});

btnReset.addEventListener('click', () => {
    currentStepIndex = 0;
    
    // Reset states
    remoteRepo.classList.add('dimmed');
    remoteRepo.classList.remove('active-repo');
    
    // Reset remote push target
    remotePushTarget.innerHTML = '';
    
    // Reset remote branch text
    remoteFeatureText.classList.add('hidden');
    remoteBranchBadge.style.color = 'var(--text-muted)';
    
    btnNext.classList.remove('hidden');
    btnReset.classList.add('hidden');
    btnNext.disabled = false;
    btnNext.style.opacity = '1';
    
    updateUI(currentStepIndex);
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

function startPushAnimation() {
    return new Promise(resolve => {
        isAnimating = true;
        
        // Single commit to push
        const branchSplitHTML = `<div class="branch-split" style="opacity:0; animation: drawPath 0.5s ease forwards;"></div>`;
        const newCommitHTML = `
            <div class="commit-node feature-track relative-node" style="opacity:0; animation: slideInRight 0.5s ease forwards; animation-delay: 0.2s;">
                <div class="commit-dot feature-bg"></div>
                <div class="commit-msg">
                    <span>Implement Maya cmds...</span>
                    <span class="commit-hash">x1y2z3w</span>
                </div>
                <div class="labels-container">
                    <span class="branch-tag feature-tag">feature</span>
                </div>
            </div>`;
            
        // Transfer particles (right to left)
        createParticle();
        setTimeout(() => createParticle(), 400);
        setTimeout(() => createParticle(), 800);
        
        // When transfer finishes (approx 1200ms setup)
        setTimeout(() => {
            // Notice: flex-direction is column-reverse, meaning the visual order matches bottom-to-top rendering. We append things chronologically.
            remotePushTarget.insertAdjacentHTML('beforeend', branchSplitHTML);
            remotePushTarget.insertAdjacentHTML('beforeend', newCommitHTML);
            
            remoteFeatureText.classList.remove('hidden');
            remoteBranchBadge.style.color = '#a855f7';
            
            setTimeout(() => {
                isAnimating = false;
                resolve();
            }, 800);
        }, 1300);
    });
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'push-particle'; // different class uses different keyframes
    particle.style.animation = 'pushAnim 1s ease-in-out forwards';
    
    // Add jitter natively
    const isMobile = window.innerWidth <= 900;
    if (isMobile) {
        const randomX = (Math.random() - 0.5) * 40;
        particle.style.marginLeft = `${randomX}px`;
    } else {
        const randomY = (Math.random() - 0.5) * 40;
        particle.style.marginTop = `${randomY}px`;
    }
    
    particlesContainer.appendChild(particle);
    
    // Clean up
    setTimeout(() => {
        particle.remove();
    }, 1100);
}
