(function () {
    'use strict';

    const PAGES = [
        { num: 1, file: 'clone.html', label: 'Git Clone', color: '#f59e0b' },
        { num: 2, file: 'edit_commit.html', label: 'Git Add & Commit', color: '#60a5fa' },
        { num: 3, file: 'push.html', label: 'Git Push', color: '#10b981' },
        { num: 4, file: 'git_pull_main.html', label: 'Git Pull Fast-Forward', color: '#f59e0b' },
        { num: 5, file: 'pull.html', label: 'Git Pull (Merge)', color: '#f59e0b' },
        { num: 6, file: 'merge_conflict.html', label: 'Merge Conflict', color: '#ef4444' },
        { num: 7, file: 'branch.html', label: 'Branch & Commits', color: '#a855f7' },
        { num: 8, file: 'push_branch.html', label: 'Git Push Branch', color: '#10b981' },
        { num: 9, file: 'merge_request.html', label: 'Merge Request', color: '#3b82f6' },
        { num: 10, file: 'checkout_main_pull_origin_main.html', label: 'Git Checkout & Pull', color: '#10b981' },
        { num: 11, file: 'reset.html', label: 'Git Reset --hard', color: '#ef4444' },
        { num: 12, file: 'reset_soft.html', label: 'Git Reset --soft', color: '#f59e0b' },
        { num: 13, file: 'squash.html', label: 'Git Squash', color: '#a855f7' },
        { num: 14, file: 'cherry_pick.html', label: 'Git Cherry-Pick', color: '#06b6d4' },
        { num: 15, file: 'merge_in_branch.html', label: 'Git Merge', color: '#8b5cf6' },
        { num: 16, file: 'rebase.html', label: 'Git Rebase', color: '#ec4899' },
        { num: 17, file: 'stash.html', label: 'Git Stash', color: '#f59e0b' },
        { num: 18, file: 'blame.html', label: 'Git Blame', color: '#6366f1' },
    ];

    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const isIndex = currentFile === 'index.html' || currentFile === '';

    // Sidebar HTML
    function buildSidebar() {
        const links = PAGES.map(p => {
            const isActive = p.file === currentFile;
            return `
            <a href="${p.file}" class="sidebar-link${isActive ? ' active' : ''}" title="${p.label}">
                <div class="nav-icon-container">
                    <span class="nav-num">${p.num}</span>
                    <span class="nav-dot" style="background:${p.color};"></span>
                </div>
                <span class="nav-label">${p.label}</span>
            </a>`;
        }).join('');

        return `
        <nav class="sidebar" id="sidebar" aria-label="Tutorial navigation">
            <div class="sidebar-header">
                <a href="index.html" class="sidebar-logo" title="Git Workflow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    <span class="sidebar-logo-text">Git Workflow</span>
                </a>
                <button class="sidebar-toggle-btn" id="sidebar-toggle-btn" title="Toggle sidebar" aria-label="Toggle sidebar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                </button>
            </div>

            <div class="sidebar-section-label">Directory</div>
            <div style="padding: 0 0.6rem 0.25rem;">
                <a href="index.html" class="sidebar-home-link${isIndex ? ' active' : ''}" title="All Tutorials">
                    <div class="nav-icon-container">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                        </svg>
                    </div>
                    <span class="nav-label">All Tutorials</span>
                </a>
            </div>

            <div class="sidebar-section-label">Tutorials</div>
            <div class="sidebar-nav">${links}</div>
        </nav>
        <div class="sidebar-overlay" id="sidebar-overlay"></div>`;
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
        const toggleBtn = document.getElementById('sidebar-toggle-btn');
        const overlay = document.getElementById('sidebar-overlay');
        const content = document.getElementById('sidebar-content');

        const STORAGE_KEY = 'git_sidebar_collapsed';
        // On narrow screens, always start completely collapsed off-screen
        const isNarrow = () => window.innerWidth <= 900;

        function toggleSidebar() {
            const isCollapsed = sidebar.classList.contains('collapsed');
            if (isCollapsed) {
                sidebar.classList.remove('collapsed');
                if (content && !isNarrow()) content.classList.remove('expanded');
                if (isNarrow()) overlay.classList.add('active');
                try { localStorage.setItem(STORAGE_KEY, '0'); } catch (e) { }
            } else {
                sidebar.classList.add('collapsed');
                if (content && !isNarrow()) content.classList.add('expanded');
                overlay.classList.remove('active');
                try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) { }
            }
        }

        // Restore state from localStorage
        let savedCollapsed = '0';
        try { savedCollapsed = localStorage.getItem(STORAGE_KEY) ?? '0'; } catch (e) { }
        
        if (isNarrow()) {
            sidebar.classList.add('collapsed');
            if (content) content.classList.add('expanded');
        } else if (savedCollapsed === '1') {
            sidebar.classList.add('collapsed');
            if (content) content.classList.add('expanded');
        }

        toggleBtn.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', () => {
            if (isNarrow() && !sidebar.classList.contains('collapsed')) {
                toggleSidebar();
            }
        });

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
