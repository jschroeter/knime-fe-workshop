import isWhiteSpace from "../utils/isWhiteSpace";
import isSpecialCharacter from "../utils/isSpecialCharacter";

export type State = "hidden" | "special" | "revealed" | "solved";

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
        return { letter, state: "revealed" };
      case isSpecialCharacter(letter):
        return { letter, state: "special" };
      default:
        return { letter, state: "hidden" };
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
      ([_, value]) => value.state === "hidden",
    ),
  ) as Ref<HiddenEntry[]>;

  const nextHiddenLetter = computed(() =>
    letterAndState.value.find((entry) => entry.state === "hidden"),
  ) as Ref<HiddenLetter>;

  const numberOfSolvedLetters = computed(
    () =>
      letterAndState.value.filter((entry) => entry.state === "solved").length,
  );

  const isSolved = computed(
    () => !letterAndState.value.find((entry) => entry.state === "hidden"),
  );

  const percentage = computed(() => {
    const totalLetters = letterStateMap.value.size;
    const hiddenLetters = letterAndState.value.filter(
      (entry) => entry.state === "hidden",
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
    initializeLetterStateMap,
    updateLetterState,
    isSolved,
    percentage,
    hiddenEntries,
  };
};
