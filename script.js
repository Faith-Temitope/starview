// Global state
let currentProjectFilter = 'all';
let currentCategoryFilter = 'all';
let currentPeopleFilter = 'all';

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
});

// Show home view
function showHome() {
    document.getElementById('homeView').classList.remove('hidden');
    document.getElementById('projectDetailView').classList.add('hidden');
    document.getElementById('profileDetailView').classList.add('hidden');
    window.scrollTo(0, 0);
}

// Filter projects by type (all, company, student)
function filterProjects(filter) {
    currentProjectFilter = filter;
    
    // Update button styles
    document.querySelectorAll('[id^="filter-"]').forEach(btn => {
        btn.className = 'px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold';
    });
    document.getElementById('filter-' + filter).className = 'px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold';
    
    renderProjects();
}

// Filter projects by category
function filterByCategory() {
    currentCategoryFilter = document.getElementById('categoryFilter').value;
    renderProjects();
}

// Render projects
function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    
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
    
    // Render filtered projects
    if (filteredProjects.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-12"><p class="text-slate-500 text-lg">No projects found matching your filters.</p></div>';
        return;
    }
    
    filteredProjects.forEach(project => {
        const card = createProjectCard(project);
        grid.appendChild(card);
    });
}

// Create project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'card project-card fade-in';
    
    const techBadges = project.technologies.slice(0, 3).map(tech => 
        `<span class="badge badge-outline text-xs">${tech}</span>`
    ).join('');
    
    const moreTech = project.technologies.length > 3 
        ? `<span class="badge badge-outline text-xs">+${project.technologies.length - 3}</span>` 
        : '';
    
    const projectType = project.isCompanyProject 
        ? `<span class="badge badge-primary">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            Company
        </span>`
        : `<span class="badge badge-secondary">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
            </svg>
            Student
        </span>`;
    
    const createdBy = project.createdBy 
        ? `<p class="text-sm text-slate-500 mt-3">Created by ${project.createdBy}</p>` 
        : '';
    
    const githubBtn = project.githubUrl 
        ? `<button onclick="window.open('${project.githubUrl}', '_blank')" class="btn btn-outline btn-icon">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
        </button>` 
        : '';
    
    const liveBtn = project.liveUrl 
        ? `<button onclick="window.open('${project.liveUrl}', '_blank')" class="btn btn-outline btn-icon">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
        </button>` 
        : '';
    
    card.innerHTML = `
        <div class="aspect-video w-full overflow-hidden bg-slate-100">
            <img src="${project.imageUrl}" alt="${project.title}" class="w-full h-full object-cover image-zoom">
        </div>
        <div class="p-6">
            <div class="flex items-start justify-between gap-2 mb-2">
                ${projectType}
                <span class="badge badge-outline">${categoryLabels[project.category]}</span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">${project.title}</h3>
            <p class="text-slate-600 mb-4 line-clamp-2">${project.description}</p>
            <div class="flex flex-wrap gap-1">
                ${techBadges}
                ${moreTech}
            </div>
            ${createdBy}
        </div>
        <div class="px-6 pb-6 flex gap-2">
            <button onclick="showProjectDetail('${project.id}')" class="btn btn-primary flex-1">
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
    
    const detailView = document.getElementById('projectDetailView');
    
    const githubBtn = project.githubUrl 
        ? `<button onclick="window.open('${project.githubUrl}', '_blank')" class="btn btn-primary">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View on GitHub
        </button>` 
        : '';
    
    const liveBtn = project.liveUrl 
        ? `<button onclick="window.open('${project.liveUrl}', '_blank')" class="btn btn-outline">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            Live Demo
        </button>` 
        : '';
    
    const projectType = project.isCompanyProject 
        ? `<span class="badge badge-primary">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            Company Project
        </span>`
        : `<span class="badge badge-secondary">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
            </svg>
            Student Project
        </span>`;
    
    const createdBy = project.createdBy 
        ? `<p class="text-lg text-slate-600 mb-4">Created by ${project.createdBy}</p>` 
        : '';
    
    const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const techBadges = project.technologies.map(tech => 
        `<span class="badge badge-secondary mb-2">${tech}</span>`
    ).join('');
    
    const githubLink = project.githubUrl 
        ? `<a href="${project.githubUrl}" target="_blank" class="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span class="text-sm">GitHub Repository</span>
        </a>` 
        : '';
    
    const liveLink = project.liveUrl 
        ? `<a href="${project.liveUrl}" target="_blank" class="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            <span class="text-sm">Live Demo</span>
        </a>` 
        : '';
    
    detailView.innerHTML = `
        <div class="min-h-screen bg-white">
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <button onclick="showHome()" class="btn btn-outline mb-8">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Projects
                </button>

                <div class="mb-8">
                    <div class="flex flex-wrap items-center gap-3 mb-4">
                        ${projectType}
                        <span class="badge badge-outline">${categoryLabels[project.category]}</span>
                        <div class="flex items-center gap-1 text-sm text-slate-500">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            ${formattedDate}
                        </div>
                    </div>

                    <h1 class="text-4xl font-bold text-slate-900 mb-4">${project.title}</h1>
                    
                    ${createdBy}

                    <div class="flex flex-wrap gap-3">
                        ${githubBtn}
                        ${liveBtn}
                    </div>
                </div>

                <div class="aspect-video w-full overflow-hidden rounded-xl bg-slate-100 mb-8">
                    <img src="${project.imageUrl}" alt="${project.title}" class="w-full h-full object-cover">
                </div>

                <div class="grid lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-2">
                        <h2 class="text-2xl font-bold text-slate-900 mb-4">About this project</h2>
                        <p class="text-slate-600 mb-6 leading-relaxed">${project.description}</p>

                        <h3 class="text-xl font-bold text-slate-900 mb-4">Key Features</h3>
                        <ul class="space-y-2 text-slate-600 mb-6">
                            <li class="flex items-start gap-2">
                                <span class="text-blue-600 mt-1">•</span>
                                <span>Modern and responsive user interface</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-blue-600 mt-1">•</span>
                                <span>Optimized performance and loading times</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-blue-600 mt-1">•</span>
                                <span>Comprehensive testing and documentation</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-blue-600 mt-1">•</span>
                                <span>Scalable architecture and clean code</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <div class="bg-slate-50 rounded-xl p-6 sticky top-20">
                            <h3 class="text-lg font-bold text-slate-900 mb-4">Technologies Used</h3>
                            <div class="flex flex-wrap gap-2">
                                ${techBadges}
                            </div>

                            <div class="mt-6 pt-6 border-t border-slate-200">
                                <h3 class="text-lg font-bold text-slate-900 mb-3">Project Links</h3>
                                <div class="space-y-2">
                                    ${githubLink}
                                    ${liveLink}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('homeView').classList.add('hidden');
    detailView.classList.remove('hidden');
    window.scrollTo(0, 0);
}

