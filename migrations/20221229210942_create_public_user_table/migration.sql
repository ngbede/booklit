-- CreateTable

CREATE TABLE
    "user" (
        "auth_id" UUID PRIMARY KEY,
        "email" VARCHAR(120) NOT NULL,
        "first_name" VARCHAR(50) NOT NULL,
        "last_name" VARCHAR(50) NOT NULL,
        "display_name" VARCHAR(30),
        "phone_number" VARCHAR(15),
        "created_at" TIMESTAMPTZ(6) DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ(6) DEFAULT NOW()
    );