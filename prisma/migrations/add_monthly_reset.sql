-- Migration: Add monthly credit reset tracking
-- Run this migration to add the new fields to the User table

-- Add new columns to User table
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "monthlyCreditsUsed" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "lastCreditResetDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- Update existing users to set their lastCreditResetDate to now
UPDATE "User" 
SET "lastCreditResetDate" = CURRENT_TIMESTAMP 
WHERE "lastCreditResetDate" IS NULL;

-- Optional: Reset all users' credits based on their plan
-- Uncomment the following lines if you want to reset everyone's credits now

-- UPDATE "User" 
-- SET "credits" = 50, "monthlyCreditsUsed" = 0, "lastCreditResetDate" = CURRENT_TIMESTAMP
-- WHERE "plan" = 'free';

-- UPDATE "User" 
-- SET "credits" = 500, "monthlyCreditsUsed" = 0, "lastCreditResetDate" = CURRENT_TIMESTAMP
-- WHERE "plan" = 'pro';

-- UPDATE "User" 
-- SET "credits" = 9999, "monthlyCreditsUsed" = 0, "lastCreditResetDate" = CURRENT_TIMESTAMP
-- WHERE "plan" = 'elite';
