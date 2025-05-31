import {
  stateMap,
  type HiddenEntry,
  type HiddenLetter,
  type State,
} from "./useLetterState";

import { useIntervalFn } from "@vueuse/core";

const AUTO_REVEAL_TIME = 3 * 1000;

export const useReveal = ({
  name,
  isSolved,
  userIsTyping,
  hiddenEntries,
  updateLetterState,
}: {
  name: Ref<string>;
  isSolved: Ref<boolean>;
  userIsTyping: Ref<boolean>;
  hiddenEntries: Ref<HiddenEntry[]>;
  updateLetterState: ({
    index,
    newState,
  }: {
    index: number;
    newState: State;
  }) => void;
}) => {
  let pause: () => void = () => {};
  let resume: () => void = () => {};
  let isActive = ref(false);

  const startRevealInterval = () => {
    if (isActive.value) {
      return;
    }

    ({ pause, resume, isActive } = useIntervalFn(() => {
      if (hiddenEntries.value.length === 0) {
        pause();
        return;
      }

      const [randomIndex] =
        hiddenEntries.value[
          Math.floor(Math.random() * hiddenEntries.value.length)
        ];

      updateLetterState({ index: randomIndex, newState: stateMap.revealed });
    }, AUTO_REVEAL_TIME));
  };

  const revealIfCorrectLetter = (
    guessedLetter: string,
    nextHiddenLetter: HiddenLetter,
  ) => {
    if (!nextHiddenLetter) {
      return;
    }

    guessedLetter = guessedLetter.toLowerCase();
    const actualLetterObject = nextHiddenLetter;
    const actualLetter = actualLetterObject.letter.toLowerCase();

    if (guessedLetter === actualLetter) {
      updateLetterState({
        index: actualLetterObject.index,
        newState: stateMap.solved,
      });
      // TODO add points to the game store
    }
  };

  const revealNextHiddenLetter = (nextHiddenLetter: HiddenLetter) => {
    if (!nextHiddenLetter) {
      return;
    }

    updateLetterState({
      index: nextHiddenLetter.index,
      newState: stateMap.revealed,
    });
  };

  watch(
    name,
    () => {
      startRevealInterval();
    },
    { immediate: true },
  );

  watch(userIsTyping, (isTyping) => {
    if (isTyping) {
      pause();
    } else {
      resume();
    }
  });

  watch(
    isSolved,
    (newIsSolved) => {
      if (newIsSolved) {
        pause();
      } else {
        resume();
      }
    },
    { immediate: true },
  );

  onMounted(() => {
    startRevealInterval();
  });

  onUnmounted(() => {
    pause();
  });

  return {
    startRevealInterval,
    revealIfCorrectLetter,
    revealNextHiddenLetter,
  };
};
