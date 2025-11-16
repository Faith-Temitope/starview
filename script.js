// Global state
let currentProjectFilter = 'all';
let currentCategoryFilter = 'all';
let currentPeopleFilter = 'all';
let statsAnimated = false;

// Category labels mapping
const categoryLabels = {
    'website': 'Website',
    'data-analysis': 'Data Analysis',
    'mobile-app': 'Mobile App',
    'ai-ml': 'AI/ML',
    'other': 'Other',
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderProjects();
    renderPeople();
    setupIntersectionObserver();
});

// Setup intersection observer for stats animation
function setupIntersectionObserver() {
    const statsSection = document.querySelector('.stats-grid');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                animateStats();
                statsAnimated = true;
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
}

// Animate counting stats
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCount = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target + '+';
            }
        };
        
        updateCount();
    });
}

// Show home view
function showHome() {
    document.getElementById('home-view').classList.remove('hidden');
    document.getElementById('project-detail-view').classList.add('hidden');
    document.getElementById('profile-detail-view').classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Filter projects by type
function filterProjects(filter) {
    currentProjectFilter = filter;
    
    // Update button states
    document.querySelectorAll('[id^="filter-"]').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('filter-' + filter).classList.add('active');
    
    renderProjects();
}

// Filter projects by category
function filterByCategory() {
    currentCategoryFilter = document.getElementById('category-filter').value;
    renderProjects();
}

// Render projects
function renderProjects() {
    const grid = document.getElementById('projects-grid');
    
    // Filter projects
    const filteredProjects = projects.filter(project => {
        const matchesType = 
            currentProjectFilter === 'all' || 
            (currentProjectFilter === 'company' && project.isCompanyProject) || 
            (currentProjectFilter === 'student' && !project.isCompanyProject);
        
        const matchesCategory = 
            currentCategoryFilter === 'all' || 
            project.category === currentCategoryFilter;

        return matchesType && matchesCategory;
    });
    
    // Clear grid
    grid.innerHTML = '';
    
    // Show empty state
    if (filteredProjects.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem;"><p style="color: var(--text-light); font-size: 1.125rem;">No projects found matching your filters.</p></div>';
        return;
    }
    
    // Render filtered projects
    filteredProjects.forEach((project, index) => {
        const card = createProjectCard(project);
        card.style.animationDelay = `${index * 0.1}s`;
        grid.appendChild(card);
    });
}

// Create project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'card fade-in';
    
    const typeIcon = project.isCompanyProject 
        ? '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>'
        : '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>';
    
    const typeLabel = project.isCompanyProject ? 'Company' : 'Student';
    const typeClass = project.isCompanyProject ? 'badge-primary' : 'badge-secondary';
    
    const techBadges = project.technologies.slice(0, 3).map(tech => 
        `<span class="badge badge-outline">${tech}</span>`
    ).join('');
    
    const moreTech = project.technologies.length > 3 
        ? `<span class="badge badge-outline">+${project.technologies.length - 3}</span>` 
        : '';
    
    const createdBy = project.createdBy 
        ? `<p class="card-meta">Created by ${project.createdBy}</p>` 
        : '';
    
    const githubBtn = project.githubUrl 
        ? `<button onclick="window.open('${project.githubUrl}', '_blank')" class="button button-outline icon-button" title="View on GitHub">
            <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
        </button>` 
        : '';
    
    const liveBtn = project.liveUrl 
        ? `<button onclick="window.open('${project.liveUrl}', '_blank')" class="button button-outline icon-button" title="View Live Demo">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
        </button>` 
        : '';
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${project.imageUrl}" alt="${project.title}">
        </div>
        <div class="card-content">
            <div class="card-header">
                <span class="badge ${typeClass}">
                    ${typeIcon}
                    ${typeLabel}
                </span>
                <span class="badge badge-outline">${categoryLabels[project.category]}</span>
            </div>
            <h3 class="card-title">${project.title}</h3>
            <p class="card-description">${project.description}</p>
            <div class="badge-group">
                ${techBadges}
                ${moreTech}
            </div>
            ${createdBy}
        </div>
        <div class="card-footer">
            <button onclick="showProjectDetail('${project.id}')" class="button button-blue flex-1">
                View Details
            </button>
            ${githubBtn}
            ${liveBtn}
        </div>
    `;
    
    return card;
}

// Show project detail
function showProjectDetail(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const detailView = document.getElementById('project-detail-view');
    
    const typeIcon = project.isCompanyProject 
        ? '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>'
        : '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>';
    
    const typeLabel = project.isCompanyProject ? 'Company Project' : 'Student Project';
    const typeClass = project.isCompanyProject ? 'badge-primary' : 'badge-secondary';
    
    const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const githubBtn = project.githubUrl 
        ? `<button onclick="window.open('${project.githubUrl}', '_blank')" class="button button-blue">
            <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View on GitHub
        </button>` 
        : '';
    
    const liveBtn = project.liveUrl 
        ? `<button onclick="window.open('${project.liveUrl}', '_blank')" class="button button-outline">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            Live Demo
        </button>` 
        : '';
    
    // Find creator and create link
    let createdBySection = '';
    if (project.createdBy) {
        const creator = people.find(p => p.name === project.createdBy);
        if (creator) {
            createdBySection = `
                <p class="detail-subtitle">
                    Created by 
                    <a href="#" onclick="event.preventDefault(); showProfileDetail('${creator.id}')" class="creator-link">
                        ${project.createdBy}
                        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </a>
                </p>
            `;
        } else {
            createdBySection = `<p class="detail-subtitle">Created by ${project.createdBy}</p>`;
        }
    }
    
    const techBadges = project.technologies.map(tech => 
        `<span class="badge badge-secondary">${tech}</span>`
    ).join(' ');
    
    const githubLink = project.githubUrl 
        ? `<li>
            <a href="${project.githubUrl}" target="_blank" class="sidebar-link">
                <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>GitHub Repository</span>
            </a>
        </li>` 
        : '';
    
    const liveLink = project.liveUrl 
        ? `<li>
            <a href="${project.liveUrl}" target="_blank" class="sidebar-link">
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                <span>Live Demo</span>
            </a>
        </li>` 
        : '';
    
    detailView.innerHTML = `
        <div class="detail-view">
            <div class="detail-container">
                <button onclick="showHome()" class="button button-outline back-button">
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Projects
                </button>

                <div class="detail-header">
                    <div class="detail-meta">
                        <span class="badge ${typeClass}">
                            ${typeIcon}
                            ${typeLabel}
                        </span>
                        <span class="badge badge-outline">${categoryLabels[project.category]}</span>
                        <div class="detail-meta-item">
                            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            ${formattedDate}
                        </div>
                    </div>

                    <h1 class="detail-title">${project.title}</h1>
                    
                    ${createdBySection}

                    <div class="detail-actions">
                        ${githubBtn}
                        ${liveBtn}
                    </div>
                </div>

                <div class="detail-image">
                    <img src="${project.imageUrl}" alt="${project.title}">
                </div>

                <div class="detail-grid">
                    <div>
                        <div class="detail-section">
                            <h2 class="detail-section-title">About this project</h2>
                            <p class="detail-section-content">${project.description}</p>
                        </div>

                        <div class="detail-section">
                            <h3 class="detail-section-title">Key Features</h3>
                            <ul class="detail-list">
                                <li class="detail-list-item">
                                    <span class="detail-list-bullet">•</span>
                                    <span>Modern and responsive user interface</span>
                                </li>
                                <li class="detail-list-item">
                                    <span class="detail-list-bullet">•</span>
                                    <span>Optimized performance and loading times</span>
                                </li>
                                <li class="detail-list-item">
                                    <span class="detail-list-bullet">•</span>
                                    <span>Comprehensive testing and documentation</span>
                                </li>
                                <li class="detail-list-item">
                                    <span class="detail-list-bullet">•</span>
                                    <span>Scalable architecture and clean code</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <div class="detail-sidebar">
                            <div class="sidebar-section">
                                <h3 class="sidebar-title">Technologies Used</h3>
                                <div class="badge-group">
                                    ${techBadges}
                                </div>
                            </div>

                            ${(githubLink || liveLink) ? `
                            <div class="sidebar-section">
                                <h3 class="sidebar-title">Project Links</h3>
                                <ul class="sidebar-links">
                                    ${githubLink}
                                    ${liveLink}
                                </ul>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('home-view').classList.add('hidden');
    detailView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Filter people by role
function filterPeople(filter) {
    currentPeopleFilter = filter;
    
    // Update button states
    document.querySelectorAll('[id^="people-filter-"]').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('people-filter-' + filter).classList.add('active');
    
    renderPeople();
}

// Render people
function renderPeople() {
    const grid = document.getElementById('people-grid');
    
    // Filter people
    const filteredPeople = people.filter(person => {
        return currentPeopleFilter === 'all' || person.role === currentPeopleFilter;
    });
    
    // Clear grid
    grid.innerHTML = '';
    
    // Render filtered people
    filteredPeople.forEach((person, index) => {
        const card = createPersonCard(person);
        card.style.animationDelay = `${index * 0.1}s`;
        grid.appendChild(card);
    });
}

// Create person card element
function createPersonCard(person) {
    const card = document.createElement('div');
    card.className = 'card fade-in';
    
    const roleIcon = person.role === 'staff' 
        ? '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>'
        : '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>';
    
    const roleLabel = person.role === 'staff' ? 'Staff' : 'Student';
    const roleClass = person.role === 'staff' ? 'badge-primary' : 'badge-secondary';
    
    const skillBadges = person.skills.slice(0, 2).map(skill => 
        `<span class="badge badge-outline">${skill}</span>`
    ).join('');
    
    const moreSkills = person.skills.length > 2 
        ? `<span class="badge badge-outline">+${person.skills.length - 2}</span>` 
        : '';
    
    const socialButtons = [];
    
    if (person.githubUrl) {
        socialButtons.push(`
            <button onclick="window.open('${person.githubUrl}', '_blank')" class="button button-outline icon-button" title="GitHub">
                <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
            </button>
        `);
    }
    
    if (person.linkedinUrl) {
        socialButtons.push(`
            <button onclick="window.open('${person.linkedinUrl}', '_blank')" class="button button-outline icon-button" title="LinkedIn">
                <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
            </button>
        `);
    }
    
    if (person.portfolioUrl) {
        socialButtons.push(`
            <button onclick="window.open('${person.portfolioUrl}', '_blank')" class="button button-outline icon-button" title="Portfolio">
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
            </button>
        `);
    }
    
    card.innerHTML = `
        <div class="person-card-image">
            <img src="${person.imageUrl}" alt="${person.name}">
        </div>
        <div class="card-content">
            <div style="margin-bottom: 0.5rem;">
                <span class="badge ${roleClass}">
                    ${roleIcon}
                    ${roleLabel}
                </span>
            </div>
            <h3 class="card-title">${person.name}</h3>
            <p style="font-size: 0.875rem; color: var(--text-medium); margin-bottom: 1rem;">${person.title}</p>
            <p class="card-description">${person.bio}</p>
            <div class="badge-group">
                ${skillBadges}
                ${moreSkills}
            </div>
        </div>
        <div class="card-footer">
            <button onclick="showProfileDetail('${person.id}')" class="button button-blue flex-1 button-small">
                View Profile
            </button>
            <div style="display: flex; gap: 0.25rem;">
                ${socialButtons.join('')}
            </div>
        </div>
    `;
    
    return card;
}

// Show profile detail
function showProfileDetail(personId) {
    const person = people.find(p => p.id === personId);
    if (!person) return;
    
    const detailView = document.getElementById('profile-detail-view');
    
    // Find projects by this person
    const personProjects = projects.filter(p => p.createdBy === person.name);
    
    const roleIcon = person.role === 'staff' 
        ? '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>'
        : '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>';
    
    const roleLabel = person.role === 'staff' ? 'Staff Member' : 'Student';
    const roleClass = person.role === 'staff' ? 'badge-primary' : 'badge-secondary';
    
    const skillBadges = person.skills.map(skill => 
        `<span class="badge badge-secondary">${skill}</span>`
    ).join(' ');
    
    const connectLinks = [];
    
    if (person.githubUrl) {
        connectLinks.push(`
            <li>
                <a href="${person.githubUrl}" target="_blank" class="connect-link">
                    <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>GitHub</span>
                </a>
            </li>
        `);
    }
    
    if (person.linkedinUrl) {
        connectLinks.push(`
            <li>
                <a href="${person.linkedinUrl}" target="_blank" class="connect-link">
                    <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span>LinkedIn</span>
                </a>
            </li>
        `);
    }
    
    if (person.portfolioUrl) {
        connectLinks.push(`
            <li>
                <a href="${person.portfolioUrl}" target="_blank" class="connect-link">
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                    <span>Portfolio</span>
                </a>
            </li>
        `);
    }
    
    connectLinks.push(`
        <li>
            <button class="connect-link" style="border: none; background: none; cursor: pointer; width: 100%; text-align: left;">
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>Email</span>
            </button>
        </li>
    `);
    
    let projectsSection = '';
    if (personProjects.length > 0) {
        const projectCards = personProjects.map(project => {
            const techBadges = project.technologies.slice(0, 4).map(tech => 
                `<span class="badge badge-outline">${tech}</span>`
            ).join(' ');
            
            const githubBtn = project.githubUrl 
                ? `<button onclick="window.open('${project.githubUrl}', '_blank')" class="button button-outline button-small">
                    <svg class="icon" fill="currentColor" viewBox="0 0 24 24" style="width: 0.75rem; height: 0.75rem;">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                </button>` 
                : '';
            
            const liveBtn = project.liveUrl 
                ? `<button onclick="window.open('${project.liveUrl}', '_blank')" class="button button-outline button-small">
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 0.75rem; height: 0.75rem;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                    Live Demo
                </button>` 
                : '';
            
            return `
                <div class="project-mini-card">
                    <div class="project-mini-header">
                        <div class="project-mini-image">
                            <img src="${project.imageUrl}" alt="${project.title}">
                        </div>
                        <div style="flex: 1;">
                            <h3 class="project-mini-title">${project.title}</h3>
                            <p class="project-mini-description">${project.description}</p>
                        </div>
                    </div>
                    <div class="badge-group" style="margin-bottom: 0.75rem;">
                        ${techBadges}
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        ${githubBtn}
                        ${liveBtn}
                    </div>
                </div>
            `;
        }).join('');
        
        projectsSection = `
            <div class="detail-section">
                <h2 class="detail-section-title">Projects</h2>
                ${projectCards}
            </div>
        `;
    }
    
    detailView.innerHTML = `
        <div class="detail-view">
            <div class="detail-container">
                <button onclick="showHome()" class="button button-outline back-button">
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Team
                </button>

                <div class="profile-grid">
                    <div>
                        <div class="profile-image-wrapper">
                            <img src="${person.imageUrl}" alt="${person.name}">
                        </div>
                        
                        <div class="profile-sidebar">
                            <h3 class="sidebar-title">Connect</h3>
                            <ul class="connect-links">
                                ${connectLinks.join('')}
                            </ul>
                        </div>
                    </div>

                    <div>
                        <div style="margin-bottom: 1rem;">
                            <span class="badge ${roleClass}">
                                ${roleIcon}
                                ${roleLabel}
                            </span>
                        </div>

                        <h1 class="detail-title">${person.name}</h1>
                        <p class="detail-subtitle">${person.title}</p>

                        <div class="detail-section">
                            <h2 class="detail-section-title">About</h2>
                            <p class="detail-section-content">${person.bio}</p>
                        </div>

                        <div class="detail-section">
                            <h2 class="detail-section-title">Skills & Expertise</h2>
                            <div class="badge-group">
                                ${skillBadges}
                            </div>
                        </div>

                        ${projectsSection}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('home-view').classList.add('hidden');
    detailView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
