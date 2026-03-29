CREATE TABLE "market_snapshots" (
    "id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "market_snapshots_pkey" PRIMARY KEY ("id")
);
