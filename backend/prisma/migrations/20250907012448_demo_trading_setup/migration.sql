-- AlterTable
ALTER TABLE "public"."Booking" ALTER COLUMN "status" SET DEFAULT 'CONFIRMED';

-- CreateTable
CREATE TABLE "public"."UserPortfolio" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 10000,

    CONSTRAINT "UserPortfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Trades" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trades_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."UserPortfolio" ADD CONSTRAINT "UserPortfolio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Trades" ADD CONSTRAINT "Trades_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
