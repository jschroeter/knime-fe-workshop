import isWhiteSpace from "../utils/isWhiteSpace";
import isSpecialCharacter from "../utils/isSpecialCharacter";

type State = "hidden" | "special" | "revealed" | "solved";

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

export const useLetterState = ({ name }: { name: string }) => {
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

  const letterAndState = computed(() =>
    Array.from(letterStateMap.value.entries()).map(
      ([index, { letter, state }]) => ({
        index,
        letter,
        state,
      }),
    ),
  );

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

  initializeLetterStateMap({ name });

  return {
    letterAndState,
    letterStateMap,
    numberOfSolvedLetters,
    nextHiddenLetter,
    initializeLetterStateMap,
    isSolved,
    percentage,
  };
};
