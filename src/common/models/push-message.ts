export class PushMessage {
  title: string
  subtitle?: string
  contents?: string

  constructor(title: string, subtitle?: string, contents?: string) {
    this.title = title
    this.subtitle = subtitle
    this.contents = contents
  }
}
