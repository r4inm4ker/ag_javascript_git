const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');

const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

const remoteRepo = document.getElementById('remote-repo');
const localRepo = document.getElementById('local-repo');
const localPullTarget = document.getElementById('local-pull-target');
const particlesContainer = document.getElementById('particles-container');
const mainTag = document.getElementById('main-tag');
const headTag = document.getElementById('head-tag');

const steps = [
    {
        num: 1,
        title: "The Colleague's Workspace",
        desc: "Imagine Jharyono's laptop. They cloned the repository earlier and are on commit 'j7k8l9m'. They don't have the new commit that Alice just pushed.",
        actionBtn: "git pull origin main",
        color: "#10b981",
        command: "git pull origin main" // Green
    },
    {
        num: 2,
        title: "Pulling... (git pull)",
        desc: "Git automatically fetches the new commits from the remote repository and fast-forwards them securely into their local 'main' branch.",
        actionBtn: "Pulling...",
        color: "#f59e0b" // Orange
    },
    {
        num: 3,
        title: "Sync Complete",
        desc: "Their local workspace safely fast-forwards to contain the new commit natively. Everyone is now in sync and ready to code.",
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
    if (step.command) {
        stepDescription.innerHTML = step.desc + '<br><br><code class="command-code">$ ' + step.command + '</code>';
    } else {
        stepDescription.innerHTML = step.desc;
    }
    btnNext.textContent = step.actionBtn;
    
    stepNumber.style.background = step.color;
    stepNumber.style.boxShadow = `0 0 20px ${step.color}66`;
}

function startPullAnimation() {
    return new Promise(resolve => {
        isAnimating = true;
        
        const commitLineHTML = `<div class="commit-line main-bg" style="opacity:0; animation: drawPath 0.5s ease forwards;"></div>`;
        const newCommitHTML = `
            <div class="commit-node main-track relative-node" style="opacity:0; animation: slideUp 0.5s ease forwards; animation-delay: 0.2s; z-index: 3;">
                <div class="commit-dot main-bg"></div>
                <div class="commit-msg">
                    <span>Translate cube up</span>
                    <span class="commit-hash">p4q5r6s</span>
                </div>
                <div class="labels-container" id="pulled-labels">
                </div>
            </div>`;
            
        // Transfer particles (left to right uses transferAnim natively)
        createParticle();
        setTimeout(() => createParticle(), 300);
        setTimeout(() => createParticle(), 600);
        
        setTimeout(() => {
            localPullTarget.insertAdjacentHTML('beforeend', commitLineHTML);
            localPullTarget.insertAdjacentHTML('beforeend', newCommitHTML);
            
            setTimeout(() => {
                document.getElementById('pulled-labels').appendChild(mainTag);
                document.getElementById('pulled-labels').appendChild(headTag);
                
                isAnimating = false;
                resolve();
            }, 500);
        }, 1000);
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
