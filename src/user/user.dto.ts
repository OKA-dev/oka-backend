export interface PhoneNumberDto {
  number: string
  countryCode: string
}

export interface UserDto {
  name: string
  email: string
  phone: PhoneNumberDto
}
