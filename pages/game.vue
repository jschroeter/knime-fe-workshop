<script setup lang="ts">
import NodeContainer from "../components/NodeContainer.vue";
import type { NodeList } from "../components/node.types.ts";

definePageMeta({ layout: "with-header" });

type Player = {
  name: string;
  score: number;
};
type Players = Player[];

const players: Players = ref([
  {
    name: "Player 1",
    score: 0,
  },
]);

const nodes: NodeList = ref([
  {
    featureSymbolicName: "org.knime.features.javasnippet",
    keywords: ["Capitalize", "Concatenate", "Strip", "Formula", "Replace"],
    icon: {
      streamable: false,
      hasDynInPorts: false,
      hasDynOutPorts: false,
      inPorts: [
        {
          objectClass: "org.knime.core.node.BufferedDataTable",
          optional: false,
          dataType: "Table",
          color: "000000",
          description: "Input table.",
          name: "Input table",
        },
      ],
      outPorts: [
        {
          objectClass: "org.knime.core.node.BufferedDataTable",
          optional: false,
          dataType: "Table",
          color: "000000",
          description:
            "Input table with an additional calculated column or one column replaced.",
          name: "Appended table",
        },
      ],
      data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowYjM2YWM5Ny01ZWJhLTQwZTctOTE4OS1iYmU4ZDdkMGYyNGUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTRBMDBEMkQxODM0MTFFNTgxM0FFMEQwQTc0Qzg5QTIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTRBMDBEMkMxODM0MTFFNTgxM0FFMEQwQTc0Qzg5QTIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpjZTBmYzg4ZC1kNjkyLTQ5NDEtOTZiOC03ODIxMjliYWZkYWIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MGIzNmFjOTctNWViYS00MGU3LTkxODktYmJlOGQ3ZDBmMjRlIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Mg1IMQAAAIdJREFUeNrMk+8KgCAMxJ0vEdTL6pNfTvpzrM2gPtRBKLv5a2MqANIbyT8BIoIoh70WlwugJXRPt5Ro/S0M2U3Ql2hVFfIKxdHPEiBZ0/FAFT0CJAvIupunxdJZNWjhpDUALD2YGtwKIt3AurI3qkELNfqLXTG6od4UvF4RlH94evb7x7QKMACq4pshQaRWkAAAAABJRU5ErkJggg==",
      deprecated: false,
      type: "Manipulator",
    },
    tags: ["Manipulation", "Column", "Convert & Replace", "Streamable"],
    private: false,
    pathToResource:
      "org.knime.base.node.preproc.stringmanipulation.StringManipulationNodeFactory",
    ownerAccountId: "account:user:d59eed2b-1403-42b8-a659-8719671269e1",
    kudosCount: 10,
    itemType: "Node",
    id: "*eOn8ibZnxIkY7XhT",
    description:
      "<p>Manipulates strings like search and replace, capitalize or remove leading and trailing white spaces.</p>\n            \t        \n            <b>Examples:</b>\n            \t        \n            <p>To remove leading and trailing blanks from a column with name <i>c0</i> you would use the expression: <br /><i>strip($c0$)</i></p>\n                        \n            <p>If you have your customer names in column <i>names</i> with titles Mr and Mister and you want to normalize the data so that only Mr is used you could use the expression: <br /><i>replace($names$, &#34;Mister&#34;, &#34;Mr&#34;)</i> <br />\n  or you could combine it to <br /><i>replace(replace($names$, &#34;Mister&#34;, &#34;Mr&#34;), &#34;Miss&#34;, &#34;Ms&#34;)</i></p>\n                        \n            <p>Or if you want to have the number of characters of the strings in a column with name <i>text</i> : <br /><i>length($text$)</i></p>\n                        \n            <p>Note that strings which are part of the expression and are not from the input data (or the result of another wrapped function call) need to be enclosed in double quotes (&#39;&#34;&#39;). Additionally, if the string contains a quote character, it must be escaped using a backslash character (&#39;\\&#34;&#39;). Finally, other special characters such as single quotes and backslashes need to be escaped using a backslash. For instance, a single backslash in a string is written as two consecutive backslash characters; the first one acts as the escape character for the second.</p>\n            \t\t\n        \n        ",
    title: "String Manipulation",
    owner: "knime",
  },
]);
</script>

<template>
  <div>
    <div v-for="i in players.length" :key="i" class="player-container">
      <NodeContainer :node-data="nodes[0]" />
    </div>
  </div>
</template>
