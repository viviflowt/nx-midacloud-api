import { hashSync } from 'bcrypt'
import f from 'lodash/fp'
import _ from 'lodash'

export class PasswordTransformer {
  to(value: string) {
    return hashSync(value, 10)
  }

  from(value: string) {
    return value
  }
}

export class EmailTransformer {
  to(value: string) {
    return f.pipe(f.trim, f.toLower)(value)
  }

  from(value: string) {
    return value
  }
}
