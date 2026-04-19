(function () {
    'use strict';

    const PAGES = [
        { num: 1,  file: 'clone.html',          label: 'Git Clone',              color: '#f59e0b' },
        { num: 2,  file: 'edit_commit.html',    label: 'Git Add & Commit',       color: '#60a5fa' },
        { num: 3,  file: 'push.html',           label: 'Git Push',               color: '#10b981' },
        { num: 4,  file: 'git_pull_main.html',  label: 'Git Pull Fast-Forward',  color: '#f59e0b' },
        { num: 5,  file: 'pull.html',           label: 'Git Pull (Merge)',        color: '#f59e0b' },
        { num: 6,  file: 'merge_conflict.html', label: 'Merge Conflict',         color: '#ef4444' },
        { num: 7,  file: 'branch.html',         label: 'Branch & Commits',       color: '#a855f7' },
        { num: 8,  file: 'push_branch.html',    label: 'Git Push Branch',        color: '#10b981' },
        { num: 9,  file: 'merge_request.html',  label: 'Merge Requests',         color: '#3b82f6' },
        { num: 10, file: 'checkout_main_pull_origin_main.html', label: 'Git Checkout & Pull', color: '#10b981' },
        { num: 11, file: 'reset.html',          label: 'Git Reset --hard',       color: '#ef4444' },
        { num: 12, file: 'reset_soft.html',     label: 'Git Reset --soft',       color: '#f59e0b' },
        { num: 13, file: 'squash.html',         label: 'Git Squash',             color: '#a855f7' },
        { num: 14, file: 'cherry_pick.html',    label: 'Git Cherry-Pick',        color: '#06b6d4' },
        { num: 15, file: 'merge_in_branch.html', label: 'Git Merge',              color: '#8b5cf6' },
        { num: 16, file: 'rebase.html',         label: 'Git Rebase',             color: '#ec4899' },
        { num: 17, file: 'stash.html',          label: 'Git Stash',              color: '#f59e0b' },
        { num: 18, file: 'blame.html',          label: 'Git Blame',              color: '#6366f1' },
    ];

    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const isIndex = currentFile === 'index.html' || currentFile === '';

    // Sidebar HTML
    function buildSidebar() {
        const links = PAGES.map(p => {
            const isActive = p.file === currentFile;
            return `
            <a href="${p.file}" class="sidebar-link${isActive ? ' active' : ''}">
                <span class="nav-num">${p.num}</span>
                <span class="nav-dot" style="background:${p.color};"></span>
                <span>${p.label}</span>
            </a>`;
        }).join('');

        return `
        <nav class="sidebar" id="sidebar" aria-label="Tutorial navigation">
            <div class="sidebar-header">
                <a href="index.html" class="sidebar-logo" title="Directory">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    <span class="sidebar-logo-text">Git Workflow</span>
                </a>
                <button class="sidebar-close" id="sidebar-close" title="Close sidebar" aria-label="Close sidebar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>

            <div class="sidebar-section-label">Directory</div>
            <div style="padding: 0 0.6rem 0.25rem;">
                <a href="index.html" class="sidebar-home-link${isIndex ? ' active' : ''}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    All Tutorials
                </a>
            </div>

            <div class="sidebar-section-label">Tutorials</div>
            <div class="sidebar-nav">${links}</div>
        </nav>
        <div class="sidebar-overlay" id="sidebar-overlay"></div>
        <button class="sidebar-toggle hidden" id="sidebar-toggle" title="Open sidebar" aria-label="Open sidebar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
        </button>`;
    }

    // Wrap page body content into sidebar layout
    function injectSidebar() {
        // Insert sidebar HTML before body content
        const wrapper = document.createElement('div');
        wrapper.innerHTML = buildSidebar();
        // Insert each node before body's first child
        Array.from(wrapper.children).forEach(el => document.body.insertBefore(el, document.body.firstChild));

        // Wrap the app-container in a .sidebar-content div
        const appContainer = document.querySelector('.app-container');
        if (appContainer) {
            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'sidebar-content' + (isIndex ? ' index-sidebar-content' : '');
            contentWrapper.id = 'sidebar-content';
            appContainer.parentNode.insertBefore(contentWrapper, appContainer);
            contentWrapper.appendChild(appContainer);
        }

        setupToggle();
    }

    function setupToggle() {
        const sidebar = document.getElementById('sidebar');
        const toggle = document.getElementById('sidebar-toggle');
        const closeBtn = document.getElementById('sidebar-close');
        const overlay = document.getElementById('sidebar-overlay');
        const content = document.getElementById('sidebar-content');

        const STORAGE_KEY = 'git_sidebar_open';
        // On narrow screens, start collapsed
        const isNarrow = () => window.innerWidth <= 1100;

        function open() {
            sidebar.classList.remove('collapsed');
            toggle.classList.add('hidden');
            if (!isNarrow() && content) content.classList.remove('expanded');
            if (isNarrow()) overlay.classList.add('active');
            try { localStorage.setItem(STORAGE_KEY, '1'); } catch(e) {}
        }

        function close() {
            sidebar.classList.add('collapsed');
            toggle.classList.remove('hidden');
            if (content) content.classList.add('expanded');
            overlay.classList.remove('active');
            try { localStorage.setItem(STORAGE_KEY, '0'); } catch(e) {}
        }

        // Restore state from localStorage
        let savedOpen = '1';
        try { savedOpen = localStorage.getItem(STORAGE_KEY) ?? '1'; } catch(e) {}
        if (isNarrow() || savedOpen === '0') {
            close();
        } else {
            open();
        }

        closeBtn.addEventListener('click', close);
        toggle.addEventListener('click', open);
        overlay.addEventListener('click', close);

        // Scroll active link into view
        const activeLink = document.querySelector('.sidebar-link.active');
        if (activeLink) {
            activeLink.scrollIntoView({ block: 'nearest' });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectSidebar);
    } else {
        injectSidebar();
    }
})();
