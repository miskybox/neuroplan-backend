-- ===========================================
-- NEUROPLAN SUPABASE SCHEMA
-- ===========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- TABLES
-- ===========================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'PROFESOR',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    center_id UUID,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE,
    grade VARCHAR(50),
    parent_name VARCHAR(100),
    parent_email VARCHAR(255),
    parent_phone VARCHAR(20),
    school VARCHAR(100),
    center_id UUID,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id),
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size INTEGER NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    extracted_text TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    processed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PEIs table
CREATE TABLE IF NOT EXISTS peis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id),
    report_id UUID REFERENCES reports(id),
    version INTEGER DEFAULT 1,
    summary TEXT,
    diagnosis TEXT,
    objectives JSONB,
    adaptations JSONB,
    strategies JSONB,
    evaluation JSONB,
    timeline JSONB,
    status VARCHAR(50) DEFAULT 'DRAFT',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    sender_id UUID REFERENCES users(id),
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audio files table
CREATE TABLE IF NOT EXISTS audio_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pei_id UUID REFERENCES peis(id),
    url VARCHAR(500) NOT NULL,
    duration INTEGER,
    language VARCHAR(10) DEFAULT 'es',
    voice VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    user_id UUID REFERENCES users(id),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- INDEXES
-- ===========================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_students_created_by ON students(created_by);
CREATE INDEX IF NOT EXISTS idx_reports_student_id ON reports(student_id);
CREATE INDEX IF NOT EXISTS idx_peis_student_id ON peis(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);

-- ===========================================
-- ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE peis ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- POLICIES
-- ===========================================

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Students policies (based on created_by)
CREATE POLICY "Users can read students they created" ON students
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can create students" ON students
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Reports policies
CREATE POLICY "Users can read reports they created" ON reports
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can create reports" ON reports
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- PEIs policies
CREATE POLICY "Users can read PEIs they created" ON peis
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can create PEIs" ON peis
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Notifications policies
CREATE POLICY "Users can read own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_peis_updated_at BEFORE UPDATE ON peis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- SAMPLE DATA
-- ===========================================

-- Insert admin user (password: 'admin123')
INSERT INTO users (email, password, role, first_name, last_name)
VALUES (
    'admin@neuroplan.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'ADMIN',
    'Admin',
    'NeuroPlan'
) ON CONFLICT (email) DO NOTHING;

-- Insert test user (password: 'password')
INSERT INTO users (email, password, role, first_name, last_name)
VALUES (
    'test@neuroplan.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'PROFESOR',
    'Test',
    'User'
) ON CONFLICT (email) DO NOTHING;

-- ===========================================
-- STORAGE BUCKETS
-- ===========================================

-- Create storage buckets (run these in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES 
-- ('reports', 'reports', false),
-- ('peis', 'peis', false),
-- ('audio', 'audio', false);

-- ===========================================
-- COMPLETION MESSAGE
-- ===========================================

SELECT 'NeuroPlan Supabase schema created successfully!' as status;

