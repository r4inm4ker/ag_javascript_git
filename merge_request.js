const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');

const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

const reviewBadge = document.getElementById('review-badge');
const mergeTarget = document.getElementById('merge-target');
const mrStatusBadge = document.getElementById('mr-status-badge');
const mrActivity = document.getElementById('mr-activity');

const steps = [
    {
        num: 1,
        title: "The Merge Request",
        desc: "Your feature branch has been pushed to the remote. A Merge Request compares the feature branch (source) against main (target), letting teammates review every commit before it is merged.",
        actionBtn: "Review Code",
        color: "#f59e0b"
    },
    {
        num: 2,
        title: "Code Review",
        desc: "Teammates inspect each commit on the feature branch, leave comments, and approve when satisfied (Looks Good To Me!). All commits must be reviewed before merging.",
        actionBtn: "Merge Pull Request",
        color: "#10b981"
    },
    {
        num: 3,
        title: "Merge Complete",
        desc: "The feature branch commits are merged into main via a new merge commit. The main branch pointer moves forward to include all feature work — the Merge Request is now closed.",
        actionBtn: "Restart Tutorial",
        color: "#3b82f6"
    }
];

let currentStep = 0;
updateUI(0);

btnNext.addEventListener('click', () => {
    currentStep++;

    if (currentStep === 1) {
        // Step 2: Show LGTM review badge and log review activity
        reviewBadge.classList.add('pop-in');
        addActivity('&#x1F440; bob reviewed all commits');
        addActivity('&#x2705; Approved — LGTM');
        updateUI(currentStep);

    } else if (currentStep === 2) {
        // Step 3: Trigger Merge
        btnNext.classList.add('hidden');
        btnReset.classList.remove('hidden');

        // Update MR status badge
        mrStatusBadge.textContent = 'Merged';
        mrStatusBadge.style.background = 'rgba(59,130,246,0.15)';
        mrStatusBadge.style.color = '#3b82f6';

        // Insert merge commit on top (newest), then the feature commit below it
        const newCommitsHTML = `
            <div class="commit-node main-track relative-node merge-commit" style="background: rgba(16,185,129,0.15); border-color: rgba(16,185,129,0.5); opacity:0; animation: popIn 0.5s ease forwards; animation-delay: 0.1s;">
                <div class="commit-dot main-bg"></div>
                <div class="commit-msg">
                    <span>Merge pull request #1</span>
                    <span class="commit-hash">m9n8p7q</span>
                </div>
            </div>
            <div class="commit-line main-bg" style="opacity:0; animation: popIn 0.4s ease forwards; animation-delay: 0.5s;"></div>
            <div class="commit-node main-track relative-node" style="background: rgba(168,85,247,0.12); border-color: rgba(168,85,247,0.35); opacity:0; animation: popIn 0.5s ease forwards; animation-delay: 0.6s;">
                <div class="commit-dot feature-bg"></div>
                <div class="commit-msg">
                    <span>Translate cube up</span>
                    <span class="commit-hash">p4q5r6s</span>
                </div>
            </div>
            <div class="commit-line main-bg" style="opacity:0; animation: popIn 0.4s ease forwards; animation-delay: 1.0s;"></div>`;

        mergeTarget.insertAdjacentHTML('beforeend', newCommitsHTML);
        addActivity('&#x1F7E3; Merged into main');

        updateUI(currentStep);
    }
});

btnReset.addEventListener('click', () => {
    currentStep = 0;

    // Reset review badge
    reviewBadge.classList.remove('pop-in');

    // Clear merge commit
    mergeTarget.innerHTML = '';

    // Reset MR status
    mrStatusBadge.textContent = 'Open';
    mrStatusBadge.style.background = 'rgba(245,158,11,0.15)';
    mrStatusBadge.style.color = '#f59e0b';

    // Reset activity log
    mrActivity.innerHTML = `
        <div>&#x1F4E4; Pushed <code>feature</code> branch</div>
        <div>&#x1F517; Merge Request opened</div>`;

    btnNext.classList.remove('hidden');
    btnReset.classList.add('hidden');

    updateUI(currentStep);
});

function addActivity(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    div.style.opacity = '0';
    div.style.transition = 'opacity 0.4s ease';
    mrActivity.appendChild(div);
    requestAnimationFrame(() => { div.style.opacity = '1'; });
}

function updateUI(stepIndex) {
    const step = steps[stepIndex];
    stepNumber.textContent = step.num;
    stepTitle.textContent = step.title;
    stepDescription.textContent = step.desc;
    btnNext.textContent = step.actionBtn;

    stepNumber.style.background = step.color;
    stepNumber.style.boxShadow = `0 0 20px ${step.color}66`;
}
