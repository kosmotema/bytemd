<svelte:options immutable={true} />

<script lang="ts">
  import Actions, {
    actionClass,
    actionDisabledClass,
    actionIconClass,
    tippyPathKey,
    tippyTrigger,
  } from './actions.svelte'
  import { icons } from './icons'
  import type { BytemdEditorContext, BytemdAction, BytemdLocale } from './types'
  import cx from 'classix'
  import { createEventDispatcher, onDestroy, onMount, tick } from 'svelte'
  import type { DelegateInstance, Props } from 'tippy.js'
  import { delegate } from 'tippy.js'

  const dispatch = createEventDispatcher()
  const tabs = ['write', 'preview'] as const
  let toolbar: HTMLElement

  export let context: BytemdEditorContext
  export let split: boolean
  export let activeTab: false | 'write' | 'preview'
  export let fullscreen: boolean
  export let sidebar: false | 'help' | 'toc'
  export let locale: BytemdLocale
  export let actions: BytemdAction[]
  export let rightAfferentActions: BytemdAction[]
  export let readOnly: boolean = false

  interface RightAction extends BytemdAction {
    active?: boolean
    hidden?: boolean
  }

  $: tocActive = sidebar === 'toc'
  $: helpActive = sidebar === 'help'
  $: writeActive = activeTab === 'write'
  $: previewActive = activeTab === 'preview'

  $: rightActions = [
    {
      title: tocActive ? locale.closeToc : locale.toc,
      icon: icons.AlignTextLeftOne,
      handler: {
        type: 'action',
        click() {
          dispatch('click', 'toc')
        },
        immutable: true,
      },
      active: tocActive,
    },
    {
      title: helpActive ? locale.closeHelp : locale.help,
      icon: icons.Helpcenter,
      handler: {
        type: 'action',
        click() {
          dispatch('click', 'help')
        },
        immutable: true,
      },
      active: helpActive,
    },
    {
      title: writeActive ? locale.exitWriteOnly : locale.writeOnly,
      icon: icons.LeftExpand,
      handler: {
        type: 'action',
        click() {
          dispatch('tab', 'write')
        },
        immutable: true,
      },
      active: writeActive,
      hidden: !split,
    },
    {
      title: previewActive ? locale.exitPreviewOnly : locale.previewOnly,
      icon: icons.RightExpand,
      handler: {
        type: 'action',
        click() {
          dispatch('tab', 'preview')
        },
        immutable: true,
      },
      active: previewActive,
      hidden: !split,
    },
    {
      title: fullscreen ? locale.exitFullscreen : locale.fullscreen,
      icon: fullscreen ? icons.OffScreen : icons.FullScreen,
      handler: {
        type: 'action',
        click() {
          dispatch('click', 'fullscreen')
        },
        immutable: true,
      },
    },
    ...rightAfferentActions,
  ] as RightAction[]

  const tippyIsRight = 'data-bytemd-tippy-right'
  const tippyActionsTooltip = 'data-bytemd-tippy-actions'

  function getPayloadFromElement(e: Element) {
    const paths = e
      .getAttribute(tippyPathKey)
      ?.split('-')
      ?.map((x) => parseInt(x, 10))
    if (!paths) return

    let item: BytemdAction = {
      title: '',
      handler: {
        type: 'dropdown',
        actions: e.hasAttribute(tippyIsRight) ? rightActions : actions,
      },
    }
    paths?.forEach((index) => {
      if (item.handler?.type === 'dropdown') {
        item = item.handler.actions[index]
      }
    })

    return { paths, item }
  }

  let delegateInstance: DelegateInstance | undefined
  let actionsPopover: Actions | undefined

  function init() {
    delegateInstance = delegate(toolbar, {
      target: `[${tippyTrigger}]`,
      appendTo: 'parent',
      onShow({ reference }) {
        if (reference.classList.contains(actionDisabledClass)) {
          return false
        }
      },
      onCreate({ setProps, reference, popper, disable }) {
        const commonProps: Partial<Props> = {
          placement: 'bottom-start',
          showOnCreate: true,
          theme: 'light-border',
          interactive: true,
          interactiveDebounce: 50,
          arrow: false,
          offset: [0, 4],
          trigger: 'click mouseenter',
        }

        if (reference.hasAttribute(tippyActionsTooltip)) {
          const root = document.createElement('div')
          root.classList.add('bytemd-actions-tooltip')
          const component = new Actions({
            target: root,
            props: {
              actions,
              readOnly,
              class: 'bytemd-actions-tooltip-item',
            },
          })
          component.$on('click', handleClick)
          if (actionsPopover) {
            actionsPopover.$destroy()
          }
          actionsPopover = component
          setProps({
            ...commonProps,
            content: root,
            maxWidth: 'none',
            zIndex: 9998,
            onDestroy: () => {
              actionsPopover = undefined
              component.$destroy()
            },
          })
          return
        }

        const payload = getPayloadFromElement(reference)
        if (!payload) {
          disable()
          return
        }
        const { item, paths } = payload
        const { title, handler } = item
        if (!handler) {
          disable()
          return
        }

        if (handler.type === 'action') {
          setProps({
            content: title,
          })
          return
        }

        // dropdown
        const dropdown = document.createElement('div')
        dropdown.classList.add('bytemd-dropdown')

        if (title) {
          const dropdownTitle = document.createElement('div')
          dropdownTitle.classList.add('bytemd-dropdown-title')
          dropdownTitle.appendChild(document.createTextNode(title))
          dropdown.appendChild(dropdownTitle)
        }

        handler.actions.forEach(({ handler, icon, title }, i) => {
          if (readOnly && !handler?.immutable) {
            return
          }

          const dropdownItem = document.createElement(
            handler?.type === 'action' ? 'button' : 'div'
          )
          dropdownItem.classList.add('bytemd-dropdown-item')
          dropdownItem.setAttribute(tippyPathKey, [...paths, i].join('-'))
          if (handler?.type === 'dropdown') {
            dropdownItem.setAttribute(tippyTrigger, '')
            dropdownItem.tabIndex = 0
          }

          if (handler?.type === 'action') {
            const { mouseenter, mouseleave } = handler
            if (mouseenter) {
              dropdownItem.addEventListener('mouseenter', (event) => {
                mouseenter(context, event as MouseEvent)
              })
            }
            if (mouseleave) {
              dropdownItem.addEventListener('mouseleave', (event) => {
                mouseleave(context, event as MouseEvent)
              })
            }

            dropdownItem.addEventListener('click', (event) => {
              handleClick(event as MouseEvent)
            })
          }

          if (reference.hasAttribute(tippyIsRight)) {
            dropdownItem.setAttribute(tippyIsRight, '')
          }
          // div.setAttribute('data-tippy-placement', 'right');
          dropdownItem.innerHTML = `${
            icon ? `<span class="bytemd-dropdown-item-icon">${icon}</span>` : ''
          }<span class="bytemd-dropdown-item-title">${title}</span>`
          dropdown.appendChild(dropdownItem)
        })

        setProps({
          ...commonProps,
          content: dropdown,
        })

        popper.classList.add('bytemd-tippy-dropdown')
      },
    })
  }

  function reinit() {
    if (!delegateInstance) {
      return
    }

    delegateInstance?.destroy()
    init()
  }

  $: readOnly, reinit()

  function hideTooltips() {
    delegateInstance?.disable()
    delegateInstance?.enable()
  }

  $: fullscreen, hideTooltips()

  function updateActionsTooltip() {
    actionsPopover?.$set({
      actions,
    })
  }

  $: actions, updateActionsTooltip()

  $: onMount(() => {
    init()
  })

  onDestroy(() => {
    delegateInstance?.destroy()

    if (actionsPopover) {
      actionsPopover.$destroy()
    }
  })

  function handleClick(e: MouseEvent) {
    const target = (e.target as Element).closest(`[${tippyPathKey}]`)
    if (!target) return
    const handler = getPayloadFromElement(target)?.item?.handler
    if (handler?.type === 'action') {
      handler.click(context, e)
    }
    if (target.closest('.tippy-box')) {
      hideTooltips()
    }
  }
