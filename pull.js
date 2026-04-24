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
const baseLabels = document.getElementById('base-labels');

const steps = [
    {
        num: 1,
        title: "Your Local Workspace",
        desc: "You cloned the repo earlier and made a local commit editing shaders.py. Meanwhile, Alice pushed 'Translate cube up' to remote main. Your histories have diverged — run git pull to merge them.",
        actionBtn: "git pull origin main",
        color: "#10b981",
        command: "git pull origin main"
    },
    {
        num: 2,
        title: "Pulling… Merge Required",
        desc: "Git fetches the remote commit 'Translate cube up' and, because your histories diverged, creates a merge commit that ties both lines of work together.",
        actionBtn: "Pulling...",
        color: "#f59e0b"
    },
    {
        num: 3,
        title: "Merge Pull Complete",
        desc: "Your local main now contains both your 'Edit shaders.py' work AND Alice's 'Translate cube up' commit, unified in a merge commit. You're fully in sync!",
        actionBtn: "Restart Tutorial",
        color: "#3b82f6"
    }
];

let currentStepIndex = 0;
let isAnimating = false;

updateUI(0);

btnNext.addEventListener('click', () => {
    if (isAnimating) return;

    if (currentStepIndex === 2) {
        // Restart
        btnReset.click();
        return;
    }

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

    // Restore HEAD/main labels back to the local head node
    baseLabels.appendChild(mainTag);
    baseLabels.appendChild(headTag);

    // Remove injected merge nodes
    localPullTarget.innerHTML = '';

    localBranchBadge.style.color = '';
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

        // Fire particles (remote → local direction)
        createParticle();
        setTimeout(() => createParticle(), 350);
        setTimeout(() => createParticle(), 700);
        setTimeout(() => createParticle(), 1050);

        setTimeout(() => {
            // Detach main/head tags from the local head node before injecting merge
            const pulledLabels = document.createElement('div');
            pulledLabels.id = 'pulled-labels';
            pulledLabels.className = 'labels-container';

            // Remote commit absorbed into local
            const remoteLine = document.createElement('div');
            remoteLine.className = 'commit-line main-bg';
            remoteLine.style.cssText = 'opacity:0; animation: popIn 0.4s ease 0.0s forwards;';

            const remoteNode = document.createElement('div');
            remoteNode.className = 'commit-node main-track relative-node';
            remoteNode.style.cssText = 'z-index:3; opacity:0; animation: popIn 0.5s ease 0.15s forwards;';
            remoteNode.innerHTML = `
                <div class="commit-dot" style="background:#10b981; box-shadow:0 0 8px #10b981; width:12px; height:12px;"></div>
                <div class="commit-msg">
                    <span style="color:#10b981;">Translate cube up</span>
                    <span class="commit-hash">p4q5r6s</span>
                </div>
                <div style="font-size:0.65rem; color:#6b7280; margin-top:0.2rem; margin-left:1.5rem;">(from origin/main)</div>`;

            // Merge commit
            const mergeLine = document.createElement('div');
            mergeLine.className = 'commit-line main-bg';
            mergeLine.style.cssText = 'opacity:0; animation: popIn 0.4s ease 0.4s forwards;';

            const mergeNode = document.createElement('div');
            mergeNode.className = 'commit-node main-track relative-node merge-commit';
            mergeNode.style.cssText = 'opacity:0; animation: popIn 0.5s ease 0.55s forwards;';
            mergeNode.innerHTML = `
                <div class="commit-dot main-bg" style="box-shadow:0 0 10px var(--accent-primary);"></div>
                <div class="commit-msg">
                    <span>Merge branch 'main' of gitlab.com/mayatools</span>
                    <span class="commit-hash">m3n4o5p</span>
                </div>`;
            mergeNode.appendChild(pulledLabels);

            localPullTarget.appendChild(remoteLine);
            localPullTarget.appendChild(remoteNode);
            localPullTarget.appendChild(mergeLine);
            localPullTarget.appendChild(mergeNode);

            // Move main + HEAD tags to merge commit
            setTimeout(() => {
                pulledLabels.appendChild(mainTag);
                pulledLabels.appendChild(headTag);
                localBranchName.textContent = 'main';

                isAnimating = false;
                resolve();
            }, 900);
        }, 1400);
    });
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'clone-particle';
    particle.style.animation = 'transferAnim 1s ease-in-out forwards';

    const isMobile = window.innerWidth <= 900;
    if (isMobile) {
        particle.style.marginLeft = `${(Math.random() - 0.5) * 40}px`;
    } else {
        particle.style.marginTop = `${(Math.random() - 0.5) * 40}px`;
    }

    particlesContainer.appendChild(particle);
    setTimeout(() => particle.remove(), 1100);
}
