import S from 'fluent-json-schema'

export const queryParams = S.object()
  .prop('title', S.string())
  .prop('author', S.string())
