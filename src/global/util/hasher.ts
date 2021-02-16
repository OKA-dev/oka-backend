import * as bcrypt from 'bcrypt'

const saltRounds = 12

export class Hasher {
  static async hash(word: string): Promise<string> {
    return await bcrypt.hash(word, saltRounds)
  }

  static async compare(word: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(word, hashed)
  }
}
