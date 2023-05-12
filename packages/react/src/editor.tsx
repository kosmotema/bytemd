import * as bytemd from '@kosmotema/bytemd'
import React, { ComponentPropsWithoutRef, useEffect, useRef } from 'react'

export interface EditorProps extends bytemd.EditorProps {
  onChange?(value: string): void
  onBlur?(): void
  onReady?(editor: bytemd.CodeMirrorEditor): void

  wrapperProps?: Omit<ComponentPropsWithoutRef<'div'>, 'children'>
}

export const Editor: React.FC<EditorProps> = ({
  onChange,
  onBlur,
  onReady,
  wrapperProps,
  ...props
}) => {
  const ed = useRef<bytemd.Editor>()
  const el = useRef<HTMLDivElement>(null)
  const onChangeRef = useRef(onChange)
  const onBlurRef = useRef(onBlur)
  const onReadyRef = useRef(onReady)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    onBlurRef.current = onBlur
  }, [onBlur])

  useEffect(() => {
    onReadyRef.current = onReady
  }, [onReady])

  useEffect(() => {
    // TODO: performance
    ed.current?.$set(props)
  }, [props])

  useEffect(() => {
    if (!el.current) return

    const editor = new bytemd.Editor({
      target: el.current,
      props,
    })
    editor.$on('change', (e: CustomEvent<{ value: string }>) => {
      onChangeRef.current?.(e.detail.value)
    })
    editor.$on('blur', () => {
      onBlurRef.current?.()
    })
    editor.$on('ready', (e: CustomEvent<bytemd.CodeMirrorEditor>) => {
      onReadyRef.current?.(e.detail)
    })
    ed.current = editor

    return () => {
      editor.$destroy()
    }
  }, [])

  return <div {...wrapperProps} ref={el}></div>
}
