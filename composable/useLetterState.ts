import isWhiteSpace from "../utils/isWhiteSpace";
import isSpecialCharacter from "../utils/isSpecialCharacter";

export type LetterState = {
  letter: string;
  state: "hidden" | "special" | "revealed" | "solved";
};

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

  const nextHiddenLetterIndex = computed(() => {
    return letterAndState.value.findIndex((entry) => entry.state === "hidden");
  });

  const nextHiddenLetter = computed(() => {
    return letterAndState.value[nextHiddenLetterIndex.value];
  });

  const numberOfSolvedLetters = computed(() => {
    return letterAndState.value.filter((entry) => entry.state === "solved")
      .length;
  });

  initializeLetterStateMap({ name });

  return {
    letterAndState,
    letterStateMap,
    numberOfSolvedLetters,
    nextHiddenLetter,
    nextHiddenLetterIndex,
    initializeLetterStateMap,
  };
};
