import isWhiteSpace from "~/utils/isWhiteSpace";
import isSpecialCharacter from "~/utils/isSpecialCharacter";

export const stateMap = Object.freeze({
  hidden: "hidden",
  special: "special",
  revealed: "revealed",
  solved: "solved",
});
export type State = (typeof stateMap)[keyof typeof stateMap];

export type LetterState = {
  letter: string;
  state: State;
};

export type HiddenLetter =
  | {
      index: number;
      letter: string;
      state: State;
    }
  | undefined;

export type HiddenEntry = [number, LetterState];

export const useLetterState = ({ name }: { name: Ref<string> }) => {
  const letterStateMap = ref(new Map<number, LetterState>());

  const getLetterState = (letter: string): LetterState => {
    switch (true) {
      case isWhiteSpace(letter):
        return { letter, state: stateMap.revealed };
      case isSpecialCharacter(letter):
        return { letter, state: stateMap.special };
      default:
        return { letter, state: stateMap.hidden };
    }
  };

  const initializeLetterStateMap = ({ name }: { name: string }) => {
    letterStateMap.value.clear();

    name.split("").forEach((letter: string, index: number) => {
      letterStateMap.value.set(index, getLetterState(letter));
    });
  };

  const updateLetterState = ({
    index,
    newState,
  }: {
    index: number;
    newState: State;
  }) => {
    const currentEntry = letterStateMap.value.get(index);
    if (currentEntry) {
      letterStateMap.value.set(index, {
        ...currentEntry,
        state: newState,
      });
    }
  };

  const letterAndState = computed(() =>
    Array.from(letterStateMap.value.entries()).map(
      ([index, { letter, state }]) => ({
        index,
        letter,
        state,
      }),
    ),
  );

  const hiddenEntries = computed(() =>
    Array.from(letterStateMap.value.entries()).filter(
      ([_, value]) => value.state === stateMap.hidden,
    ),
  ) as Ref<HiddenEntry[]>;

  const nextHiddenLetter = computed(() =>
    letterAndState.value.find((entry) => entry.state === stateMap.hidden),
  ) as Ref<HiddenLetter>;

  const numberOfSolvedLetters = computed(
    () =>
      letterAndState.value.filter((entry) => entry.state === stateMap.solved)
        .length,
  );

  const isSolved = computed(
    () =>
      !letterAndState.value.find((entry) => entry.state === stateMap.hidden),
  );

  const percentage = computed(() => {
    const totalLetters = letterStateMap.value.size;
    const hiddenLetters = letterAndState.value.filter(
      (entry) => entry.state === stateMap.hidden,
    ).length;

    return totalLetters > 0
      ? ((totalLetters - hiddenLetters) / totalLetters) * 100
      : 0;
  });

  watch(
    name,
    (newName: string) => {
      initializeLetterStateMap({ name: newName });
    },
    { immediate: true },
  );

  return {
    letterAndState,
    letterStateMap,
    numberOfSolvedLetters,
    nextHiddenLetter,
    updateLetterState,
    isSolved,
    percentage,
    hiddenEntries,
  };
};
