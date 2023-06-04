<script lang="ts" context="module">
  import { BytemdAction } from './types'

  export type BytemdActiveActions = BytemdAction & {
    active?: boolean
    hidden?: boolean
  }

  export const tippyPathKey = 'data-bytemd-tippy-path'
  export const tippyTrigger = 'data-bytemd-tippy-trigger'

  export const actionClass = 'bytemd-action'
  export const actionIconClass = 'bytemd-action-icon'
  export const actionActiveClass = 'bytemd-action-icon-active'
  export const actionDisabledClass = 'bytemd-action-icon-disabled'
</script>

<script lang="ts">
  import clsx from 'clsx'

  let className: string | undefined = undefined

  export let actions: BytemdActiveActions[]
  export let readOnly: boolean = false
  export let as: string = 'div'
  export { className as class }

  $: rootClassName = clsx('bytemd-action', className)
</script>

{#each actions as item, index}
  {#if !item.hidden && item.handler}
    {@const disabled = readOnly && !item.handler.immutable}

    <svelte:element this={as} class={rootClassName}>
      {#if item.handler.type === 'action'}
        <button
          {...$$restProps}
          {disabled}
          on:click
          class={clsx('bytemd-action-icon', className)}
          class:bytemd-action-icon-disabled={disabled}
          class:bytemd-action-icon-active={item.active}
          tabindex={item.handler.immutable ? 0 : -1}
          data-bytemd-tippy-trigger
          data-bytemd-tippy-path={index}
        >
          {@html item.icon}
        </button>
      {:else}
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <div
          {...$$restProps}
          class={clsx('bytemd-action-icon', className)}
          class:bytemd-action-icon-disabled={disabled}
          class:bytemd-action-icon-active={item.active}
          data-bytemd-tippy-trigger
          data-bytemd-tippy-path={index}
          tabindex={item.handler.immutable ? 0 : null}
        >
          {@html item.icon}
        </div>
      {/if}
    </svelte:element>
  {/if}
{/each}
