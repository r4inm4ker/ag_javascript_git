const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');
const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');

const steps = [
    {
        num: 1,
        title: "The Big Picture",
        desc: "In a professional software studio, writing code is only <em>one piece</em> of the puzzle. You also need to <strong>track changes</strong>, <strong>build packages</strong>, and <strong>manage dependencies</strong>. Three specialised tools work together to cover this entire lifecycle: <strong>Git</strong>, <strong>Waf</strong>, and <strong>Oz</strong>.",
        actionBtn: "What does Git do?",
        color: "#8b5cf6"
    },
    {
        num: 2,
        title: "Git — Version Control",
        desc: "<strong>Git</strong> is a <em>version control system</em>. It tracks every change made to your source code over time. Multiple developers can work on the same codebase simultaneously, each on their own branch, and Git keeps a complete history of every snapshot. If something breaks, you can always roll back to a known-good state.",
        actionBtn: "What does Waf do?",
        color: "#3b82f6"
    },
    {
        num: 3,
        title: "Waf — Build System",
        desc: "<strong>Waf</strong> is a <em>build system</em>. Once your code is ready, Waf compiles, links, and packages it into a versioned release (e.g. <code>mayaTools-1.2.0</code>). It reads a <code>wscript</code> configuration file to know what to build and how, producing artefacts that can be distributed and installed consistently across machines.",
        actionBtn: "What does Oz do?",
        color: "#10b981"
    },
    {
        num: 4,
        title: "Oz — Environment & Dependencies",
        desc: "<strong>Oz</strong> is an <em>environment configuration tool</em>. When you need to work with specific versions of tools, you simply reference a profile — for example <code>oz --using vp23</code> configures your shell with <code>maya-2024</code>, <code>python-3.10</code>, and <code>PySide2</code>. Oz resolves all the dependencies for you so everything just works — no version conflicts, no missing libraries.",
        actionBtn: "How do they fit together?",
        color: "#f59e0b"
    },
    {
        num: 5,
        title: "The Full Pipeline",
        desc: "The workflow flows naturally: you <strong>write & track</strong> code with Git, <strong>build & version</strong> packages with Waf, and <strong>resolve & run</strong> environments with Oz. Each tool owns one responsibility, and together they give your team a reliable, reproducible pipeline from first commit to final deployment.",
        actionBtn: "Next: What is Git? →",
        color: "#ec4899"
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

    btnNext.classList.remove('hidden');
    if (stepIndex === steps.length - 1) {
        btnReset.classList.remove('hidden');
    }
}

function showScene(index) {
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    const scene = document.getElementById(`scene-${index + 1}`);
    if (scene) scene.classList.add('active');

    if (index === 0) animateOverview();
    if (index === 1) animateGit();
    if (index === 2) animateWaf();
    if (index === 3) animateRez();
    if (index === 4) animatePipeline();
}

function animateOverview() {
    const cards = document.querySelectorAll('#scene-1 .eco-card');
    cards.forEach(c => c.classList.remove('visible'));
    let delay = 200;
    cards.forEach(c => {
        setTimeout(() => c.classList.add('visible'), delay);
        delay += 250;
    });
}

function animateGit() {
    const items = document.querySelectorAll('#scene-2 .git-snap');
    const lines = document.querySelectorAll('#scene-2 .git-line');
    items.forEach(i => i.classList.remove('visible'));
    lines.forEach(l => l.classList.remove('visible'));
    let delay = 200;
    items.forEach((item, i) => {
        setTimeout(() => {
            item.classList.add('visible');
            if (i > 0 && lines[i - 1]) lines[i - 1].classList.add('visible');
        }, delay);
        delay += 300;
    });
}

function animateWaf() {
    const els = document.querySelectorAll('#scene-3 .waf-stage');
    const arrows = document.querySelectorAll('#scene-3 .waf-arrow');
    els.forEach(e => e.classList.remove('visible'));
    arrows.forEach(a => a.classList.remove('visible'));
    let delay = 200;
    els.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add('visible');
            if (i > 0 && arrows[i - 1]) arrows[i - 1].classList.add('visible');
        }, delay);
        delay += 350;
    });
}

function animateRez() {
    const pkgs = document.querySelectorAll('#scene-4 .rez-pkg');
    const shell = document.getElementById('rez-shell');
    pkgs.forEach(p => p.classList.remove('visible'));
    if (shell) shell.classList.remove('visible');
    let delay = 200;
    pkgs.forEach(p => {
        setTimeout(() => p.classList.add('visible'), delay);
        delay += 200;
    });
    setTimeout(() => { if (shell) shell.classList.add('visible'); }, delay + 100);
}

function animatePipeline() {
    const steps = document.querySelectorAll('#scene-5 .pipe-step');
    const connectors = document.querySelectorAll('#scene-5 .pipe-conn');
    steps.forEach(s => s.classList.remove('visible'));
    connectors.forEach(c => c.classList.remove('visible'));
    let delay = 200;
    steps.forEach((s, i) => {
        setTimeout(() => {
            s.classList.add('visible');
            if (i > 0 && connectors[i - 1]) connectors[i - 1].classList.add('visible');
        }, delay);
        delay += 400;
    });
}

// Init
updateUI(0);
showScene(0);

btnNext.addEventListener('click', () => {
    if (currentStep === steps.length - 1) {
        window.location.href = 'what_is_git.html';
        return;
    }
    currentStep++;
    updateUI(currentStep);
    showScene(currentStep);
});

btnReset.addEventListener('click', () => {
    currentStep = 0;
    updateUI(0);
    showScene(0);
    btnReset.classList.add('hidden');
});