// Filter people by role
function filterPeople(filter) {
    currentPeopleFilter = filter;
    
    // Update button styles
    document.querySelectorAll('[id^="people-filter-"]').forEach(btn => {
        btn.className = 'px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold';
    });
    document.getElementById('people-filter-' + filter).className = 'px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold';
    
    renderPeople();
}

// Render people
function renderPeople() {
    const grid = document.getElementById('peopleGrid');
    
    // Filter people
    const filteredPeople = people.filter(person => {
        return currentPeopleFilter === 'all' || person.role === currentPeopleFilter;
    });
    
    // Clear grid
    grid.innerHTML = '';
    
    // Render filtered people
    filteredPeople.forEach(person => {
        const card = createPersonCard(person);
        grid.appendChild(card);
    });
}

// Create person card element
function createPersonCard(person) {
    const card = document.createElement('div');
    card.className = 'card person-card fade-in';
    
    const skillBadges = person.skills.slice(0, 2).map(skill => 
        `<span class="badge badge-outline text-xs">${skill}</span>`
    ).join('');
    
    const moreSkills = person.skills.length > 2 
        ? `<span class="badge badge-outline text-xs">+${person.skills.length - 2}</span>` 
        : '';
    
    const personRole = person.role === 'staff' 
        ? `<span class="badge badge-primary">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
            </svg>
            Staff
        </span>`
        : `<span class="badge badge-secondary">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
            </svg>
            Student
        </span>`;
    
    const githubBtn = person.githubUrl 
        ? `<button onclick="window.open('${person.githubUrl}', '_blank')" class="btn btn-outline btn-icon" style="height: 2.25rem; width: 2.25rem; padding: 0;">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
        </button>` 
        : '';
    
    const linkedinBtn = person.linkedinUrl 
        ? `<button onclick="window.open('${person.linkedinUrl}', '_blank')" class="btn btn-outline btn-icon" style="height: 2.25rem; width: 2.25rem; padding: 0;">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
        </button>` 
        : '';
    
    const portfolioBtn = person.portfolioUrl 
        ? `<button onclick="window.open('${person.portfolioUrl}', '_blank')" class="btn btn-outline btn-icon" style="height: 2.25rem; width: 2.25rem; padding: 0;">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
        </button>` 
        : '';
    
    card.innerHTML = `
        <div class="aspect-square w-full overflow-hidden bg-slate-100">
            <img src="${person.imageUrl}" alt="${person.name}" class="w-full h-full object-cover">
        </div>
        <div class="p-6">
            <div class="mb-2">
                ${personRole}
            </div>
            <h3 class="text-lg font-bold text-slate-900">${person.name}</h3>
            <p class="text-sm text-slate-600 mb-4">${person.title}</p>
            <p class="text-sm text-slate-600 line-clamp-2 mb-3">${person.bio}</p>
            <div class="flex flex-wrap gap-1">
                ${skillBadges}
                ${moreSkills}
            </div>
        </div>
        <div class="px-6 pb-6 flex gap-2">
            <button onclick="showProfileDetail('${person.id}')" class="btn btn-primary flex-1 btn-sm">
                View Profile
            </button>
            <div class="flex gap-1">
                ${githubBtn}
                ${linkedinBtn}
                ${portfolioBtn}
            </div>
        </div>
    `;
    
    return card;
}

