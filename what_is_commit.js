const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');
const btnReset = document.getElementById('btn-reset');
const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

const steps = [
    {
        num: 1,
        title: "You Made Changes",
        desc: "You have been editing files in your project \u2014 modifying scripts, adding new ones, or removing old code. Right now these changes only exist in your <strong>working directory</strong>. Git sees them, but has not recorded them yet.",
        actionBtn: "What Happens Next?",
        color: "#3b82f6"
    },
    {
        num: 2,
        title: "A Commit is a Snapshot",
        desc: "When you run <code>git add</code> followed by <code>git commit</code>, Git bundles all your staged changes into a single <strong>snapshot</strong> \u2014 a permanent record of what every file looked like at that moment. This snapshot is called a <em>commit</em>. It also stores who made it, when, and a message you write to describe the change.",
        actionBtn: "What is the Hash?",
        color: "#3b82f6"
    },
    {
        num: 3,
        title: "The Commit Hash",
        desc: "Every commit gets a unique <strong>SHA-1 hash</strong> \u2014 a long hexadecimal string like <code>a3f7c2e9b1d0...</code>. Git calculates this from the commit\u2019s content, author, timestamp, and parent. Because the hash is derived from the data itself, even the tiniest change produces a completely different hash. You usually only need the first 7 characters to identify a commit.",
        actionBtn: "How Do Commits Connect?",
        color: "#f59e0b"
    },
    {
        num: 4,
        title: "A Chain of History",
        desc: "Each commit stores a pointer to its <strong>parent commit</strong> \u2014 the commit that came before it. This creates a linked chain. By following these parent pointers, Git can reconstruct the entire history of your project, commit by commit, all the way back to the very first one.",
        actionBtn: "Summarize It",
        color: "#10b981"
    },
    {
        num: 5,
        title: "Commits in a Nutshell",
        desc: "A commit is the fundamental unit of Git. It is an <strong>immutable snapshot</strong> of your project at a point in time, identified by a unique hash, linked to its parent, and annotated with a message. Everything in Git \u2014 branches, merges, reverts \u2014 is built on top of commits.",
        actionBtn: "",
        color: "#a855f7"
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

    // Hide next button on last step
    if (stepIndex === steps.length - 1) {
        btnNext.classList.add('hidden');
    } else {
        btnNext.classList.remove('hidden');
    }

    // Show/hide prev button
    if (stepIndex > 0) {
        btnPrev.classList.remove('hidden');
    } else {
        btnPrev.classList.add('hidden');
    }

    // Show reset on last step
    if (stepIndex === steps.length - 1) {
        btnReset.classList.remove('hidden');
    } else {
        btnReset.classList.add('hidden');
    }
}

function showScene(index) {
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    const scene = document.getElementById(`scene-${index + 1}`);
    if (scene) scene.classList.add('active');

    if (index === 0) animateFiles();
    if (index === 1) animateSnapshot();
    if (index === 2) animateHash();
    if (index === 3) animateChain();
    if (index === 4) animateSummary();
}

function animateFiles() {
    const rows = ['fr-1', 'fr-2', 'fr-3', 'fr-4'];
    rows.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('visible');
    });

    let delay = 200;
    rows.forEach(id => {
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.classList.add('visible');
        }, delay);
        delay += 200;
    });
}

function animateSnapshot() {
    const arrow = document.getElementById('snap-arrow-1');
    const envelope = document.getElementById('snap-envelope');

    arrow.classList.remove('visible');
    envelope.classList.remove('visible');

    setTimeout(() => arrow.classList.add('visible'), 200);
    setTimeout(() => envelope.classList.add('visible'), 600);
}

function animateHash() {
    const disp = document.getElementById('hash-disp');
    const parts = ['hp-1', 'hp-2', 'hp-3', 'hp-4'];

    disp.classList.remove('visible');
    parts.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('visible');
    });

    setTimeout(() => disp.classList.add('visible'), 200);

    let delay = 600;
    parts.forEach(id => {
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.classList.add('visible');
        }, delay);
        delay += 200;
    });
}

function animateChain() {
    const commits = ['cc-1', 'cc-2', 'cc-3'];
    const links = ['cl-1', 'cl-2'];

    commits.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('visible');
    });
    links.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('visible');
    });

    let delay = 200;
    commits.forEach((id, i) => {
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.classList.add('visible');
            if (i > 0 && links[i - 1]) {
                document.getElementById(links[i - 1]).classList.add('visible');
            }
        }, delay);
        delay += 400;
    });
}

function animateSummary() {
    const cards = ['cs-1', 'cs-2', 'cs-3', 'cs-4'];
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

// Initialize
updateUI(0);
animateFiles();

btnNext.addEventListener('click', () => {
    if (currentStep >= steps.length - 1) return;
    currentStep++;
    updateUI(currentStep);
    showScene(currentStep);
});

btnPrev.addEventListener('click', () => {
    if (currentStep <= 0) return;
    currentStep--;
    updateUI(currentStep);
    showScene(currentStep);
});

btnReset.addEventListener('click', () => {
    currentStep = 0;
    updateUI(0);
    showScene(0);
});
