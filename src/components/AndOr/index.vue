<template>
  <div class="and-or--body">
    <div class="and-or--line"></div>
    <div class="and-or--btn__group">
      <button
        :class="curRelation === 1 ? 'and-or-btn__active' : ''"
        type="button"
        @click="handleRelation(1)">
        且
      </button>
      <button
        :class="curRelation === 2 ? 'and-or-btn__active' : ''"
        type="button"
        @click="handleRelation(2)">
        或
      </button>
    </div>
    <div class="and-or--line"></div>
  </div>
</template>

<script lang="ts" setup name="AndOr">
  import { ref } from 'vue'
  const props = defineProps({
    modelValue: {
      type: Number,
      default: 1,
    },
  })
  const emit = defineEmits(['update:modelValue'])
  const curRelation = ref<number>(props.modelValue)
  const handleRelation = (val: number) => {
    curRelation.value = val
    emit('update:modelValue', val)
  }
</script>

<style scoped lang="scss">
  .and-or--body {
    position: relative;
    width: 1.7rem;
    height: auto;
    margin: 0 0.5rem;
    .and-or--btn__group {
      border: 1px solid #409eff;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
    }
    button {
      background: transparent;
      color: #409eff;
      width: 1.6rem;
      height: 1.8rem;
      text-align: center;
      border: none;
      cursor: pointer;
    }
    .and-or-btn__active {
      background-color: #409eff;
      color: white;
    }
    button:first-of-type {
      border-bottom: 1px solid #409eff;
    }
    .and-or--line {
      background-color: #409eff;
      width: 1px;
      position: relative;
      height: calc(50% - 30px);
      left: 50%;
    }
  }
</style>
