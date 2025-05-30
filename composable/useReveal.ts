import {
  stateMap,
  type HiddenEntry,
  type HiddenLetter,
  type State,
} from "./useLetterState";

export const useReveal = ({
  hiddenEntries,
  updateLetterState,
  addPoint,
}: {
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
      if (hiddenEntries.value.length === 0) {
        clearInterval(revealInterval);
        return;
      }

      const [randomIndex] =
        hiddenEntries.value[
          Math.floor(Math.random() * hiddenEntries.value.length)
        ];

      updateLetterState({ index: randomIndex, newState: stateMap.revealed });
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

  return {
    startRevealInterval,
    stopRevealInterval,
    revealIfCorrectLetter,
    revealNextHiddenLetter,
  };
};
