import type { OnVisibleTaskOptions, Signal } from '@builder.io/qwik'

export type Options = {
  /**
   * Whether the Qwik signal should eagerly react to changes in the
   * nanostore made outside of any Qwik component.
   *
   * This can be used on pages combining multiple UI frameworks.
   */
  external: boolean | OnVisibleTaskOptions;
};


/**
 * Use a nanostore as a Qwik Signal.
 *
 * ```jsx
 * import { component$ } from '@builder.io/qwik';
 * import { useNanostore$ } from '@nanostores/qwik'
 * import { router } from '../store/router'
 *
 * export default = component$(() => {
 *   const page = useNanostore$(router);
 *
 *   if (page.value.route === 'home') {
 *     return <HomePage />
 *   } else {
 *     return <Error404 />
 *   }
 * });
 * ```
 *
 * @param store Nanostore instance.
 * @returns Qwik Signal instance.
 */
export function useNanostore$<V>(
  store$: WritableAtom<V>,
  options?: Options,
): Signal<ReadonlyIfObject<V>>;
