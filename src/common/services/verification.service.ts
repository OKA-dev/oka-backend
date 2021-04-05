import { PhoneNumber } from "src/data/addressdata/phonenumber";

export interface VerificationService {
  startVerification(phoneNumber: PhoneNumber)
  verify(verificationId, verificationCode)
}