import { Ref } from 'vue'

export function unwrapProxy<T> ( ref: Ref<T> | T ): T {
  if (typeof ref === 'object'
    && ref !== null
    && !('value' in ref)
  ) {
    return JSON.parse(JSON.stringify(ref)) as T
  }

  ref = ref as Ref<T>

  if (ref.value === undefined) {
    return ref.value
  }
  if (ref.value === null) {
    return ref.value
  }
  if (typeof ref.value === 'object') {
    return JSON.parse(JSON.stringify(ref.value))
  }
  return ref.value
}
