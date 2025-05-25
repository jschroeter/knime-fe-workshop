<script setup lang="ts">
import { toRefs } from "vue";
import { NodePreview } from "@knime/components";
import NodeName from "./NodeName";
import adjustPortFormat from "../utils/adjustPortFormat";
import { truncateString } from "@knime/utils";
import htmlToPlain from "../utils/htmlToPlain";

const props = defineProps<{
  nodeData: Node;
}>();

const { title: name, description, icon } = toRefs(props.nodeData);

const {
  type,
  inPorts,
  outPorts,
  hasDynPorts,
  data: dataUrl,
} = toRefs(icon.value);

const showTruncated = ref(true);

const defaultMaxDescriptionLength = 200;
const truncatedDescription = computed(() => {
  const sanitized = htmlToPlain(description.value);
  return truncateString(sanitized, defaultMaxDescriptionLength);
});
</script>

<template>
  <div class="node-container">
    <div class="icon">
      <NodePreview
        class="preview"
        :type="type"
        :in-ports="inPorts.map(adjustPortFormat)"
        :out-ports="outPorts.map(adjustPortFormat)"
        :has-dyn-ports="hasDynPorts"
        :icon="dataUrl"
      />
      <div class="node-type">{{ type }}</div>
    </div>

    <div class="text">
      <NodeName :name="name" />
      <p>
        <span v-if="showTruncated" class="truncated-description"
          >{{ truncatedDescription }}
        </span>

        <!-- eslint-disable vue/no-v-html -->
        <span v-else v-html="description" />
        <!-- eslint-enable vue/no-v-html -->
        <span class="learn-more" @click="showTruncated = !showTruncated">{{
          showTruncated ? "Show more" : "Show less"
        }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.node-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
  background-color: var(--knime-white);
  height: 100%;
  max-width: 800px;

  & .icon {
    flex: 0 0 100px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    align-self: stretch;
    padding: 7px;
    background-color: var(--knime-gray-light-semi);
    font-size: 13px;

    & .node-type {
      text-align: center;
      white-space: normal;
      overflow-wrap: anywhere;
      max-width: 100%;
    }

    & .preview {
      margin-top: -10px;
      margin-bottom: -10px;
      width: 180px;
      height: 180px;
    }
  }

  & .text {
    padding: 20px;

    p {
      & .truncated-description {
        margin-right: 10px;
      }

      & .learn-more {
        opacity: 0;
        font-weight: 500;
        color: var(--knime-dove-gray);
        white-space: nowrap;
        cursor: pointer;
        transition: opacity 0.3s ease;
      }
    }

    &:hover {
      & .learn-more {
        opacity: 1;
      }
    }
  }
}
</style>
