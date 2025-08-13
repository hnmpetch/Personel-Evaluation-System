-- MySQL-compatible schema for evaluation system (MySQL 8+ recommended)
-- Drops existing tables (order safe for FK) and re-creates schema.
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS exports;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS self_assessment_items;
DROP TABLE IF EXISTS self_assessments;
DROP TABLE IF EXISTS assessment_items;
DROP TABLE IF EXISTS assessments;
DROP TABLE IF EXISTS evidences;
DROP TABLE IF EXISTS committee_assignments;
DROP TABLE IF EXISTS indicators;
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS evaluation_cycles;
DROP TABLE IF EXISTS evaluatee_profiles;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS positions;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS audit_logs;

SET FOREIGN_KEY_CHECKS = 1;

-- Roles
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(32) NOT NULL UNIQUE COMMENT 'ADMIN, HR, EVALUATOR, EVALUATEE',
  name VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Departments
CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(32) UNIQUE,
  name VARCHAR(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Positions
CREATE TABLE positions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Users (UUID stored as CHAR(36))
CREATE TABLE users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE,
  phone VARCHAR(32) NOT NULL,
  status VARCHAR(16) NOT NULL COMMENT 'ACTIVE, INACTIVE, SUSPENDED',
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Evaluatee profiles
CREATE TABLE evaluatee_profiles (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  employee_no VARCHAR(64),
  department_id INT,
  position_id INT,
  hire_date DATE,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_eval_profile_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_eval_profile_dept FOREIGN KEY (department_id) REFERENCES departments(id),
  CONSTRAINT fk_eval_profile_pos FOREIGN KEY (position_id) REFERENCES positions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Evaluation cycles
CREATE TABLE evaluation_cycles (
  id CHAR(36) NOT NULL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  start_at DATETIME(6) NOT NULL,
  end_at DATETIME(6) NOT NULL,
  is_open BOOLEAN NOT NULL DEFAULT TRUE,
  created_by CHAR(36) NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_cycle_created_by FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Topics
CREATE TABLE topics (
  id CHAR(36) NOT NULL PRIMARY KEY,
  cycle_id CHAR(36) NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_topic_cycle FOREIGN KEY (cycle_id) REFERENCES evaluation_cycles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indicators
CREATE TABLE indicators (
  id CHAR(36) NOT NULL PRIMARY KEY,
  cycle_id CHAR(36) NOT NULL,
  topic_id CHAR(36) NOT NULL,
  name VARCHAR(200) NOT NULL,
  details TEXT,
  weight DECIMAL(6,2) NOT NULL DEFAULT 1,
  scoring_type VARCHAR(24) NOT NULL COMMENT 'SCALE_1_4, BOOLEAN, NUMERIC, CUSTOM',
  evidence_type VARCHAR(24) COMMENT 'PDF, URL, FILE, NONE',
  require_evidence BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_indicator_cycle FOREIGN KEY (cycle_id) REFERENCES evaluation_cycles(id),
  CONSTRAINT fk_indicator_topic FOREIGN KEY (topic_id) REFERENCES topics(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Committee assignments
CREATE TABLE committee_assignments (
  id CHAR(36) NOT NULL PRIMARY KEY,
  cycle_id CHAR(36) NOT NULL,
  evaluatee_id CHAR(36) NOT NULL COMMENT 'evaluatee_profiles.id',
  evaluator_id CHAR(36) NOT NULL COMMENT 'users.id',
  role VARCHAR(16) NOT NULL COMMENT 'CHAIR, MEMBER',
  assigned_by CHAR(36) NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT uq_committee_cycle_eval_evaluator UNIQUE (cycle_id, evaluatee_id, evaluator_id),
  CONSTRAINT fk_committee_cycle FOREIGN KEY (cycle_id) REFERENCES evaluation_cycles(id),
  CONSTRAINT fk_committee_eval_profile FOREIGN KEY (evaluatee_id) REFERENCES evaluatee_profiles(id),
  CONSTRAINT fk_committee_evaluator FOREIGN KEY (evaluator_id) REFERENCES users(id),
  CONSTRAINT fk_committee_assigned_by FOREIGN KEY (assigned_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Evidences
CREATE TABLE evidences (
  id CHAR(36) NOT NULL PRIMARY KEY,
  cycle_id CHAR(36) NOT NULL,
  evaluatee_id CHAR(36) NOT NULL,
  indicator_id CHAR(36) NOT NULL,
  owner_user_id CHAR(36) NOT NULL,
  kind VARCHAR(16) NOT NULL COMMENT 'PDF, URL, FILE',
  file_path VARCHAR(500),
  url VARCHAR(500),
  description TEXT,
  uploaded_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_evidence_cycle FOREIGN KEY (cycle_id) REFERENCES evaluation_cycles(id),
  CONSTRAINT fk_evidence_eval_profile FOREIGN KEY (evaluatee_id) REFERENCES evaluatee_profiles(id),
  CONSTRAINT fk_evidence_indicator FOREIGN KEY (indicator_id) REFERENCES indicators(id),
  CONSTRAINT fk_evidence_owner FOREIGN KEY (owner_user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Assessments
CREATE TABLE assessments (
  id CHAR(36) NOT NULL PRIMARY KEY,
  cycle_id CHAR(36) NOT NULL,
  evaluatee_id CHAR(36) NOT NULL,
  evaluator_id CHAR(36) NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'DRAFT' COMMENT 'DRAFT, SUBMITTED, SIGNED, REVOKED',
  comment TEXT,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  submitted_at DATETIME(6),
  CONSTRAINT fk_assessment_cycle FOREIGN KEY (cycle_id) REFERENCES evaluation_cycles(id),
  CONSTRAINT fk_assessment_eval_profile FOREIGN KEY (evaluatee_id) REFERENCES evaluatee_profiles(id),
  CONSTRAINT fk_assessment_evaluator FOREIGN KEY (evaluator_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Assessment items
CREATE TABLE assessment_items (
  id CHAR(36) NOT NULL PRIMARY KEY,
  assessment_id CHAR(36) NOT NULL,
  indicator_id CHAR(36) NOT NULL,
  score DECIMAL(6,2) NOT NULL,
  comment TEXT,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT uq_assessment_item UNIQUE (assessment_id, indicator_id),
  CONSTRAINT fk_assessment_item_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id),
  CONSTRAINT fk_assessment_item_indicator FOREIGN KEY (indicator_id) REFERENCES indicators(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Self assessments
CREATE TABLE self_assessments (
  id CHAR(36) NOT NULL PRIMARY KEY,
  cycle_id CHAR(36) NOT NULL,
  evaluatee_id CHAR(36) NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'DRAFT',
  comment TEXT,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  submitted_at DATETIME(6),
  CONSTRAINT fk_self_assessment_cycle FOREIGN KEY (cycle_id) REFERENCES evaluation_cycles(id),
  CONSTRAINT fk_self_assessment_eval_profile FOREIGN KEY (evaluatee_id) REFERENCES evaluatee_profiles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Self assessment items
CREATE TABLE self_assessment_items (
  id CHAR(36) NOT NULL PRIMARY KEY,
  self_assessment_id CHAR(36) NOT NULL,
  indicator_id CHAR(36) NOT NULL,
  score DECIMAL(6,2),
  comment TEXT,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT uq_self_assessment_item UNIQUE (self_assessment_id, indicator_id),
  CONSTRAINT fk_self_assessment_item_self FOREIGN KEY (self_assessment_id) REFERENCES self_assessments(id),
  CONSTRAINT fk_self_assessment_item_indicator FOREIGN KEY (indicator_id) REFERENCES indicators(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Signatures
CREATE TABLE signatures (
  id CHAR(36) NOT NULL PRIMARY KEY,
  assessment_id CHAR(36) NOT NULL,
  signer_id CHAR(36) NOT NULL COMMENT 'users.id (กรรมการ)',
  signed_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  signature_path VARCHAR(500),
  status VARCHAR(12) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, REVOKED',
  reason TEXT,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT uq_signature UNIQUE (assessment_id, signer_id),
  CONSTRAINT fk_signature_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id),
  CONSTRAINT fk_signature_signer FOREIGN KEY (signer_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Reports
CREATE TABLE reports (
  id CHAR(36) NOT NULL PRIMARY KEY,
  cycle_id CHAR(36) NOT NULL,
  type VARCHAR(32) NOT NULL COMMENT 'SUMMARY, DETAIL, BY_DEPT, BY_EVALUATOR',
  parameters JSON,
  generated_by CHAR(36) NOT NULL,
  file_path VARCHAR(500),
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_report_cycle FOREIGN KEY (cycle_id) REFERENCES evaluation_cycles(id),
  CONSTRAINT fk_report_generated_by FOREIGN KEY (generated_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exports
CREATE TABLE exports (
  id CHAR(36) NOT NULL PRIMARY KEY,
  cycle_id CHAR(36) NOT NULL,
  evaluatee_id CHAR(36),
  format VARCHAR(16) NOT NULL COMMENT 'PDF, CSV, XLSX, JSON',
  file_path VARCHAR(500),
  requested_by CHAR(36) NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_export_cycle FOREIGN KEY (cycle_id) REFERENCES evaluation_cycles(id),
  CONSTRAINT fk_export_eval_profile FOREIGN KEY (evaluatee_id) REFERENCES evaluatee_profiles(id),
  CONSTRAINT fk_export_requested_by FOREIGN KEY (requested_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- User roles (composite PK)
CREATE TABLE user_roles (
  user_id CHAR(36) NOT NULL,
  role_id INT NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Audit logs
CREATE TABLE audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  logged_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  actor_id CHAR(36),
  action VARCHAR(64) NOT NULL,
  entity VARCHAR(64) NOT NULL,
  entity_id CHAR(36),
  details JSON,
  ip VARCHAR(45)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
