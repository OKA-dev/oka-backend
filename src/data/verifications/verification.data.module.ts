import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { VerificationDataService } from "./verification.data.service";
import { Verification, VerificationSchema } from "./verification.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Verification.name, schema: VerificationSchema}
    ])
  ],
  providers: [VerificationDataService],
  exports: [VerificationDataService],
})
export class VerificationDataModule {}