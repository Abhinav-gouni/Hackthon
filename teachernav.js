// script.js

// State Management
let currentRole = 'teacher';
let currentPage = 'dashboard';
let selectedSubject = null;

// Mock Data
const subjects = [
    {
        id: 1,
        name: 'Data Structures',
        code: 'CS201',
        progress: 80,
        attendance: 85,
        topics: [
            { id: 1, name: 'Arrays and Linked Lists', completed: true, date: '2024-02-10' },
            { id: 2, name: 'Stacks and Queues', completed: true, date: '2024-02-15' },
            { id: 3, name: 'Trees and Graphs', completed: true, date: '2024-02-20' },
            { id: 4, name: 'Hash Tables', completed: false },
            { id: 5, name: 'Heaps and Priority Queues', completed: false },
            { id: 6, name: 'Advanced Tree Structures', completed: false }
        ]
    },
    {
        id: 2,
        name: 'Algorithms',
        code: 'CS301',
        progress: 65,
        attendance: 78,
        topics: [
            { id: 7, name: 'Sorting Algorithms', completed: true, date: '2024-02-12' },
            { id: 8, name: 'Searching Algorithms', completed: true, date: '2024-02-18' },
            { id: 9, name: 'Dynamic Programming', completed: false },
            { id: 10, name: 'Greedy Algorithms', completed: false },
            { id: 11, name: 'Graph Algorithms', completed: false }
        ]
    },
    {
        id: 3,
        name: 'Database Systems',
        code: 'CS202',
        progress: 90,
        attendance: 88,
        topics: [
            { id: 12, name: 'ER Modeling', completed: true, date: '2024-02-05' },
            { id: 13, name: 'SQL Basics', completed: true, date: '2024-02-10' },
            { id: 14, name: 'Normalization', completed: true, date: '2024-02-15' },
            { id: 15, name: 'Transactions', completed: true, date: '2024-02-20' },
            { id: 16, name: 'Indexing', completed: false }
        ]
    }
];

const assignments = [
    { id: 1, title: 'Binary Search Tree Implementation', subject: 'Data Structures', dueDate: '2024-03-25', submissions: 42, total: 65 },
    { id: 2, title: 'Sorting Algorithm Analysis', subject: 'Algorithms', dueDate: '2024-03-22', submissions: 38, total: 65 },
    { id: 3, title: 'Database Normalization', subject: 'Database Systems', dueDate: '2024-03-20', submissions: 55, total: 65 }
];

const classStats = {
    totalClasses: 45,
    completedClasses: 38,
    pendingClasses: 7,
    syllabusProgress: 75,
    totalStudents: 65,
    averageAttendance: 82,
    pendingAssignments: 3
};

// Navigation Items
const teacherNavItems = [
    { icon: 'fa-home', label: 'Dashboard', page: 'dashboard' },
    { icon: 'fa-book-open', label: 'Syllabus Tracker', page: 'syllabus' },
    { icon: 'fa-tasks', label: 'Assignments', page: 'assignments' },
    { icon: 'fa-users', label: 'Class Overview', page: 'attendance' }
];

const studentNavItems = [
    { icon: 'fa-home', label: 'Dashboard', page: 'dashboard' },
    { icon: 'fa-calendar', label: 'Attendance', page: 'attendance' },
    { icon: 'fa-trophy', label: 'Grades & GPA', page: 'grades' },
    { icon: 'fa-tasks', label: 'Assignments', page: 'assignments' },
    { icon: 'fa-briefcase', label: 'Opportunities', page: 'opportunities' }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderNavigation();
    renderContent();
    
    // Set default selected subject
    if (subjects.length > 0) {
        selectedSubject = subjects[0];
    }

    // Mobile menu toggle
    document.getElementById('menuToggle').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });
});

// Switch Role
function switchRole(role) {
    currentRole = role;
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    document.getElementById('role-title').textContent = 
        role === 'teacher' ? 'Teacher Command Center' : 'Student Command Center';
    
    // Update user details
    document.querySelector('.user-details h4').textContent = 
        role === 'teacher' ? 'Dr. Sarah Johnson' : 'John Doe';
    document.querySelector('.user-details p').textContent = 
        role === 'teacher' ? 'Professor' : 'Computer Science Student';
    
    renderNavigation();
    renderContent();
}

