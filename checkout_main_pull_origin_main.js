const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');

const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

const visContainer = document.getElementById('vis-container');
const headTagWip = document.getElementById('head-tag-wip');
const headTagMain = document.getElementById('head-tag-main');
const mainPullTarget = document.getElementById('main-pull-target');

const steps = [
    {
        num: 1,
        title: "WIP Branch Complete",
        desc: "Your WIP was merged into main online via a Merge Request. Locally, you are still on the wip branch. First, you need to switch back to the main branch.",
        actionBtn: "git checkout main",
        color: "#10b981"
    },
    {
        num: 2,
        title: "Switched Context",
        desc: "You are back on the main branch locally. Notice that your local main branch is behind the remote, as it lacks the new commits introduced online.",
        actionBtn: "git pull origin main",
        color: "#3b82f6"
    },
    {
        num: 3,
        title: "Branches Synchronized",
        desc: "git pull fetched the remote main branch and applied the new merge and wip commits to your local repository. Your local main is now fully up to date.",
        actionBtn: "Restart Tutorial",
        color: "#3b82f6"
    }
];

let currentStep = 0;

updateUI(0);

btnNext.addEventListener('click', () => {
    currentStep++;
    
    if (currentStep === 1) {
        // Step 2: Checkout main
        visContainer.classList.remove('page-wip-active');
        visContainer.classList.add('page-main-active');
        
        // Move HEAD virtually
        headTagWip.classList.add('hidden');
        headTagMain.classList.remove('hidden');
        headTagMain.classList.add('pop-in');
        
        // Make the left container visually active
        document.getElementById('local-repo-wip').classList.remove('active-repo');
        document.getElementById('local-repo-main').classList.add('active-repo');
        
        updateUI(currentStep);
    } else if (currentStep === 2) {
        // Step 3: Pull origin main
        btnNext.classList.add('hidden');
        btnReset.classList.remove('hidden');
        
        // Create the new commits HTML
        const pulledCommitsHTML = `
            <div class="commit-line main-bg" style="opacity:0; animation: slideUp 0.4s ease forwards; animation-delay: 0.2s;"></div>
            <div class="commit-node main-track relative-node" style="background: rgba(168,85,247,0.12); border-color: rgba(168,85,247,0.35); opacity:0; animation: slideUp 0.5s ease forwards; animation-delay: 0.4s;">
                <div class="commit-dot wip-bg"></div>
                <div class="commit-msg">
                    <span>Translate cube up</span>
                    <span class="commit-hash">p4q5r6s</span>
                </div>
            </div>
            <div class="commit-line main-bg" style="opacity:0; animation: slideUp 0.4s ease forwards; animation-delay: 0.6s;"></div>
            <div class="commit-node main-track relative-node" style="background: rgba(16,185,129,0.15); border-color: rgba(16,185,129,0.5); z-index: 5; opacity:0; animation: slideUp 0.5s ease forwards; animation-delay: 0.8s;">
                <div class="commit-dot main-bg"></div>
                <div class="commit-msg">
                    <span>Merge pull request #1</span>
                    <span class="commit-hash">m9n8p7q</span>
                </div>
            </div>
        `;
        
        mainPullTarget.innerHTML = pulledCommitsHTML;
        
        // Move HEAD and branch tag to top of pulled commits
        const baseLabels = document.getElementById('base-labels-main');
        baseLabels.style.display = 'none'; // hide the old labels on j7k8l9m
        
        setTimeout(() => {
            const topNode = mainPullTarget.querySelector('.commit-node:last-child');
            if (topNode) {
                const labelsDiv = document.createElement('div');
                labelsDiv.className = 'labels-container pop-in';
                labelsDiv.innerHTML = `
                    <span class="branch-tag main-tag">main</span>
                    <span class="head-tag">HEAD</span>
                `;
                topNode.appendChild(labelsDiv);
            }
        }, 1200);
        
        updateUI(currentStep);
    }
});

btnReset.addEventListener('click', () => {
    currentStep = 0;
    
    visContainer.classList.add('page-wip-active');
    visContainer.classList.remove('page-main-active');
    
    document.getElementById('local-repo-main').classList.remove('active-repo');
    document.getElementById('local-repo-wip').classList.add('active-repo');
    
    headTagMain.classList.add('hidden');
    headTagMain.classList.remove('pop-in');
    headTagWip.classList.remove('hidden');
    
    mainPullTarget.innerHTML = '';
    const baseLabels = document.getElementById('base-labels-main');
    baseLabels.style.display = 'flex';
    
    btnNext.classList.remove('hidden');
    btnReset.classList.add('hidden');
    
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