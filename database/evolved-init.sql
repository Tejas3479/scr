-- Evolved Next-Gen Solarpunk Cyber-Agri Database Schema
-- Location: database/evolved-init.sql

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- High-precision GIS coordination

-- 1. Core Users Table with Passkey Credential Bindings
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    avatar_url TEXT,
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    farm_tokens NUMERIC(20, 8) DEFAULT 0.00000000, -- Decimals for token accuracy
    passkey_credential_id BYTEA, -- Biometric WebAuthn ID
    passkey_public_key BYTEA, -- Public key for biometric verification
    mfa_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Spatial Digital Twins & Fields
CREATE TABLE IF NOT EXISTS spatial_digital_twins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    farm_name VARCHAR(255) NOT NULL,
    boundary GEOMETRY(Polygon, 4326), -- PostGIS Spatial Polygon representing farm fence
    soil_heatmap_json JSONB, -- Mesh map of moisture, pH, and nitrogen indexes
    threejs_model_url TEXT, -- Path to premium GLTF/GLB topographical 3D model
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. High-Precision IoT Sensors (Spatial Integration)
CREATE TABLE IF NOT EXISTS iot_sensors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    twin_id UUID REFERENCES spatial_digital_twins(id) ON DELETE CASCADE,
    sensor_name VARCHAR(100) NOT NULL,
    sensor_type VARCHAR(50) NOT NULL, -- 'soil_moisture', 'nitrogen_probe', 'biophotometer'
    location GEOMETRY(Point, 4326), -- Precise PostGIS sensor coordinates
    latest_reading NUMERIC(10, 4),
    battery_level NUMERIC(5, 2),
    firmware_version VARCHAR(50),
    neuromorphic_enabled BOOLEAN DEFAULT FALSE, -- Low-power neuromorphic edge processing
    last_ping_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. High-Frequency Telemetry Timeseries Logs
CREATE TABLE IF NOT EXISTS sensor_telemetry (
    id BIGSERIAL PRIMARY KEY,
    sensor_id UUID REFERENCES iot_sensors(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    payload JSONB NOT NULL -- Ingested timeseries environmental metric logs
);
CREATE INDEX idx_telemetry_sensor_time ON sensor_telemetry(sensor_id, timestamp DESC);

-- 5. Bioinformatics & Genomic CRISPR Tracking
CREATE TABLE IF NOT EXISTS crop_genomics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_name VARCHAR(100) NOT NULL,
    variety VARCHAR(100) NOT NULL,
    genomic_marker_sequence TEXT, -- Sequence of genetic markers
    crispr_edited BOOLEAN DEFAULT FALSE,
    modification_purpose VARCHAR(255), -- 'drought_resistance', 'pest_immunity'
    bio_safety_certificate_hash VARCHAR(64) UNIQUE, -- Signed blockchain verification hash
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Autonomous Robotics & Drone Fleet Registry
CREATE TABLE IF NOT EXISTS robotic_fleet (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    robot_name VARCHAR(100) NOT NULL,
    robot_type VARCHAR(50) NOT NULL, -- 'drone_quad', 'weeder_rover'
    status VARCHAR(50) DEFAULT 'idle', -- 'idle', 'dispatching', 'charging', 'error'
    current_gps_coordinate GEOMETRY(Point, 4326), -- PostGIS Point coordinates
    battery_percentage NUMERIC(5, 2),
    haptic_override_port INTEGER, -- Port mapping for real-time haptic controller feedback
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Green Solarpunk Blockchain Audit Certificates
CREATE TABLE IF NOT EXISTS blockchain_ledger_certs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    crop_batch_id VARCHAR(100) NOT NULL,
    eco_friendly_audit_hash VARCHAR(64) NOT NULL,
    carbon_credits_earned NUMERIC(10, 4) DEFAULT 0.0000,
    minted_token_tx_hash VARCHAR(100), -- Block transaction hash
    verification_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'flagged'
    certified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Passive BCI EEG Telemetry Cache
CREATE TABLE IF NOT EXISTS bci_cognitive_states (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    attention_score NUMERIC(5, 2), -- Scaled 0 - 100
    stress_level NUMERIC(5, 2), -- Scaled 0 - 100
    cognitive_load NUMERIC(5, 2), -- Scaled 0 - 100
    active_command_triggered VARCHAR(100), -- BCI neural motor command
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_bci_user_time ON bci_cognitive_states(user_id, timestamp DESC);