</script>

<div class="bytemd-toolbar" bind:this={toolbar}>
  <ul class="bytemd-toolbar-side bytemd-toolbar-left">
    {#if split}
      <Actions
        {actions}
        {readOnly}
        as="li"
        class="bytemd-toolbar-item"
        on:click={handleClick}
      />
    {:else}
      {@const selectedTab = activeTab || 'write'}

      {#each tabs as tab (tab)}
        <li class="bytemd-toolbar-item">
          <button
            on:click={() => dispatch('tab', tab)}
            class="bytemd-toolbar-tab"
            class:bytemd-toolbar-tab-active={selectedTab === tab}
          >
            {locale[tab]}
          </button>
        </li>
      {/each}

      {#if selectedTab === 'write'}
        <li
          class={`bytemd-toolbar-item ${actionClass}`}
          on:mousedown|preventDefault={() => {}}
        >
          <div
            class={cx(actionIconClass, readOnly && actionDisabledClass)}
            data-bytemd-tippy-actions
            data-bytemd-tippy-trigger
          >
            {@html icons.Components}
          </div>
        </li>
      {/if}
    {/if}
  </ul>

  <ul class="bytemd-toolbar-side bytemd-toolbar-right">
    <Actions
      {readOnly}
      actions={rightActions}
      as="li"
      class={cx('bytemd-toolbar-item')}
      on:click={handleClick}
      data-bytemd-tippy-right
    />
  </ul>
</div>
