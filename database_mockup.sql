CREATE DATABASE forum;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE reg (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    roles VARCHAR,
    photo VARCHAR,
    photo_id VARCHAR,
    is_active BOOLEAN DEFAULT FALSE,
    validate VARCHAR,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE post (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR NOT NULL,
    article TEXT NOT NULL,
    post_pass VARCHAR,
    pic VARCHAR,
    pic_id VARCHAR,
    reg_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (reg_id) REFERENCES reg(id) ON DELETE CASCADE
);

-- if you want to change date when data is updated

-- CREATE OR REPLACE FUNCTION update_created_at()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.created_at = NOW();
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER post_update_created_at
-- BEFORE INSERT OR UPDATE ON post
-- FOR EACH ROW
-- EXECUTE FUNCTION update_created_at();