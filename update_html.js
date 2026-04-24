const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir);

const htmlFiles = files.filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // add to explanation-panel
    if (content.includes('<div class="controls">') && content.includes('id="step-description"')) {
        // Only insert if it doesn't already have command-display
        if (!content.includes('id="command-display"')) {
            content = content.replace(
                /<div class="controls">/g, 
                `    <div class="command-display" id="command-display">\n                        $&nbsp;<span id="command-text"></span>\n                    </div>\n                    <div class="controls">`
            );
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated HTML: ${file}`);
        }
    }
});

const jsFiles = files.filter(f => f.endsWith('.js'));
jsFiles.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('function updateUI') && content.includes('stepNumber.textContent')) {
        if (!content.includes('command-display')) {
            // Find the updateUI function block end
            // Just replace the end of updateUI(stepIndex) or updateUI(idx)
            content = content.replace(
                /stepNumber\.style\.boxShadow = [^;]+;/g, 
                `$&
    const cmdDisplay = document.getElementById('command-display');
    const cmdText = document.getElementById('command-text');
    if (cmdDisplay && cmdText) {
        if (step.command) {
            cmdText.textContent = step.command;
            cmdDisplay.style.display = 'block';
        } else {
            cmdDisplay.style.display = 'none';
        }
    }`
            );
            
            // Now, naively populate command for steps based on actionBtn.
            // regex to find actionBtn: "git ..." and add command: "git ..."
            // Note: will require manual review later if any are missed.
            content = content.replace(/actionBtn:\s*"([^"]+)"\s*(,?)\s*color:\s*"([^"]+)"([^}]*)}/g, (match, actionBtn, comma, color, rest) => {
                let cmd = "";
                if (actionBtn.startsWith("git ") || actionBtn.match(/^[\w\s-]+$/) && false) {
                    // if it starts with git, maybe we want to use it
                }
                const hasCommand = match.includes('command:');
                if (actionBtn.startsWith("git ") && !hasCommand) {
                    return `actionBtn: "${actionBtn}"${comma}\n        color: "${color}",\n        command: "${actionBtn}"${rest}}`;
                }
                return match; // fallback
            });

            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated JS: ${file}`);
        }
    }
});
