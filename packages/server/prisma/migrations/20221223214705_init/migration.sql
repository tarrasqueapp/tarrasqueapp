-- CreateTable
CREATE TABLE "Setup" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "step" INTEGER NOT NULL DEFAULT 1,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Setup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatarId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Map" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "selectedMediaId" TEXT,
    "campaignId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movement" (
    "id" TEXT NOT NULL,
    "burrow" INTEGER NOT NULL DEFAULT 0,
    "climb" INTEGER NOT NULL DEFAULT 0,
    "fly" INTEGER NOT NULL DEFAULT 0,
    "hover" BOOLEAN NOT NULL DEFAULT false,
    "swim" INTEGER NOT NULL DEFAULT 0,
    "walk" INTEGER NOT NULL DEFAULT 30,
    "playerCharacterId" TEXT,
    "nonPlayerCharacterId" TEXT,

    CONSTRAINT "Movement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HitPoints" (
    "id" TEXT NOT NULL,
    "current" INTEGER NOT NULL DEFAULT 10,
    "maximum" INTEGER NOT NULL DEFAULT 10,
    "temporary" INTEGER NOT NULL DEFAULT 0,
    "formula" TEXT NOT NULL DEFAULT '1d10',
    "playerCharacterId" TEXT,
    "nonPlayerCharacterId" TEXT,

    CONSTRAINT "HitPoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArmorClass" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 10,
    "description" TEXT NOT NULL DEFAULT '',
    "playerCharacterId" TEXT,
    "nonPlayerCharacterId" TEXT,

    CONSTRAINT "ArmorClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Senses" (
    "id" TEXT NOT NULL,
    "blindsight" INTEGER NOT NULL DEFAULT 0,
    "darkvision" INTEGER NOT NULL DEFAULT 0,
    "tremorsense" INTEGER NOT NULL DEFAULT 0,
    "truesight" INTEGER NOT NULL DEFAULT 0,
    "playerCharacterId" TEXT,
    "nonPlayerCharacterId" TEXT,

    CONSTRAINT "Senses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ability" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 10,
    "modifier" INTEGER NOT NULL DEFAULT 0,
    "save" INTEGER NOT NULL DEFAULT 0,
    "playerCharacterId" TEXT,
    "nonPlayerCharacterId" TEXT,

    CONSTRAINT "Ability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "bonus" INTEGER NOT NULL DEFAULT 0,
    "abilityId" TEXT NOT NULL,
    "playerCharacterId" TEXT,
    "nonPlayerCharacterId" TEXT,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currencies" (
    "id" TEXT NOT NULL,
    "copper" INTEGER NOT NULL DEFAULT 0,
    "silver" INTEGER NOT NULL DEFAULT 0,
    "gold" INTEGER NOT NULL DEFAULT 0,
    "electrum" INTEGER NOT NULL DEFAULT 0,
    "platinum" INTEGER NOT NULL DEFAULT 0,
    "playerCharacterId" TEXT NOT NULL,

    CONSTRAINT "Currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerCharacter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT NOT NULL DEFAULT 'Medium',
    "alignment" TEXT NOT NULL DEFAULT 'Neutral',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "selectedMediaId" TEXT,
    "createdById" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,

    CONSTRAINT "PlayerCharacter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NonPlayerCharacter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT NOT NULL DEFAULT 'Medium',
    "alignment" TEXT NOT NULL DEFAULT 'Neutral',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "selectedMediaId" TEXT,
    "createdById" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,

    CONSTRAINT "NonPlayerCharacter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "playerCharacterId" TEXT,
    "nonPlayerCharacterId" TEXT,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CampaignPlayers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MapMedia" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ControlledPlayerCharacters" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ControlledNonPlayerCharacters" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PlayerCharacterMedia" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_NonPlayerCharacterMedia" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_value_key" ON "RefreshToken"("value");

-- CreateIndex
CREATE UNIQUE INDEX "Movement_playerCharacterId_key" ON "Movement"("playerCharacterId");

-- CreateIndex
CREATE UNIQUE INDEX "Movement_nonPlayerCharacterId_key" ON "Movement"("nonPlayerCharacterId");

-- CreateIndex
CREATE UNIQUE INDEX "HitPoints_playerCharacterId_key" ON "HitPoints"("playerCharacterId");

-- CreateIndex
CREATE UNIQUE INDEX "HitPoints_nonPlayerCharacterId_key" ON "HitPoints"("nonPlayerCharacterId");

-- CreateIndex
CREATE UNIQUE INDEX "ArmorClass_playerCharacterId_key" ON "ArmorClass"("playerCharacterId");

-- CreateIndex
CREATE UNIQUE INDEX "ArmorClass_nonPlayerCharacterId_key" ON "ArmorClass"("nonPlayerCharacterId");

-- CreateIndex
CREATE UNIQUE INDEX "Senses_playerCharacterId_key" ON "Senses"("playerCharacterId");

-- CreateIndex
CREATE UNIQUE INDEX "Senses_nonPlayerCharacterId_key" ON "Senses"("nonPlayerCharacterId");

-- CreateIndex
CREATE UNIQUE INDEX "Currencies_playerCharacterId_key" ON "Currencies"("playerCharacterId");

-- CreateIndex
CREATE UNIQUE INDEX "_CampaignPlayers_AB_unique" ON "_CampaignPlayers"("A", "B");

-- CreateIndex
CREATE INDEX "_CampaignPlayers_B_index" ON "_CampaignPlayers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MapMedia_AB_unique" ON "_MapMedia"("A", "B");

-- CreateIndex
CREATE INDEX "_MapMedia_B_index" ON "_MapMedia"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ControlledPlayerCharacters_AB_unique" ON "_ControlledPlayerCharacters"("A", "B");

-- CreateIndex
CREATE INDEX "_ControlledPlayerCharacters_B_index" ON "_ControlledPlayerCharacters"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ControlledNonPlayerCharacters_AB_unique" ON "_ControlledNonPlayerCharacters"("A", "B");

-- CreateIndex
CREATE INDEX "_ControlledNonPlayerCharacters_B_index" ON "_ControlledNonPlayerCharacters"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PlayerCharacterMedia_AB_unique" ON "_PlayerCharacterMedia"("A", "B");

-- CreateIndex
CREATE INDEX "_PlayerCharacterMedia_B_index" ON "_PlayerCharacterMedia"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_NonPlayerCharacterMedia_AB_unique" ON "_NonPlayerCharacterMedia"("A", "B");

-- CreateIndex
CREATE INDEX "_NonPlayerCharacterMedia_B_index" ON "_NonPlayerCharacterMedia"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Map" ADD CONSTRAINT "Map_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Map" ADD CONSTRAINT "Map_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_playerCharacterId_fkey" FOREIGN KEY ("playerCharacterId") REFERENCES "PlayerCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_nonPlayerCharacterId_fkey" FOREIGN KEY ("nonPlayerCharacterId") REFERENCES "NonPlayerCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HitPoints" ADD CONSTRAINT "HitPoints_playerCharacterId_fkey" FOREIGN KEY ("playerCharacterId") REFERENCES "PlayerCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HitPoints" ADD CONSTRAINT "HitPoints_nonPlayerCharacterId_fkey" FOREIGN KEY ("nonPlayerCharacterId") REFERENCES "NonPlayerCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArmorClass" ADD CONSTRAINT "ArmorClass_playerCharacterId_fkey" FOREIGN KEY ("playerCharacterId") REFERENCES "PlayerCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArmorClass" ADD CONSTRAINT "ArmorClass_nonPlayerCharacterId_fkey" FOREIGN KEY ("nonPlayerCharacterId") REFERENCES "NonPlayerCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Senses" ADD CONSTRAINT "Senses_playerCharacterId_fkey" FOREIGN KEY ("playerCharacterId") REFERENCES "PlayerCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Senses" ADD CONSTRAINT "Senses_nonPlayerCharacterId_fkey" FOREIGN KEY ("nonPlayerCharacterId") REFERENCES "NonPlayerCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ability" ADD CONSTRAINT "Ability_playerCharacterId_fkey" FOREIGN KEY ("playerCharacterId") REFERENCES "PlayerCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ability" ADD CONSTRAINT "Ability_nonPlayerCharacterId_fkey" FOREIGN KEY ("nonPlayerCharacterId") REFERENCES "NonPlayerCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_abilityId_fkey" FOREIGN KEY ("abilityId") REFERENCES "Ability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_playerCharacterId_fkey" FOREIGN KEY ("playerCharacterId") REFERENCES "PlayerCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_nonPlayerCharacterId_fkey" FOREIGN KEY ("nonPlayerCharacterId") REFERENCES "NonPlayerCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Currencies" ADD CONSTRAINT "Currencies_playerCharacterId_fkey" FOREIGN KEY ("playerCharacterId") REFERENCES "PlayerCharacter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerCharacter" ADD CONSTRAINT "PlayerCharacter_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerCharacter" ADD CONSTRAINT "PlayerCharacter_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonPlayerCharacter" ADD CONSTRAINT "NonPlayerCharacter_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonPlayerCharacter" ADD CONSTRAINT "NonPlayerCharacter_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_playerCharacterId_fkey" FOREIGN KEY ("playerCharacterId") REFERENCES "PlayerCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_nonPlayerCharacterId_fkey" FOREIGN KEY ("nonPlayerCharacterId") REFERENCES "NonPlayerCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignPlayers" ADD CONSTRAINT "_CampaignPlayers_A_fkey" FOREIGN KEY ("A") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignPlayers" ADD CONSTRAINT "_CampaignPlayers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MapMedia" ADD CONSTRAINT "_MapMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "Map"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MapMedia" ADD CONSTRAINT "_MapMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ControlledPlayerCharacters" ADD CONSTRAINT "_ControlledPlayerCharacters_A_fkey" FOREIGN KEY ("A") REFERENCES "PlayerCharacter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ControlledPlayerCharacters" ADD CONSTRAINT "_ControlledPlayerCharacters_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ControlledNonPlayerCharacters" ADD CONSTRAINT "_ControlledNonPlayerCharacters_A_fkey" FOREIGN KEY ("A") REFERENCES "NonPlayerCharacter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ControlledNonPlayerCharacters" ADD CONSTRAINT "_ControlledNonPlayerCharacters_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerCharacterMedia" ADD CONSTRAINT "_PlayerCharacterMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerCharacterMedia" ADD CONSTRAINT "_PlayerCharacterMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "PlayerCharacter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NonPlayerCharacterMedia" ADD CONSTRAINT "_NonPlayerCharacterMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NonPlayerCharacterMedia" ADD CONSTRAINT "_NonPlayerCharacterMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "NonPlayerCharacter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
