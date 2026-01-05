-- AlterTable
ALTER TABLE "FacadePoint" ADD COLUMN     "bathrooms" INTEGER,
ADD COLUMN     "bedrooms" INTEGER,
ADD COLUMN     "brochure" TEXT,
ADD COLUMN     "externalArea" DOUBLE PRECISION,
ADD COLUMN     "hasBalcony" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasGameRoom" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasLaundry" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasTerrace" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "internalArea" DOUBLE PRECISION,
ADD COLUMN     "totalArea" DOUBLE PRECISION,
ADD COLUMN     "viewImages" TEXT[] DEFAULT ARRAY[]::TEXT[];
