-- Create database
CREATE DATABASE IF NOT EXISTS academiflow;
USE academiflow;

-- ==================== USERS & AUTHENTICATION ====================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role ENUM('student', 'teacher') NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    profile_pic VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Student details table
CREATE TABLE IF NOT EXISTS student_details (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    branch VARCHAR(100) NOT NULL,
    semester INT NOT NULL,
    batch_year VARCHAR(20),
    target_cgpa DECIMAL(3,2),
    enrollment_year INT,
    current_semester INT,
    total_credits INT DEFAULT 0,
    earned_credits INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_roll (roll_number),
    INDEX idx_branch (branch)
);

-- Teacher details table
CREATE TABLE IF NOT EXISTS teacher_details (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100),
    qualification TEXT,
    joining_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_employee (employee_id)
);

-- ==================== ACADEMIC STRUCTURE ====================

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    credits INT NOT NULL,
    department VARCHAR(100),
    semester INT,
    is_lab BOOLEAN DEFAULT FALSE,
    INDEX idx_code (subject_code),
    INDEX idx_semester (semester)
);

-- Teacher subject assignment
CREATE TABLE IF NOT EXISTS teacher_subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    subject_id INT NOT NULL,
    academic_year VARCHAR(20),
    section VARCHAR(10),
    FOREIGN KEY (teacher_id) REFERENCES teacher_details(user_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_teacher_subject (teacher_id, subject_id, academic_year, section)
);

-- Student enrollment in subjects
CREATE TABLE IF NOT EXISTS student_subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    academic_year VARCHAR(20),
    semester INT,
    enrollment_date DATE DEFAULT (CURRENT_DATE),
    status ENUM('enrolled', 'completed', 'dropped') DEFAULT 'enrolled',
    FOREIGN KEY (student_id) REFERENCES student_details(user_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_subject (student_id, subject_id, academic_year)
);

-- ==================== ATTENDANCE TRACKING ====================

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'late', 'holiday') NOT NULL,
    marked_by INT,
    remarks TEXT,
    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_details(user_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (marked_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_attendance (student_id, subject_id, date)
);

-- Attendance predictions and calculations
CREATE TABLE IF NOT EXISTS attendance_predictions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    total_classes INT DEFAULT 0,
    attended_classes INT DEFAULT 0,
    current_percentage DECIMAL(5,2),
    can_skip INT DEFAULT 0,
    needed_to_reach_75 INT DEFAULT 0,
    status ENUM('safe', 'warning', 'danger') DEFAULT 'safe',
    last_calculated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_details(user_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_subject_pred (student_id, subject_id)
);

-- ==================== MARKS & GPA TRACKING ====================

-- Marks table (consolidated)
CREATE TABLE IF NOT EXISTS marks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    exam_type ENUM('internal1', 'internal2', 'mid_term', 'assignment', 'quiz', 'project', 'external') NOT NULL,
    marks_obtained DECIMAL(5,2) NOT NULL,
    total_marks DECIMAL(5,2) NOT NULL,
    weightage DECIMAL(5,2) DEFAULT 100,
    exam_date DATE,
    remarks TEXT,
    entered_by INT,
    entered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_details(user_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (entered_by) REFERENCES users(id) ON DELETE SET NULL
);

-- GPA tracking per semester
CREATE TABLE IF NOT EXISTS gpa_tracking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    semester INT NOT NULL,
    sgpa DECIMAL(3,2),
    cgpa DECIMAL(3,2),
    credits_attempted INT,
    credits_earned INT,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_details(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_semester (student_id, semester)
);

-- Subject-wise grade points
CREATE TABLE IF NOT EXISTS subject_grades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    semester INT NOT NULL,
    total_marks DECIMAL(5,2),
    grade_point DECIMAL(3,2),
    grade VARCHAR(2),
    is_backlog BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (student_id) REFERENCES student_details(user_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_subject_grade (student_id, subject_id, semester)
);

-- ==================== ASSIGNMENTS ====================

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subject_id INT NOT NULL,
    teacher_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    total_marks DECIMAL(5,2),
    deadline DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teacher_details(user_id) ON DELETE CASCADE,
    INDEX idx_deadline (deadline)
);

-- Assignment submissions
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_url VARCHAR(255),
    marks_obtained DECIMAL(5,2),
    feedback TEXT,
    status ENUM('submitted', 'graded', 'late', 'resubmit') DEFAULT 'submitted',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    graded_at TIMESTAMP NULL,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student_details(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_submission (assignment_id, student_id)
);

-- ==================== CAREER OPPORTUNITIES ====================

