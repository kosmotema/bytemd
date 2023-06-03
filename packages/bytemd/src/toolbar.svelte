<svelte:options immutable={true} />

<script lang="ts">
  import { icons } from './icons'
  import type { BytemdEditorContext, BytemdAction, BytemdLocale } from './types'
  import { createEventDispatcher, onDestroy, onMount, tick } from 'svelte'
  import type { DelegateInstance } from 'tippy.js'
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

  const tippyClass = 'bytemd-tippy'
  const tippyClassRight = 'bytemd-tippy-right'
  const tippyPathKey = 'data-bytemd-tippy-path'

  function getPayloadFromElement(e: Element) {
    const paths = e
      .getAttribute(tippyPathKey)
      ?.split('-')
      ?.map((x) => parseInt(x, 10))
    if (!paths) return
    // if (!paths) {
    //   return {
    //     paths: [],
    //     item: {
    //       title: 'test',
    //       handler: actions,
    //     },
    //   };
    // }

    let item: BytemdAction = {
      title: '',
      handler: {
        type: 'dropdown',
        actions: e.classList.contains(tippyClassRight) ? rightActions : actions,
      },
    }
    paths?.forEach((index) => {
      if (item.handler?.type === 'dropdown') {
        item = item.handler.actions[index]
      }
    })

    return { paths, item }
  }

  let delegateInstance: DelegateInstance

  function init() {
    delegateInstance = delegate(toolbar, {
      target: `.${tippyClass}`,
      appendTo: 'parent',
      onShow({ reference }) {
        if (reference.classList.contains('bytemd-toolbar-icon-disabled')) {
          return false
        }
      },
      onCreate({ setProps, reference, popper }) {
        const payload = getPayloadFromElement(reference)
        if (!payload) return
        const { item, paths } = payload
        const { handler } = item
        if (!handler || (readOnly && !handler.immutable)) return

        if (handler.type === 'action') {
          setProps({
            content: item.title,
          })
        } else if (handler.type === 'dropdown') {
          // dropdown
          const dropdown = document.createElement('div')
          dropdown.classList.add('bytemd-dropdown')

          if (item.title) {
            const dropdownTitle = document.createElement('div')
            dropdownTitle.classList.add('bytemd-dropdown-title')
            dropdownTitle.appendChild(document.createTextNode(item.title))
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
              dropdownItem.classList.add(tippyClass)
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

            if (reference.classList.contains(tippyClassRight)) {
              dropdownItem.classList.add(tippyClassRight)
            }
            // div.setAttribute('data-tippy-placement', 'right');
            dropdownItem.innerHTML = `${
              icon
                ? `<span class="bytemd-dropdown-item-icon">${icon}</span>`
                : ''
            }<span class="bytemd-dropdown-item-title">${title}</span>`
            dropdown.appendChild(dropdownItem)
          })

          if (dropdown.children.length === 0) {
            setProps({
              content: item.title,
            })
          } else {
            setProps({
              showOnCreate: true,
              theme: 'light-border',
              placement: 'bottom-start',
              interactive: true,
              interactiveDebounce: 50,
              arrow: false,
              offset: [0, 4],
              content: dropdown,
            })

            popper.classList.add('bytemd-tippy-dropdown')
          }
        }
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

  $: fullscreen, tick().then(() => delegateInstance?.popperInstance?.update())

  onMount(() => {
    init()
  })

  onDestroy(() => {
    delegateInstance?.destroy()
  })

  function handleClick(e: MouseEvent) {
    const target = (e.target as Element).closest(`[${tippyPathKey}]`)
    if (!target) return
    const handler = getPayloadFromElement(target)?.item?.handler
    if (handler?.type === 'action') {
      handler.click(context, e)
    }
  }
</script>

<div class="bytemd-toolbar" bind:this={toolbar}>
  <ul class="bytemd-toolbar-side bytemd-toolbar-left">
    {#if split}
      {#each actions as item, index}
        {#if item.handler}
          {@const disabled = readOnly && !item.handler.immutable}

          <li class="bytemd-toolbar-item">
            {#if item.handler.type === 'action'}
              <button
                {disabled}
                on:click={handleClick}
                class={['bytemd-toolbar-icon', tippyClass].join(' ')}
                class:bytemd-toolbar-icon-disabled={disabled}
                data-bytemd-tippy-path={index}
                tabindex={item.handler.immutable ? 0 : -1}
              >
                {@html item.icon}
              </button>
            {:else}
              <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
              <div
                class={['bytemd-toolbar-icon', tippyClass].join(' ')}
                class:bytemd-toolbar-icon-disabled={disabled}
                data-bytemd-tippy-path={index}
                tabindex={item.handler.immutable ? 0 : null}
              >
                {@html item.icon}
              </div>
            {/if}
          </li>
        {/if}
      {/each}
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
    {/if}
  </ul>

  <ul class="bytemd-toolbar-side bytemd-toolbar-right">
    {#each rightActions as item, index}
      {#if !item.hidden && item.handler}
        {@const disabled = readOnly && !item.handler.immutable}

        <li class="bytemd-toolbar-item">
          {#if item.handler.type === 'action'}
            <button
              {disabled}
              on:click={handleClick}
              class={['bytemd-toolbar-icon', tippyClass, tippyClassRight].join(
                ' '
              )}
              class:bytemd-toolbar-icon-disabled={disabled}
              class:bytemd-toolbar-icon-active={item.active}
              data-bytemd-tippy-path={index}
              tabindex={item.handler.immutable ? 0 : -1}
            >
              {@html item.icon}
            </button>
          {:else}
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <div
              class={['bytemd-toolbar-icon', tippyClass, tippyClassRight].join(
                ' '
              )}
              class:bytemd-toolbar-icon-disabled={disabled}
              class:bytemd-toolbar-icon-active={item.active}
              data-bytemd-tippy-path={index}
              tabindex={item.handler.immutable ? 0 : null}
            >
              {@html item.icon}
            </div>
          {/if}
        </li>
      {/if}
    {/each}
  </ul>
</div>
