const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');
const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

const steps = [
    {
        num: 1,
        title: "The Problem",
        desc: "Imagine you are working on a project \u2014 a collection of files like scripts, configs and assets. Without any system to track changes, things quickly spiral out of control. Files get overwritten, you lose previous versions, and collaborating with others becomes a nightmare.",
        actionBtn: "What is Version Control?",
        color: "#8b5cf6"
    },
    {
        num: 2,
        title: "Snapshots in Time",
        desc: "Git is a <strong>version control system</strong>. Instead of saving copies of your files (v1, v2, FINAL\u2026), Git takes <strong>snapshots</strong> of your entire project at each point you choose to save. Each snapshot is called a <em>commit</em>, and every commit gets a unique ID (a hash). You can always go back to any snapshot.",
        actionBtn: "Where Does It Live?",
        color: "#3b82f6"
    },
    {
        num: 3,
        title: "Local & Remote",
        desc: "Git works with various copies of your project. The <strong>local</strong> repository is on your computer \u2014 it is where you usually write code, make commits, and experiment. The <strong>remote</strong> repository is hosted online (e.g. GitHub, GitLab) and acts as the shared source of truth for your team. You sync between them using <code>push</code> and <code>pull</code>.",
        actionBtn: "What are Branches?",
        color: "#10b981"
    },
    {
        num: 4,
        title: "Branching",
        desc: "A <strong>branch</strong> is an independent line of development. The default branch is usually called <code>main</code>. When you want to work on a new feature, you create a new branch \u2014 this lets you experiment without breaking the main code. When you are ready, you can merge your branch back in.",
        actionBtn: "Summarize It",
        color: "#a855f7"
    },
    {
        num: 5,
        title: "Git in a Nutshell",
        desc: "Git gives you <strong>superpowers</strong>: time travel through your code history, safe experimentation via branches, seamless team collaboration through remotes, and the ability to undo mistakes. The tutorials that follow will teach you each concept step by step.",
        actionBtn: "Start Learning \u2192",
        color: "#f59e0b"
    }
];

let currentStep = 0;

function updateUI(stepIndex) {
    const step = steps[stepIndex];
    stepNumber.textContent = step.num;
    stepTitle.textContent = step.title;
    stepDescription.innerHTML = step.desc;
    btnNext.textContent = step.actionBtn;
    stepNumber.style.background = step.color;
    stepNumber.style.boxShadow = `0 0 20px ${step.color}66`;

    if (stepIndex === steps.length - 1) {
        btnNext.classList.add('hidden');
    } else {
        btnNext.classList.remove('hidden');
    }
}

function showScene(index) {
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    const scene = document.getElementById(`scene-${index + 1}`);
    if (scene) scene.classList.add('active');

    // Animate scene contents
    if (index === 1) animateTimeline();
    if (index === 2) animateRepoModel();
    if (index === 3) animateBranches();
    if (index === 4) animateSummary();
}

function animateTimeline() {
    const snaps = [
        document.getElementById('snap-1'),
        document.getElementById('snap-2'),
        document.getElementById('snap-3'),
        document.getElementById('snap-4')
    ];
    const lines = [
        document.getElementById('tl-1'),
        document.getElementById('tl-2'),
        document.getElementById('tl-3')
    ];

    snaps.forEach(s => s.classList.remove('visible'));
    lines.forEach(l => l.classList.remove('visible'));

    let delay = 200;
    snaps.forEach((snap, i) => {
        setTimeout(() => {
            snap.classList.add('visible');
            if (i > 0 && lines[i - 1]) lines[i - 1].classList.add('visible');
        }, delay);
        delay += 350;
    });
}

function animateRepoModel() {
    const local = document.getElementById('model-local');
    const local2 = document.getElementById('model-local-2');
    const remote = document.getElementById('model-remote');
    const arrow = document.getElementById('model-arrow');

    local.classList.remove('visible');
    if (local2) local2.classList.remove('visible');
    remote.classList.remove('visible');
    arrow.classList.remove('visible');

    setTimeout(() => {
        local.classList.add('visible');
        if (local2) local2.classList.add('visible');
    }, 200);
    setTimeout(() => arrow.classList.add('visible'), 600);
    setTimeout(() => remote.classList.add('visible'), 800);
}

function animateBranches() {
    const ids = [
        'bv-main-c3', 'bv-main-l3', 'bv-main-c4', 'bv-main-tag',
        'bv-feat-c1', 'bv-feat-l1', 'bv-feat-c2', 'bv-feat-tag'
    ];

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('visible');
    });

    let delay = 300;
    // Main branch first
    ['bv-main-c3', 'bv-main-l3', 'bv-main-c4', 'bv-main-tag'].forEach(id => {
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.classList.add('visible');
        }, delay);
        delay += 250;
    });

    // wip branch
    ['bv-feat-c1', 'bv-feat-l1', 'bv-feat-c2', 'bv-feat-tag'].forEach(id => {
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.classList.add('visible');
        }, delay);
        delay += 250;
    });
}

function animateSummary() {
    const cards = ['sum-1', 'sum-2', 'sum-3', 'sum-4'];
    cards.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('visible');
    });

    let delay = 200;
    cards.forEach(id => {
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.classList.add('visible');
        }, delay);
        delay += 200;
    });
}

updateUI(0);

btnNext.addEventListener('click', () => {
    if (currentStep === steps.length - 1) {
        // Last step -> navigate to clone tutorial
        window.location.href = 'clone.html';
        return;
    }

    currentStep++;
    updateUI(currentStep);
    showScene(currentStep);

    if (currentStep === steps.length - 1) {
        btnReset.classList.remove('hidden');
    }
});

btnReset.addEventListener('click', () => {
    currentStep = 0;
    updateUI(0);
    showScene(0);
    btnReset.classList.add('hidden');
});
