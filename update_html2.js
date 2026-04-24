const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir);

const jsFiles = files.filter(f => f.endsWith('.js') && !['sidebar.js', 'update_html.js', 'update_html2.js'].includes(f));

jsFiles.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Add command field to steps array based on actionBtn
    content = content.replace(/actionBtn:\s*"([^"]+)"\s*(,?)\s*color:\s*"([^"]+)"([^}]*)}/g, (match, actionBtn, comma, color, rest) => {
        const hasCommand = match.includes('command:');
        if (actionBtn.startsWith("git ") && !hasCommand) {
            return `actionBtn: "${actionBtn}"${comma}\n        color: "${color}",\n        command: "${actionBtn}"${rest}}`;
        }
        return match;
    });

    // Handle single quote actionBtn as well (if any)
    content = content.replace(/actionBtn:\s*'([^']+)'\s*(,?)\s*color:\s*"([^"]+)"([^}]*)}/g, (match, actionBtn, comma, color, rest) => {
        const hasCommand = match.includes('command:');
        if (actionBtn.startsWith("git ") && !hasCommand) {
            return `actionBtn: '${actionBtn}'${comma}\n        color: "${color}",\n        command: "${actionBtn}"${rest}}`;
        }
        return match;
    });

    // 2. Modify updateUI to inject command into stepDescription
    // Be careful with $ using $$ in replace string
    const textContentMatch = /stepDescription\.textContent\s*=\s*step\.desc;/g;
    if (content.match(textContentMatch)) {
        content = content.replace(textContentMatch, `if (step.command) {
        stepDescription.innerHTML = step.desc + '<br><br><code class="command-code">$$ ' + step.command + '</code>';
    } else {
        stepDescription.innerHTML = step.desc;
    }`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated JS: ${file}`);
    }
});
