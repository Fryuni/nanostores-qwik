import {
  $,
  implicit$FirstArg,
  useOnDocument,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { isBrowser } from "@builder.io/qwik/build";
import { onMount, onSet } from "nanostores";

const marker = Symbol("nsqwik");

function markAtom(atom) {
  if (marker in atom) return;

  onMount(atom, () => {
    let unbind = onSet(atom, () => {
      document.dispatchEvent(
        new CustomEvent("nsqwik", {
          detail: { atom },
        }),
      );
    });

    return () => {
      unbind();
    };
  });

  Object.defineProperty(atom, marker, { enumerable: false, value: true });
}

export function useNanostoreQrl(store$, options) {
  let { resolved } = store$;

  let count = useSignal(resolved.value);

  useTask$(async ({ cleanup, track }) => {
    let store = await store$.resolve();
    let value = track(count);

    if ((options?.external ?? false) === false && isBrowser) {
      markAtom(store);
      let unbind = store.subscribe(async (newValue) => {
        if (count.value !== newValue) {
          count.value = newValue;
        }
      });

      cleanup(() => {
        unbind();
      });
    }

    if (value !== store.value) {
      store.set(value);
    }
  });

  useOnDocument(
    "nsqwik",
    $((e) => {
      let value = e.detail.atom.value;
      if (count.value !== value) {
        count.value = value;
      }
    }),
  );

  if ((options?.external ?? false) === false) {
    return count;
  }

  useVisibleTask$(
    async ({ cleanup }) => {
      let store = await store$.resolve();
      markAtom(store);

      let unbind = store.subscribe(async (value) => {
        if (count.value !== value) {
          count.value = value;
        }
      });

      cleanup(() => {
        unbind();
      });
    },
    typeof options?.external === "object" ? options.external : {},
  );

  return count;
}

export const useNanostore$ = implicit$FirstArg(useNanostoreQrl);
