import { DrawToolType } from 'components/models'

type UppercaseDrawToolKeys = {
  [K in DrawToolType as Uppercase<K>]: DrawToolType;
};

export default {
  BRUSH: 'brush',
  ERASER: 'eraser',
} as const as UppercaseDrawToolKeys
