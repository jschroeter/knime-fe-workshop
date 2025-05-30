import type { HiddenLetter, LetterState } from "./useLetterState";

export const useReveal = ({
  letterStateMap,
  gameStore,
}: {
  letterStateMap: Ref<Map<number, LetterState>>;
  gameStore: {
    addPoint: () => void;
  };
}) => {
  let revealInterval: ReturnType<typeof setInterval> | undefined;
  const revealTime = 3 * 1000;

  const stopRevealInterval = () => {
    if (revealInterval) {
      clearInterval(revealInterval);
      revealInterval = undefined;
    }
  };

  // TODO pause the interval while the user is typing
  const startRevealInterval = () => {
    stopRevealInterval();
    revealInterval = setInterval(() => {
      const hiddenEntries = Array.from(letterStateMap.value.entries()).filter(
        ([_, value]) => value.state === "hidden",
      );

      if (hiddenEntries.length === 0) {
        clearInterval(revealInterval);
        return;
      }

      const [randomIndex, entry] =
        hiddenEntries[Math.floor(Math.random() * hiddenEntries.length)];

      letterStateMap.value.set(randomIndex, {
        ...entry,
        state: "revealed",
      });
    }, revealTime);
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
      letterStateMap.value.set(actualLetterObject.index, {
        ...actualLetterObject,
        state: "solved",
      });
      gameStore.addPoint();
    }
  };

  const revealNextHiddenLetter = (nextHiddenLetter: HiddenLetter) => {
    if (!nextHiddenLetter) {
      return;
    }

    letterStateMap.value.set(nextHiddenLetter.index, {
      ...nextHiddenLetter,
      state: "revealed",
    });
  };

  return {
    startRevealInterval,
    stopRevealInterval,
    revealIfCorrectLetter,
    revealNextHiddenLetter,
  };
};
