const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');

const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

const remoteRepo = document.getElementById('remote-repo');
const localRepo = document.getElementById('local-repo');
const localPullTarget = document.getElementById('local-pull-target');
const particlesContainer = document.getElementById('particles-container');
const localBranchBadge = document.getElementById('local-branch-badge');
const localBranchName = document.getElementById('local-branch-name');
const mainTag = document.getElementById('main-tag');
const headTag = document.getElementById('head-tag');

const steps = [
    {
        num: 1,
        title: "The Colleague's Workspace",
        desc: "Imagine your colleague's laptop. They cloned the repository yesterday and are on commit 'j7k8l9m'. They don't have the new feature and merge commits that just happened on the remote.",
        actionBtn: "git pull origin main",
        color: "#10b981" // Green
    },
    {
        num: 2,
        title: "Pulling... (git pull)",
        desc: "Git automatically fetches the new commits from the remote repository and fast-forwards/merges them securely into their 'main' branch.",
        actionBtn: "Pulling...",
        color: "#f59e0b" // Orange
    },
    {
        num: 3,
        title: "Sync Complete",
        desc: "Their local workspace is identically matched with the remote again! Everyone is now in sync and ready to code.",
        actionBtn: "Restart Tutorial",
        color: "#3b82f6" // Blue
    }
];

let currentStepIndex = 0;
let isAnimating = false;

updateUI(0);

btnNext.addEventListener('click', () => {
    if (isAnimating) return;
    
    currentStepIndex++;
    
    if (currentStepIndex === 1) {
        updateUI(currentStepIndex);
        btnNext.disabled = true;
        btnNext.style.opacity = '0.5';
        
        localRepo.classList.remove('dimmed');
        localRepo.classList.add('active-repo');
        
        startPullAnimation().then(() => {
            currentStepIndex++;
            updateUI(currentStepIndex);
            btnNext.disabled = false;
            btnNext.style.opacity = '1';
            btnNext.classList.add('hidden');
            btnReset.classList.remove('hidden');
            
            stepNumber.style.background = steps[currentStepIndex].color;
            stepNumber.style.boxShadow = `0 0 20px rgba(59, 130, 246, 0.4)`;
        });
    }
});

btnReset.addEventListener('click', () => {
    currentStepIndex = 0;
    
    localRepo.classList.add('dimmed');
    localRepo.classList.remove('active-repo');
    
    // Reset DOM
    document.getElementById('base-labels').appendChild(mainTag);
    document.getElementById('base-labels').appendChild(headTag);
    
    localPullTarget.innerHTML = '';
    localBranchBadge.style.color = 'currentColor';
    localBranchName.textContent = 'main';
    
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

function startPullAnimation() {
    return new Promise(resolve => {
        isAnimating = true;
        
        const branchSplitHTML = `<div class="branch-split" style="opacity:0; animation: drawPath 0.5s ease forwards;"></div>`;
        const newCommitHTML = `
            <div class="commit-node feature-track relative-node" style="z-index:3; opacity:0; animation: slideInRight 0.5s ease forwards; animation-delay: 0.2s;">
                <div style="position: absolute; left: -36px; top: -10px; bottom: -20px; width: 2px; background: var(--accent-secondary); z-index: -1;"></div>
                <div class="commit-dot feature-bg"></div>
                <div class="commit-msg"><span>Implement Maya cmds...</span><span class="commit-hash">x1y2z3w</span></div>
            </div>`;
        const mergeSplitHTML = `<div class="merge-split" style="opacity:0; animation: drawPath 0.5s ease forwards; animation-delay: 0.4s;"></div>`;
        const mergeCommitHTML = `
            <div class="commit-node main-track relative-node merge-commit" style="opacity:0; animation: popIn 0.4s ease forwards; animation-delay: 0.6s;">
                <div class="commit-dot main-bg"></div>
                <div class="commit-msg"><span>Merge pull request #1</span><span class="commit-hash">m9n8p7q</span></div>
                <div class="labels-container" id="pulled-labels"></div>
            </div>`;
            
        // Transfer particles (left to right uses transferAnim natively)
        createParticle();
        setTimeout(() => createParticle(), 300);
        setTimeout(() => createParticle(), 600);
        setTimeout(() => createParticle(), 900);
        
        setTimeout(() => {
            localPullTarget.insertAdjacentHTML('beforeend', branchSplitHTML);
            localPullTarget.insertAdjacentHTML('beforeend', newCommitHTML);
            localPullTarget.insertAdjacentHTML('beforeend', mergeSplitHTML);
            localPullTarget.insertAdjacentHTML('beforeend', mergeCommitHTML);
            
            setTimeout(() => {
                document.getElementById('pulled-labels').appendChild(mainTag);
                document.getElementById('pulled-labels').appendChild(headTag);
                
                localBranchBadge.style.color = '#a855f7';
                localBranchName.textContent = 'main, feature';
                
                isAnimating = false;
                resolve();
            }, 1000);
        }, 1300);
    });
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'clone-particle'; // clone-particle uses transferAnim (left to right)
    particle.style.animation = 'transferAnim 1s ease-in-out forwards';
    
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
    
    setTimeout(() => {
        particle.remove();
    }, 1100);
}