// Render Navigation
function renderNavigation() {
    const navItems = currentRole === 'teacher' ? teacherNavItems : studentNavItems;
    const navHtml = navItems.map(item => `
        <div class="nav-item ${currentPage === item.page ? 'active' : ''}" onclick="navigateTo('${item.page}')">
            <i class="fas ${item.icon}"></i>
            <span>${item.label}</span>
        </div>
    `).join('');
    
    document.getElementById('sidebar-nav').innerHTML = navHtml;
}

// Navigate to page
function navigateTo(page) {
    currentPage = page;
    renderNavigation();
    renderContent();
    
    // Close mobile menu
    document.getElementById('sidebar').classList.remove('active');
}

// Render Content
function renderContent() {
    const contentArea = document.getElementById('contentArea');
    
    if (currentRole === 'teacher') {
        switch(currentPage) {
            case 'dashboard':
                contentArea.innerHTML = renderTeacherDashboard();
                setTimeout(() => {
                    initCharts();
                }, 100);
                break;
            case 'syllabus':
                contentArea.innerHTML = renderSyllabusTracker();
                break;
            case 'assignments':
                contentArea.innerHTML = renderAssignments();
                break;
            case 'attendance':
                contentArea.innerHTML = renderAttendanceOverview();
                break;
            default:
                contentArea.innerHTML = renderTeacherDashboard();
        }
    } else {
        // Student pages
        switch(currentPage) {
            case 'dashboard':
                contentArea.innerHTML = renderStudentDashboard();
                break;
            case 'attendance':
                contentArea.innerHTML = renderStudentAttendance();
                break;
            case 'grades':
                contentArea.innerHTML = renderGrades();
                break;
            case 'assignments':
                contentArea.innerHTML = renderStudentAssignments();
                break;
            case 'opportunities':
                contentArea.innerHTML = renderOpportunities();
                break;
            default:
                contentArea.innerHTML = renderStudentDashboard();
        }
    }
}

