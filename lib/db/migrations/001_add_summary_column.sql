-- Migration: Add summary column to analyses table
-- Date: 2025-11-22
-- Purpose: Store structured summaries for context optimization

-- Add summary column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analyses' AND column_name = 'summary'
  ) THEN
    ALTER TABLE analyses ADD COLUMN summary JSONB;
  END IF;
END $$;

-- Update stage CHECK constraint to include all 8 stages
ALTER TABLE analyses DROP CONSTRAINT IF EXISTS analyses_stage_check;
ALTER TABLE analyses ADD CONSTRAINT analyses_stage_check
  CHECK (stage IN ('market', 'demand', 'communities', 'competition', 'forecast', 'gtm', 'tech', 'customers'));

-- Create index on summary for faster lookups (optional)
CREATE INDEX IF NOT EXISTS idx_analyses_summary ON analyses USING GIN(summary);
