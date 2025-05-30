import {
  stateMap,
  type HiddenEntry,
  type HiddenLetter,
  type State,
} from "./useLetterState";

import { useIntervalFn } from "@vueuse/core";

export const useReveal = ({
  name,
  isSolved,
  userIsTyping,
  hiddenEntries,
  updateLetterState,
  addPoint,
}: {
  name: Ref<string>;
  isSolved: Ref<boolean>;
  userIsTyping: Ref<boolean>;
  hiddenEntries: Ref<HiddenEntry[]>;
  addPoint: () => void;
  updateLetterState: ({
    index,
    newState,
  }: {
    index: number;
    newState: State;
  }) => void;
}) => {
  const revealTime = 3 * 1000;

  let pause: () => void = () => {};
  let resume: () => void = () => {};

  const startRevealInterval = () => {
    pause();

    ({ pause, resume } = useIntervalFn(() => {
      if (hiddenEntries.value.length === 0) {
        pause();
        return;
      }

      const [randomIndex] =
        hiddenEntries.value[
          Math.floor(Math.random() * hiddenEntries.value.length)
        ];

      updateLetterState({ index: randomIndex, newState: stateMap.revealed });
    }, revealTime));
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
      addPoint();
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
    () => {
      pause();
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
