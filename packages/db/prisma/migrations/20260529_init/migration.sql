CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "vector"; -- pgvector initialization

-- Convert Prisma table to TimescaleDB hypertable
SELECT create_hypertable('"SensorReading"', 'time', if_not_exists => TRUE);
CREATE INDEX ON "SensorReading" (device_id, time DESC);

-- Spatial PostGIS indices
CREATE INDEX idx_farm_boundary ON "Farm" USING GIST (boundary);
