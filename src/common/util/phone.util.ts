export class PhoneUtil {

  e164Number(countryCode: string, number: string) {
    let phoneNumber = number
    if (phoneNumber.startsWith('0')) {
      phoneNumber = phoneNumber.substring(1)
    }
    if (!countryCode.startsWith('+')) {
      countryCode = `+${countryCode}`
    }
    const e164 = `${countryCode}${phoneNumber}`
    return e164
  }
}