// Show profile detail
function showProfileDetail(personId) {
    const person = people.find(p => p.id === personId);
    if (!person) return;
    
    const detailView = document.getElementById('profileDetailView');
    
    // Find projects by this person
    const personProjects = projects.filter(p => p.createdBy === person.name);
    
    const personRole = person.role === 'staff' 
        ? `<span class="badge badge-primary mb-4">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
            </svg>
            Staff Member
        </span>`
        : `<span class="badge badge-secondary mb-4">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
            </svg>
            Student
        </span>`;
    
    const skillBadges = person.skills.map(skill => 
        `<span class="badge badge-secondary mb-2">${skill}</span>`
    ).join('');
    
    const githubLink = person.githubUrl 
        ? `<a href="${person.githubUrl}" target="_blank" class="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>GitHub</span>
        </a>` 
        : '';
    
    const linkedinLink = person.linkedinUrl 
        ? `<a href="${person.linkedinUrl}" target="_blank" class="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span>LinkedIn</span>
        </a>` 
        : '';
    
    const portfolioLink = person.portfolioUrl 
        ? `<a href="${person.portfolioUrl}" target="_blank" class="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            <span>Portfolio</span>
        </a>` 
        : '';
    
    let projectsSection = '';
    if (personProjects.length > 0) {
        const projectCards = personProjects.map(project => {
            const techBadges = project.technologies.slice(0, 4).map(tech => 
                `<span class="badge badge-outline text-xs mb-2">${tech}</span>`
            ).join('');
            
            const githubBtn = project.githubUrl 
                ? `<button onclick="window.open('${project.githubUrl}', '_blank')" class="btn btn-outline btn-sm">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                </button>` 
                : '';
            
            const liveBtn = project.liveUrl 
                ? `<button onclick="window.open('${project.liveUrl}', '_blank')" class="btn btn-outline btn-sm">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                    Live Demo
                </button>` 
                : '';
            
            return `
                <div class="card mb-4">
                    <div class="p-6">
                        <div class="flex items-start gap-4">
                            <div class="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                <img src="${project.imageUrl}" alt="${project.title}" class="w-full h-full object-cover">
                            </div>
                            <div class="flex-1">
                                <h3 class="text-lg font-bold text-slate-900 mb-1">${project.title}</h3>
                                <p class="text-sm text-slate-600 line-clamp-2 mb-3">${project.description}</p>
                                <div class="flex flex-wrap gap-2 mb-3">
                                    ${techBadges}
                                </div>
                                <div class="flex gap-2">
                                    ${githubBtn}
                                    ${liveBtn}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        projectsSection = `
            <div>
                <h2 class="text-2xl font-bold text-slate-900 mb-4">Projects</h2>
                ${projectCards}
            </div>
        `;
    }
    
    detailView.innerHTML = `
        <div class="min-h-screen bg-white">
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <button onclick="showHome()" class="btn btn-outline mb-8">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Team
                </button>

                <div class="grid lg:grid-cols-3 gap-8 mb-12">
                    <div class="lg:col-span-1">
                        <div class="aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 mb-6">
                            <img src="${person.imageUrl}" alt="${person.name}" class="w-full h-full object-cover">
                        </div>
                        
                        <div class="bg-slate-50 rounded-xl p-6">
                            <h3 class="text-lg font-bold text-slate-900 mb-4">Connect</h3>
                            <div class="space-y-3">
                                ${githubLink}
                                ${linkedinLink}
                                ${portfolioLink}
                                <button class="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                    <span>Email</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="lg:col-span-2">
                        <div class="mb-4">
                            ${personRole}
                        </div>

                        <h1 class="text-4xl font-bold text-slate-900 mb-2">${person.name}</h1>
                        <p class="text-xl text-slate-600 mb-6">${person.title}</p>

                        <div class="mb-8">
                            <h2 class="text-2xl font-bold text-slate-900 mb-4">About</h2>
                            <p class="text-slate-600 leading-relaxed">${person.bio}</p>
                        </div>

                        <div class="mb-8">
                            <h2 class="text-2xl font-bold text-slate-900 mb-4">Skills & Expertise</h2>
                            <div class="flex flex-wrap gap-2">
                                ${skillBadges}
                            </div>
                        </div>

                        ${projectsSection}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('homeView').classList.add('hidden');
    detailView.classList.remove('hidden');
    window.scrollTo(0, 0);
}
