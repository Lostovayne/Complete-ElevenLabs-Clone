-- CreateEnum
CREATE TYPE "VoiceVariant" AS ENUM ('SYSTEM', 'CUSTOM');

-- CreateEnum
CREATE TYPE "VoiceCategory" AS ENUM ('AUDIOBOOK', 'CONVERSATIONAL', 'CUSTOMER_SERVICE', 'GENERAL', 'NARRATIVE', 'CHARACTERS', 'MEDITATION', 'MOTIVATIONAL', 'PODCAST', 'ADVERTISING', 'VOICEOVER', 'CORPORATE');

-- CreateTable
CREATE TABLE "Voice" (
    "id" TEXT NOT NULL,
    "orgId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "VoiceCategory" NOT NULL DEFAULT 'GENERAL',
    "language" TEXT NOT NULL DEFAULT 'en-US',
    "variant" "VoiceVariant" NOT NULL,
    "r2ObjectKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Voice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Generation" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "voiceId" TEXT,
    "text" TEXT NOT NULL,
    "voiceName" TEXT NOT NULL,
    "r2ObjectKey" TEXT,
    "temperature" DOUBLE PRECISION NOT NULL,
    "topP" DOUBLE PRECISION NOT NULL,
    "topK" DOUBLE PRECISION NOT NULL,
    "repetitionPenalty" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Generation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Voice_variant_idx" ON "Voice"("variant");

-- CreateIndex
CREATE INDEX "Voice_orgId_idx" ON "Voice"("orgId");

-- CreateIndex
CREATE INDEX "Generation_orgId_idx" ON "Generation"("orgId");

-- CreateIndex
CREATE INDEX "Generation_voiceId_idx" ON "Generation"("voiceId");

-- AddForeignKey
ALTER TABLE "Generation" ADD CONSTRAINT "Generation_voiceId_fkey" FOREIGN KEY ("voiceId") REFERENCES "Voice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
