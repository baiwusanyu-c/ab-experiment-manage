/**
 * v-copyText 复制文本内容
 * Copyright (c) 2022 ruoyi
 */
import type { DirectiveBinding } from 'vue'
export default {
  beforeMount(el: any, { value, arg }: DirectiveBinding) {
    if (arg === 'callback') {
      el.$copyCallback = value
    } else {
      el.$copyValue = value
      const handler = () => {
        copyTextToClipboard(el.$copyValue)
        if (el.$copyCallback) {
          el.$copyCallback(el.$copyValue)
        }
      }
      el.addEventListener('click', handler)
      el.$destroyCopy = () => el.removeEventListener('click', handler)
    }
  },
}

function copyTextToClipboard(input: string, { target = document.body } = {}) {
  const element = document.createElement('textarea')
  const previouslyFocusedElement: Element | null = document.activeElement

  element.value = input

  // Prevent keyboard from showing on mobile
  element.setAttribute('readonly', '')

  element.style.contain = 'strict'
  element.style.position = 'absolute'
  element.style.left = '-9999px'
  element.style.fontSize = '12pt' // Prevent zooming on iOS

  const selection: Selection | null = document.getSelection()
  const originalRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : undefined

  target.append(element)
  element.select()

  // Explicit selection workaround for iOS
  element.selectionStart = 0
  element.selectionEnd = input.length

  let isSuccess = false
  try {
    isSuccess = document.execCommand('copy')
  } catch {}

  element.remove()

  if (originalRange) {
    selection && selection.removeAllRanges()
    selection && selection.addRange(originalRange)
  }

  // Get the focus back on the previously focused element, if any
  if (previouslyFocusedElement) {
    ;(previouslyFocusedElement as HTMLElement).focus()
  }

  return isSuccess
}
