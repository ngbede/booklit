import S from 'fluent-json-schema'

export const userSchema = S.object()
  .prop('email', S.string().format(S.FORMATS.EMAIL).required())
  .prop('password', S.string())
  .prop('phoneNumber', S.string())
  .prop('firstName', S.string())
  .prop('lastName', S.string())
  .prop('displayName', S.string())
