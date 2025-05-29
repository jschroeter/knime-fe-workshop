import party from "party-js";
import knimeTriangle from "@knime/styles/img/KNIME_Triangle.svg?url";

party.resolvableShapes["knime"] = `<img src="${knimeTriangle}" />`;

export function useParty() {
  function sparkles(factor: number = 1) {
    party.sparkles(document.body, {
      count: party.variation.range(factor, 10 * factor),
      size: party.variation.range(0.1, 0.2),
      shapes: ["knime"],
    });
  }

  return { sparkles };
}