// Render Teacher Dashboard
function renderTeacherDashboard() {
    return `
        <div class="page-header">
            <h2>Teacher Dashboard</h2>
            <button class="btn-primary" onclick="openAssignmentModal()">
                <i class="fas fa-plus"></i>
                New Assignment
            </button>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon purple">
                    <i class="fas fa-book-open"></i>
                </div>
                <div class="stat-info">
                    <h4>Syllabus Progress</h4>
                    <div class="stat-value">${classStats.syllabusProgress}%</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon yellow">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-info">
                    <h4>Pending Classes</h4>
                    <div class="stat-value">${classStats.pendingClasses}</div>
                    <div class="stat-subtext">out of ${classStats.totalClasses} total</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                    <h4>Average Attendance</h4>
                    <div class="stat-value">${classStats.averageAttendance}%</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon blue">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-info">
                    <h4>Active Assignments</h4>
                    <div class="stat-value">${classStats.pendingAssignments}</div>
                </div>
            </div>
        </div>

        <div class="grid-2">
            <div class="card">
                <div class="card-header">
                    <h3>Subject Progress Overview</h3>
                    <a href="#" onclick="navigateTo('syllabus')">View All</a>
                </div>
                <div>
                    ${subjects.map(subject => `
                        <div class="subject-progress">
                            <div class="subject-info">
                                <span class="subject-name">${subject.name}</span>
                                <span class="subject-code">${subject.code}</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${subject.progress}%"></div>
                            </div>
                            <div class="progress-stats">
                                <span>Progress: ${subject.progress}%</span>
                                <span>Attendance: ${subject.attendance}%</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3>Syllabus Coverage</h3>
                </div>
                <div class="chart-container">
                    <canvas id="syllabusChart"></canvas>
                </div>
                <div style="text-align: center; margin-top: 1rem;">
                    <div style="font-size: 2.5rem; font-weight: 700; color: #4f46e5;">75%</div>
                    <div style="color: #6b7280; font-size: 0.9rem;">Overall Progress</div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Attendance Trend</h3>
            </div>
            <div class="chart-container">
                <canvas id="attendanceChart"></canvas>
            </div>
        </div>

        <div class="card" style="margin-top: 1.5rem;">
            <div class="card-header">
                <h3>Recent Assignments</h3>
                <a href="#" onclick="navigateTo('assignments')">View All</a>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Assignment</th>
                            <th>Subject</th>
                            <th>Due Date</th>
                            <th>Submissions</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${assignments.map(assignment => `
                            <tr>
                                <td>${assignment.title}</td>
                                <td>${assignment.subject}</td>
                                <td>${assignment.dueDate}</td>
                                <td>${assignment.submissions}/${assignment.total}</td>
                                <td>
                                    <span class="status-badge ${assignment.submissions < assignment.total ? 'status-pending' : 'status-completed'}">
                                        ${assignment.submissions < assignment.total ? 'Pending' : 'Completed'}
                                    </span>
                                </td>
                                <td>
                                    <a href="#" class="action-link">View Details</a>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Render Syllabus Tracker
function renderSyllabusTracker() {
    return `
        <div class="page-header">
            <h2>Syllabus Tracker</h2>
            <button class="btn-primary" onclick="openModal()">
                <i class="fas fa-plus"></i>
                Add New Topic
            </button>
        </div>

        <div class="syllabus-container">
            <div class="subject-list">
                <h3 style="margin-bottom: 1rem;">Subjects</h3>
                ${subjects.map(subject => {
                    const completedTopics = subject.topics.filter(t => t.completed).length;
                    const progress = Math.round((completedTopics / subject.topics.length) * 100);
                    return `
                        <div class="subject-item ${selectedSubject?.id === subject.id ? 'active' : ''}" 
                             onclick="selectSubject(${subject.id})">
                            <h4>${subject.name}</h4>
                            <p>${subject.code}</p>
                            <div class="progress-bar" style="margin-bottom: 0.5rem;">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #6b7280;">
                                <span>Progress: ${progress}%</span>
                                <span>${completedTopics}/${subject.topics.length} topics</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="topic-list">
                ${selectedSubject ? `
                    <div class="topic-header">
                        <div>
                            <h3>${selectedSubject.name}</h3>
                            <p style="color: #6b7280; font-size: 0.9rem;">${selectedSubject.code}</p>
                        </div>
                        <button class="btn-secondary" onclick="openTopicModal()">
                            <i class="fas fa-plus"></i>
                            Add Topic
                        </button>
                    </div>

                    <div>
                        ${selectedSubject.topics.map(topic => `
                            <div class="topic-item">
                                <div class="topic-check">
                                    <i class="fas ${topic.completed ? 'fa-check-circle completed' : 'fa-circle pending'}" 
                                       onclick="toggleTopic(${selectedSubject.id}, ${topic.id})"></i>
                                    <span class="${topic.completed ? 'completed' : ''}" 
                                          style="${topic.completed ? 'text-decoration: line-through; color: #9ca3af;' : ''}">
                                        ${topic.name}
                                    </span>
                                    ${topic.completed && topic.date ? `
                                        <span style="font-size: 0.7rem; color: #9ca3af; margin-left: 0.5rem;">
                                            Completed: ${topic.date}
                                        </span>
                                    ` : ''}
                                </div>
                                <div class="topic-actions">
                                    <i class="fas fa-edit" onclick="editTopic(${topic.id})"></i>
                                    <i class="fas fa-trash" onclick="deleteTopic(${selectedSubject.id}, ${topic.id})"></i>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="summary-box">
                        <div class="summary-item">
                            <div class="summary-label">Total Topics</div>
                            <div class="summary-value">${selectedSubject.topics.length}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Completed</div>
                            <div class="summary-value" style="color: #10b981;">${selectedSubject.topics.filter(t => t.completed).length}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Pending</div>
                            <div class="summary-value" style="color: #f59e0b;">${selectedSubject.topics.filter(t => !t.completed).length}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Progress</div>
                            <div class="summary-value">${Math.round((selectedSubject.topics.filter(t => t.completed).length / selectedSubject.topics.length) * 100)}%</div>
                        </div>
                    </div>
                ` : '<p>Select a subject to view topics</p>'}
            </div>
        </div>
    `;
}

// Render Assignments Page
function renderAssignments() {
    return `
        <div class="page-header">
            <h2>Assignments</h2>
            <button class="btn-primary" onclick="openAssignmentModal()">
                <i class="fas fa-plus"></i>
                Create Assignment
            </button>
        </div>

        <div class="card">
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Subject</th>
                            <th>Due Date</th>
                            <th>Submissions</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${assignments.map(assignment => `
                            <tr>
                                <td>${assignment.title}</td>
                                <td>${assignment.subject}</td>
                                <td>${assignment.dueDate}</td>
                                <td>${assignment.submissions}/${assignment.total}</td>
                                <td>
                                    <span class="status-badge ${assignment.submissions < assignment.total ? 'status-pending' : 'status-completed'}">
                                        ${assignment.submissions < assignment.total ? 'Active' : 'Completed'}
                                    </span>
                                </td>
                                <td>
                                    <a href="#" class="action-link">Edit</a> | 
                                    <a href="#" class="action-link">View</a>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Render Attendance Overview
function renderAttendanceOverview() {
    return `
        <div class="page-header">
            <h2>Class Overview</h2>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon purple">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                    <h4>Total Students</h4>
                    <div class="stat-value">${classStats.totalStudents}</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="stat-info">
                    <h4>Avg. Attendance</h4>
                    <div class="stat-value">${classStats.averageAttendance}%</div>
                </div>
            </div>
        </div>

        <div class="grid-2">
            <div class="card">
                <div class="card-header">
                    <h3>Subject-wise Attendance</h3>
                </div>
                ${subjects.map(subject => `
                    <div class="subject-progress">
                        <div class="subject-info">
                            <span class="subject-name">${subject.name}</span>
                            <span>${subject.attendance}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${subject.attendance}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="card">
                <div class="card-header">
                    <h3>Attendance Distribution</h3>
                </div>
                <div class="attendance-grid">
                    <div class="attendance-item">
                        <div class="attendance-value">45</div>
                        <div class="attendance-label">Above 85%</div>
                    </div>
                    <div class="attendance-item">
                        <div class="attendance-value">12</div>
                        <div class="attendance-label">75-85%</div>
                    </div>
                    <div class="attendance-item">
                        <div class="attendance-value">6</div>
                        <div class="attendance-label">65-75%</div>
                    </div>
                    <div class="attendance-item">
                        <div class="attendance-value">2</div>
                        <div class="attendance-label">Below 65%</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Render Student Dashboard
function renderStudentDashboard() {
    return `
        <div class="page-header">
            <h2>Student Dashboard</h2>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon purple">
                    <i class="fas fa-calendar-check"></i>
                </div>
                <div class="stat-info">
                    <h4>Current Attendance</h4>
                    <div class="stat-value">82%</div>
                    <div class="stat-subtext">Safe to skip: 2 classes</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green">
                    <i class="fas fa-trophy"></i>
                </div>
                <div class="stat-info">
                    <h4>Current CGPA</h4>
                    <div class="stat-value">3.6</div>
                    <div class="stat-subtext">Target: 3.8</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon yellow">
                    <i class="fas fa-tasks"></i>
                </div>
                <div class="stat-info">
                    <h4>Pending Tasks</h4>
                    <div class="stat-value">4</div>
                    <div class="stat-subtext">2 due this week</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon blue">
                    <i class="fas fa-briefcase"></i>
                </div>
                <div class="stat-info">
                    <h4>Opportunities</h4>
                    <div class="stat-value">6</div>
                    <div class="stat-subtext">New internships</div>
                </div>
            </div>
        </div>

        <div class="grid-2">
            <div class="card">
                <div class="card-header">
                    <h3>Attendance Alert</h3>
                </div>
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Data Structures</span>
                        <span style="color: #f59e0b;">77%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 77%; background-color: #f59e0b;"></div>
                    </div>
                    <div style="font-size: 0.8rem; color: #f59e0b; margin-top: 0.25rem;">
                        ⚠️ Yellow Flag - Below 80%
                    </div>
                </div>
                <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Algorithms</span>
                        <span style="color: #ef4444;">72%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 72%; background-color: #ef4444;"></div>
                    </div>
                    <div style="font-size: 0.8rem; color: #ef4444; margin-top: 0.25rem;">
                        ⚠️ Red Flag - Below 75%
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3>Upcoming Deadlines</h3>
                </div>
                <div>
                    <div style="padding: 0.75rem 0; border-bottom: 1px solid #e5e7eb;">
                        <div style="font-weight: 600;">Binary Tree Implementation</div>
                        <div style="font-size: 0.85rem; color: #6b7280;">Data Structures - Due Tomorrow</div>
                    </div>
                    <div style="padding: 0.75rem 0; border-bottom: 1px solid #e5e7eb;">
                        <div style="font-weight: 600;">Sorting Algorithm Analysis</div>
                        <div style="font-size: 0.85rem; color: #6b7280;">Algorithms - Due in 3 days</div>
                    </div>
                    <div style="padding: 0.75rem 0;">
                        <div style="font-weight: 600;">Database Project</div>
                        <div style="font-size: 0.85rem; color: #6b7280;">Database Systems - Due in 5 days</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Placeholder functions for student pages
function renderStudentAttendance() {
    return `
        <div class="page-header">
            <h2>Attendance Tracker</h2>
        </div>
        <div class="card">
            <p>Student attendance tracking interface will be displayed here.</p>
        </div>
    `;
}

function renderGrades() {
    return `
        <div class="page-header">
            <h2>Grades & GPA</h2>
        </div>
        <div class="card">
            <p>Grades and GPA tracking interface will be displayed here.</p>
        </div>
    `;
}

function renderStudentAssignments() {
    return `
        <div class="page-header">
            <h2>My Assignments</h2>
        </div>
        <div class="card">
            <p>Student assignments interface will be displayed here.</p>
        </div>
    `;
}

function renderOpportunities() {
    return `
        <div class="page-header">
            <h2>Opportunities</h2>
        </div>
        <div class="card">
            <p>Internships and career opportunities will be displayed here.</p>
        </div>
    `;
}

// Chart Initialization
function initCharts() {
    // Syllabus Chart
    const syllabusCtx = document.getElementById('syllabusChart');
    if (syllabusCtx) {
        new Chart(syllabusCtx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Pending'],
                datasets: [{
                    data: [75, 25],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Attendance Chart
    const attendanceCtx = document.getElementById('attendanceChart');
    if (attendanceCtx) {
        new Chart(attendanceCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                datasets: [{
                    label: 'Class Average Attendance',
                    data: [88, 85, 82, 80, 78, 82],
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}

// Topic Functions
function selectSubject(subjectId) {
    selectedSubject = subjects.find(s => s.id === subjectId);
    renderContent();
}

function toggleTopic(subjectId, topicId) {
    const subject = subjects.find(s => s.id === subjectId);
    const topic = subject.topics.find(t => t.id === topicId);
    topic.completed = !topic.completed;
    topic.date = topic.completed ? new Date().toISOString().split('T')[0] : undefined;
    renderContent();
}

function deleteTopic(subjectId, topicId) {
    if (confirm('Are you sure you want to delete this topic?')) {
        const subject = subjects.find(s => s.id === subjectId);
        subject.topics = subject.topics.filter(t => t.id !== topicId);
        renderContent();
    }
}

function editTopic(topicId) {
    alert('Edit functionality would open a modal with the topic details.');
}

// Modal Functions
function openModal() {
    document.getElementById('addTopicModal').classList.add('active');
}

function openTopicModal() {
    document.getElementById('addTopicModal').classList.add('active');
}

function openAssignmentModal() {
    document.getElementById('addAssignmentModal').classList.add('active');
}

function closeModal() {
    document.getElementById('addTopicModal').classList.remove('active');
    document.getElementById('topicName').value = '';
}

function closeAssignmentModal() {
    document.getElementById('addAssignmentModal').classList.remove('active');
    document.getElementById('assignmentTitle').value = '';
    document.getElementById('assignmentSubject').value = '';
    document.getElementById('assignmentDueDate').value = '';
}

function addTopic() {
    const topicName = document.getElementById('topicName').value;
    if (topicName && selectedSubject) {
        const newTopic = {
            id: Date.now(),
            name: topicName,
            completed: false
        };
        selectedSubject.topics.push(newTopic);
        closeModal();
        renderContent();
    } else {
        alert('Please enter a topic name');
    }
}

function createAssignment() {
    const title = document.getElementById('assignmentTitle').value;
    const subject = document.getElementById('assignmentSubject').value;
    const dueDate = document.getElementById('assignmentDueDate').value;
    
    if (title && subject && dueDate) {
        // In a real app, you would send this to a server
        alert(`Assignment "${title}" created successfully!`);
        closeAssignmentModal();
    } else {
        alert('Please fill in all fields');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const topicModal = document.getElementById('addTopicModal');
    const assignmentModal = document.getElementById('addAssignmentModal');
    if (event.target === topicModal) {
        closeModal();
    }
    if (event.target === assignmentModal) {
        closeAssignmentModal();
    }
}