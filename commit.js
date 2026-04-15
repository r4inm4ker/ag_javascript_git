const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');

const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

const remoteRepo = document.getElementById('remote-repo');
const localRepo = document.getElementById('local-repo');
const remotePushTarget = document.getElementById('remote-push-target');
const localCommitTarget = document.getElementById('local-commit-target');
const particlesContainer = document.getElementById('particles-container');

const remoteBaseLabels = document.getElementById('remote-base-labels');
const localBaseLabels = document.getElementById('local-base-labels');

const localMainTag = document.getElementById('local-main-tag');
const localHeadTag = document.getElementById('local-head-tag');

const steps = [
    {
        num: 1,
        title: "The Local Repository",
        desc: "You are currently on the 'main' branch locally. The remote repository is fully synced with your previous work.",
        actionBtn: "git commit -m \"Fix login bug\"",
        color: "#10b981" // Green
    },
    {
        num: 2,
        title: "Making a Commit",
        desc: "Running 'git commit' adds a new commit to the local 'main' branch. The remote repository knows nothing about it yet.",
        actionBtn: "git push origin main",
        color: "#a855f7" // Purple
    },
    {
        num: 3,
        title: "Pushing... (git push)",
        desc: "Git securely transfers the new commits up to the remote repository. This makes your work available to your team.",
        actionBtn: "Pushing...",
        color: "#f59e0b" // Orange
    },
    {
        num: 4,
        title: "Push Complete",
        desc: "The remote repository now has your new commit on the 'main' branch. Both repositories are synced.",
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
        // Step 2: Local Commit
        updateUI(currentStepIndex);
        
        // Add new commit locally
        const commitLineHTML = `<div class="commit-line main-bg" style="opacity:0; animation: drawPath 0.5s ease forwards;"></div>`;
        const newCommitHTML = `
            <div class="commit-node main-track relative-node" style="opacity:0; animation: slideUp 0.5s ease forwards; animation-delay: 0.2s; z-index: 3;">
                <div class="commit-dot main-bg"></div>
                <div class="commit-msg">
                    <span>Fix login bug</span>
                    <span class="commit-hash">p4q5r6s</span>
                </div>
                <div class="labels-container" id="local-new-labels">
                </div>
            </div>`;
        
        localCommitTarget.insertAdjacentHTML('beforeend', commitLineHTML);
        localCommitTarget.insertAdjacentHTML('beforeend', newCommitHTML);
        
        // Move tags
        setTimeout(() => {
            const localNewLabels = document.getElementById('local-new-labels');
            if (localNewLabels) {
                localNewLabels.appendChild(localMainTag);
                localNewLabels.appendChild(localHeadTag);
            }
        }, 300);
        
    } else if (currentStepIndex === 2) {
        // Step 3: Trigger Push Animation
        updateUI(currentStepIndex);
        btnNext.disabled = true;
        btnNext.style.opacity = '0.5';
        
        remoteRepo.classList.remove('dimmed');
        remoteRepo.classList.add('active-repo');
        
        startPushAnimation().then(() => {
            // Move to step 4 when done
            currentStepIndex++;
            updateUI(currentStepIndex);
            btnNext.disabled = false;
            btnNext.style.opacity = '1';
            btnNext.classList.add('hidden');
            btnReset.classList.remove('hidden');
            
            // Highlight step 4 UI special case
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
    
    // Reset local commit target
    localCommitTarget.innerHTML = '';
    
    // Reset remote base tags
    const remoteMainTag = document.querySelector('.remote-repo .main-tag');
    if (remoteMainTag) {
        remoteBaseLabels.appendChild(remoteMainTag);
    } else {
        remoteBaseLabels.innerHTML = '<span class="branch-tag main-tag">main</span>';
    }
    
    // Reset local tags
    localBaseLabels.appendChild(localMainTag);
    localBaseLabels.appendChild(localHeadTag);
    
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
        
        // Transfer particles (right to left)
        createParticle();
        setTimeout(() => createParticle(), 400);
        setTimeout(() => createParticle(), 800);
        
        // When transfer finishes (approx 1200ms setup)
        setTimeout(() => {
            const commitLineHTML = `<div class="commit-line main-bg" style="opacity:0; animation: drawPath 0.5s ease forwards;"></div>`;
            const newCommitHTML = `
                <div class="commit-node main-track relative-node" style="opacity:0; animation: slideUp 0.5s ease forwards; animation-delay: 0.2s; z-index: 3;">
                    <div class="commit-dot main-bg"></div>
                    <div class="commit-msg">
                        <span>Fix login bug</span>
                        <span class="commit-hash">p4q5r6s</span>
                    </div>
                    <div class="labels-container" id="remote-new-labels">
                    </div>
                </div>`;
            
            remotePushTarget.insertAdjacentHTML('beforeend', commitLineHTML);
            remotePushTarget.insertAdjacentHTML('beforeend', newCommitHTML);
            
            setTimeout(() => {
                const remoteNewLabels = document.getElementById('remote-new-labels');
                const remoteMainTag = remoteBaseLabels.querySelector('.main-tag');
                if (remoteMainTag && remoteNewLabels) {
                    remoteNewLabels.appendChild(remoteMainTag);
                }
                
                isAnimating = false;
                resolve();
            }, 300);
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