-- Career opportunities
CREATE TABLE IF NOT EXISTS opportunities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    company VARCHAR(100),
    type ENUM('internship', 'hackathon', 'placement', 'certification', 'workshop') NOT NULL,
    deadline DATE,
    description TEXT,
    eligibility TEXT,
    location VARCHAR(100),
    stipend VARCHAR(100),
    duration VARCHAR(50),
    apply_link VARCHAR(500),
    posted_by INT,
    posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_type (type),
    INDEX idx_deadline_opp (deadline)
);

-- Student opportunity applications
CREATE TABLE IF NOT EXISTS student_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    opportunity_id INT NOT NULL,
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('applied', 'shortlisted', 'interview', 'selected', 'rejected', 'withdrawn') DEFAULT 'applied',
    notes TEXT,
    resume_url VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_details(user_id) ON DELETE CASCADE,
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (student_id, opportunity_id)
);

-- ==================== SESSIONS & TOKENS ====================

-- User sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (session_token)
);

-- ==================== SAMPLE DATA ====================

-- Insert sample subjects
INSERT INTO subjects (subject_code, subject_name, credits, department, semester) VALUES
('MTH101', 'Mathematics - I', 4, 'CSE', 1),
('PHY102', 'Physics', 4, 'CSE', 1),
('CS101', 'Programming Fundamentals', 4, 'CSE', 1),
('ENG101', 'Technical English', 2, 'CSE', 1),
('MTH201', 'Mathematics - II', 4, 'CSE', 2),
('CS201', 'Data Structures', 4, 'CSE', 2),
('CS202', 'Digital Logic', 3, 'CSE', 2),
('MTH301', 'Discrete Mathematics', 4, 'CSE', 3),
('CS301', 'Database Management Systems', 4, 'CSE', 3),
('CS302', 'Operating Systems', 4, 'CSE', 3),
('CS303', 'Computer Networks', 4, 'CSE', 4),
('CS304', 'Software Engineering', 3, 'CSE', 4);

-- Insert sample opportunities
INSERT INTO opportunities (title, company, type, deadline, description, eligibility, location, stipend) VALUES
('Summer Internship 2024', 'Google', 'internship', '2024-05-30', 'Software Engineering Intern', 'CGPA > 8.0, 3rd year+', 'Bangalore/Hybrid', '₹50-70k/month'),
('Smart India Hackathon 2024', 'Ministry of Education', 'hackathon', '2024-05-01', '36-hour national hackathon', 'All years, any branch', 'Online + Finals', '₹1L Prize'),
('Campus Placement Drive', 'Microsoft', 'placement', '2024-06-20', 'SDE-1 Recruitment', 'CGPA > 8.5, CSE/IT/ECE', 'Hyderabad', '₹35-40 LPA'),
('AWS Cloud Practitioner', 'Amazon Web Services', 'certification', NULL, 'Cloud certification', 'No prerequisites', 'Online', '₹15,000'),
('Frontend Development Intern', 'Meta', 'internship', '2024-06-15', 'React/UI Development', 'CGPA > 7.5, 2nd year+', 'Remote', '₹60-80k/month'),
('AI/ML Innovation Challenge', 'Google Developers', 'hackathon', '2024-05-15', '48-hour ML hackathon', 'ML/AI interest', 'Virtual', '$10k Prize');

-- Create views for common queries
CREATE VIEW student_attendance_summary AS
SELECT 
    sd.user_id,
    sd.roll_number,
    u.name,
    s.id as subject_id,
    s.subject_name,
    s.subject_code,
    COUNT(a.id) as total_classes,
    COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_count,
    ROUND(COUNT(CASE WHEN a.status = 'present' THEN 1 END) * 100.0 / COUNT(a.id), 2) as percentage,
    CASE 
        WHEN ROUND(COUNT(CASE WHEN a.status = 'present' THEN 1 END) * 100.0 / COUNT(a.id), 2) < 75 THEN 'danger'
        WHEN ROUND(COUNT(CASE WHEN a.status = 'present' THEN 1 END) * 100.0 / COUNT(a.id), 2) < 77 THEN 'warning'
        ELSE 'safe'
    END as status
FROM student_details sd
JOIN users u ON sd.user_id = u.id
CROSS JOIN subjects s
LEFT JOIN attendance a ON a.student_id = sd.user_id AND a.subject_id = s.id
GROUP BY sd.user_id, s.id;

CREATE VIEW student_gpa_summary AS
SELECT 
    student_id,
    semester,
    AVG(grade_point) as semester_gpa,
    SUM(credits) as total_credits
FROM subject_grades sg
JOIN subjects s ON sg.subject_id = s.id
GROUP BY student_id, semester;