const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');

const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

const remoteRepo = document.getElementById('remote-repo');
const localRepo = document.getElementById('local-repo');
const localCommits = document.getElementById('local-commits');
const particlesContainer = document.getElementById('particles-container');

// Text content states
const steps = [
    {
        num: 1,
        title: "The Remote Repository",
        desc: "A remote repository is a version of your mayatools that is hosted on the internet or network somewhere (like GitHub, GitLab, or Bitbucket). It acts as the central source of truth for your team.",
        actionBtn: "Next: The Local Repository",
        color: "#3b82f6" // blue
    },
    {
        num: 2,
        title: "The Local Repository",
        desc: "A local repository is an empty directory on your computer where you want the mayatools to live. Right now, it doesn't have the files or the Git history from the remote.",
        actionBtn: "Action: Run git clone",
        color: "#10b981" // green
    },
    {
        num: 3,
        title: "Cloning... (git clone URL)",
        desc: "When you run 'git clone', Git reaches out to the remote server and securely downloads every file, every branch, and the entire history of the mayatools into your local folder.",
        actionBtn: "Cloning...",
        color: "#f59e0b" // orange
    },
    {
        num: 4,
        title: "Clone Complete",
        desc: "Success! You now have a full, independent copy of the remote repository on your local machine. You can start working, making commits, and eventually pushing them back.",
        actionBtn: "Restart Tutorial",
        color: "#10b981"
    }
];

let currentStepIndex = 0;
let isAnimating = false;

// Initialize
updateUI(0);
localRepo.classList.add('dimmed');
remoteRepo.classList.add('active-repo');

btnNext.addEventListener('click', () => {
    if (isAnimating) return;
    
    currentStepIndex++;
    
    if (currentStepIndex === 1) {
        // Step 2: Show Local Repo
        remoteRepo.classList.remove('active-repo');
        localRepo.classList.remove('dimmed');
        localRepo.classList.add('active-repo');
        updateUI(currentStepIndex);
    } 
    else if (currentStepIndex === 2) {
        // Step 3: Trigger Clone Animation
        updateUI(currentStepIndex);
        btnNext.disabled = true;
        btnNext.style.opacity = '0.5';
        
        remoteRepo.classList.add('active-repo');
        localRepo.classList.add('active-repo');
        
        startCloneAnimation().then(() => {
            // Move to step 4 when done
            currentStepIndex++;
            updateUI(currentStepIndex);
            btnNext.disabled = false;
            btnNext.style.opacity = '1';
            btnNext.classList.add('hidden');
            btnReset.classList.remove('hidden');
            
            // Highlight step 4 UI special case
            stepNumber.style.background = steps[currentStepIndex].color;
            stepNumber.style.boxShadow = `0 0 20px rgba(16, 185, 129, 0.4)`;
        });
    }
});

btnReset.addEventListener('click', () => {
    currentStepIndex = 0;
    
    // Reset classes
    localRepo.classList.add('dimmed');
    localRepo.classList.remove('active-repo');
    remoteRepo.classList.add('active-repo');
    
    // Reset local commits
    localCommits.innerHTML = '<div class="empty-msg">Not yet cloned</div>';
    localCommits.classList.add('empty-state');
    
    // Reset buttons
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

function startCloneAnimation() {
    return new Promise(resolve => {
        isAnimating = true;
        
        // Remove empty state text
        localCommits.innerHTML = '';
        localCommits.classList.remove('empty-state');
        
        // Simulate sending 3 objects (commits/files)
        const totalItems = 3;
        let itemsFinished = 0;
        
        const commitsHTML = [
            `<div class="commit-node" data-id="c1">
                <div class="commit-dot"></div>
                <div class="commit-msg">Initial commit</div>
                <div class="commit-hash">a1b2c3d</div>
            </div>`,
            `<div class="commit-line" style="opacity:0; animation: popIn 0.3s forwards"></div>`,
            `<div class="commit-node" data-id="c2">
                <div class="commit-dot"></div>
                <div class="commit-msg">Add Maya cube tool</div>
                <div class="commit-hash">e4f5g6h</div>
            </div>`,
            `<div class="commit-line" style="opacity:0; animation: popIn 0.3s forwards"></div>`,
            `<div class="commit-node" data-id="c3">
                <div class="commit-dot"></div>
                <div class="commit-msg">Update shaders</div>
                <div class="commit-hash">j7k8l9m</div>
            </div>`
        ];
        
        // Delay for each particle
        for (let i = 0; i < totalItems; i++) {
            setTimeout(() => {
                createParticle();
                
                // After particle journey (approx 1000ms), show commit in local
                setTimeout(() => {
                    // Add HTML
                    if (i === 0) localCommits.insertAdjacentHTML('beforeend', commitsHTML[0]);
                    else if (i === 1) {
                        localCommits.insertAdjacentHTML('beforeend', commitsHTML[1]);
                        localCommits.insertAdjacentHTML('beforeend', commitsHTML[2]);
                    }
                    else if (i === 2) {
                        localCommits.insertAdjacentHTML('beforeend', commitsHTML[3]);
                        localCommits.insertAdjacentHTML('beforeend', commitsHTML[4]);
                    }
                    
                    // Animate the dynamically added commit
                    const nodes = localCommits.querySelectorAll('.commit-node');
                    nodes[i].style.animation = 'popIn 0.5s forwards';
                    nodes[i].style.animationDelay = '0.1s';
                    
                    itemsFinished++;
                    if (itemsFinished === totalItems) {
                        setTimeout(() => {
                            isAnimating = false;
                            resolve();
                        }, 500); // Wait a final few ms
                    }
                }, 1000); // Particle transit time
                
            }, i * 1200); // Stagger particles
        }
    });
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'clone-particle';
    particle.style.animation = 'transferAnim 1s ease-in-out forwards';
    
    // Add jitter
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
