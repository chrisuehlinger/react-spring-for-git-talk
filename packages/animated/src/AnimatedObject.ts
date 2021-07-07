import { Lookup } from '@react-spring/types'
import {
  each,
  eachProp,
  getFluidValue,
  hasFluidValue,
} from '@react-spring/shared'
import { Animated, isAnimated, getPayload } from './Animated'
import { AnimatedValue } from './AnimatedValue'
import { TreeContext } from './context'

/** An object containing `Animated` nodes */
export class AnimatedObject extends Animated {
  constructor(protected source: Lookup) {
    super()
    this.setValue(source)
  }

  getValue() {
    let value = this._string
    return value == null ? (this._string = this._toString(this._value)) : value
  }

  setValue(value: Value) {
    if (is.str(value)) {
      if (value == this._string) {
        return false
      }
      this._string = value
      this._value = 1
    } else if (super.setValue(value)) {
      this._string = null
    } else {
      return false
    }
    return true
  }

  reset() {
    if (this.payload) {
      each(this.payload, node => node.reset())
    }
  }

  /** Create a payload set. */
  protected _makePayload(source: Lookup) {
    if (source) {
      const payload = new Set<AnimatedValue>()
      eachProp(source, this._addToPayload, payload)
      return Array.from(payload)
    }
  }

  /** Add to a payload set. */
  protected _addToPayload(this: Set<AnimatedValue>, source: any) {
    if (TreeContext.dependencies && hasFluidValue(source)) {
      TreeContext.dependencies.add(source)
    }
    const payload = getPayload(source)
    if (payload) {
      each(payload, node => this.add(node))
    }
  }
}
