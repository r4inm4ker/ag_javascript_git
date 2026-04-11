const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');
const stepNumber = document.getElementById('step-number');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');
const codeLinesContainer = document.getElementById('code-lines');
const blameDetails = document.getElementById('blame-details');
const commitCard = document.getElementById('commit-card');
const blameHash = document.getElementById('blame-hash');
const blameAuthor = document.getElementById('blame-author');
const blameDate = document.getElementById('blame-date');

const mockCode = [
    { line: 1, text: 'def calculate_sum(a, b):', hash: 'a1b2c3d', author: 'Alice Smith', date: '2023-10-01' },
    { line: 2, text: '    return a + b', hash: 'b2c3d4e', author: 'Bob Jones', date: '2023-10-05' },
    { line: 3, text: '', hash: 'c3d4e5f', author: 'Charlie Brown', date: '2023-10-10' },
    { line: 4, text: 'result = calculate_sum(5, 10)', hash: 'd4e5f6g', author: 'Alice Smith', date: '2023-10-12' },
    { line: 5, text: 'print(f"The result is: {result}")', hash: 'e5f6g7h', author: 'Diana Prince', date: '2023-10-15' },
];

const steps = [
    {
        num: 1,
        title: "What is Git Blame?",
        desc: "git blame allows you to examine a file line-by-line to see exactly who last modified each line and in which commit.",
        actionBtn: "Run git blame",
        color: "#10b981"
    },
    {
        num: 2,
        title: "Analyzing the File",
        desc: "Now the file is 'blamed'. Each line is linked to a specific commit. Click on any line to see the full details of the change.",
        actionBtn: "Explore Lines",
        color: "#3b82f6"
    }
];

let currentStepIndex = 0;

function init() {
    updateUI(0);
    renderCode(false);
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

function renderCode(interactive) {
    codeLinesContainer.innerHTML = '';
    mockCode.forEach(item => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'blame-line';
        
        if (!interactive) {
            lineDiv.style.cursor = 'default';
            lineDiv.style.opacity = '0.7';
        }
        
        lineDiv.innerHTML = `
            <span class="line-number">${item.line}</span>
            <span class="line-content">${item.text}</span>
        `;

        if (interactive) {
            lineDiv.addEventListener('click', () => {
                highlightLine(lineDiv, item);
            });
        }
        
        codeLinesContainer.appendChild(lineDiv);
    });
}

function renderBlameList() {
    // Clear the blame details panel but keep the commit card
    const emptyState = blameDetails.querySelector('.empty-state');
    if (emptyState) emptyState.classList.add('hidden');
    
    // Create a container for the blame rows
    const listContainer = document.createElement('div');
    listContainer.className = 'blame-list';
    listContainer.id = 'blame-list-container';

    mockCode.forEach(item => {
        const row = document.createElement('div');
        row.className = 'blame-row';
        row.innerHTML = `
            <div class="author-col">${item.author}</div>
            <div class="code-col">${item.text || ' '}</div>
        `;
        row.addEventListener('click', () => {
            highlightLine(row, item);
        });
        listContainer.appendChild(row);
    });

    // Insert the list at the top of the blame-details panel
    blameDetails.prepend(listContainer);
}

function highlightLine(element, data) {
    // Remove active class from all lines in both panels
    document.querySelectorAll('.blame-line, .blame-row').forEach(l => l.classList.remove('active'));
    element.classList.add('active');

    // Update commit card content
    blameHash.textContent = `hash: ${data.hash}`;
    blameAuthor.textContent = data.author;
    blameDate.textContent = data.date;

    // Show the card
    commitCard.classList.add('visible');
}

btnNext.addEventListener('click', () => {
    if (currentStepIndex === 0) {
        currentStepIndex++;
        updateUI(currentStepIndex);
        renderCode(true);
        renderBlameList();
        btnNext.classList.add('hidden');
        btnReset.classList.remove('hidden');
    }
});

btnReset.addEventListener('click', () => {
    currentStepIndex = 0;
    updateUI(currentStepIndex);
    renderCode(false);
    
    // Remove the blame list
    const listContainer = document.getElementById('blame-list-container');
    if (listContainer) listContainer.remove();
    
    btnNext.classList.remove('hidden');
    btnReset.classList.add('hidden');
    
    commitCard.classList.remove('visible');
    const emptyState = blameDetails.querySelector('.empty-state');
    if (emptyState) {
        emptyState.classList.remove('hidden');
    }
});

init();