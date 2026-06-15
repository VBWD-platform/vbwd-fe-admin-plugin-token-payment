<template>
  <div class="field-group">
    <label class="field-label">{{ $t('tokenPaymentAdmin.tokenBundleWidget.bundles') }}</label>
    <DualListSelector
      testid="bundles"
      :model-value="selectedBundleIds"
      :options="bundleOptions"
      @update:model-value="setBundleIds"
    />
    <p class="field-hint">
      {{ $t('tokenPaymentAdmin.tokenBundleWidget.bundlesHint') }}
    </p>
  </div>

  <div class="field-group">
    <label class="field-label">{{ $t('tokenPaymentAdmin.tokenBundleWidget.defaultView') }}</label>
    <select
      data-test="default-view"
      :value="config.default_view"
      class="field-input"
      @change="set('default_view', ($event.target as HTMLSelectElement).value)"
    >
      <option
        v-for="defaultViewOption in DEFAULT_VIEW_OPTIONS"
        :key="defaultViewOption"
        :value="defaultViewOption"
      >
        {{ $t(`tokenPaymentAdmin.tokenBundleWidget.defaultViewOption.${defaultViewOption}`) }}
      </option>
    </select>
  </div>

  <div class="field-group">
    <label class="field-label">{{ $t('tokenPaymentAdmin.tokenBundleWidget.heading') }}</label>
    <input
      data-test="heading"
      :value="config.heading"
      class="field-input"
      type="text"
      :placeholder="$t('tokenPaymentAdmin.tokenBundleWidget.headingPlaceholder')"
      @input="set('heading', ($event.target as HTMLInputElement).value)"
    >
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import DualListSelector, { type DualListOption } from '@/components/DualListSelector.vue';
import { DEFAULT_VIEW_OPTIONS } from './tokenBundleCollectionWidgetOptions';

interface TokenBundleItem {
  id: string;
  name: string;
  token_amount: number;
}

const props = defineProps<{ config: Record<string, unknown> }>();
const emit = defineEmits<{ (e: 'update:config', val: Record<string, unknown>): void }>();

const config = computed(() => props.config);
const selectedBundleIds = computed<string[]>(() =>
  Array.isArray(config.value.bundle_ids) ? (config.value.bundle_ids as string[]) : [],
);

const availableBundles = ref<TokenBundleItem[]>([]);

const bundleOptions = computed<DualListOption[]>(() =>
  availableBundles.value.map((bundle) => ({
    value: bundle.id,
    label: `${bundle.name} (${bundle.token_amount} tokens)`,
  })),
);

async function loadBundles(): Promise<void> {
  try {
    const response = await fetch(
      '/api/v1/admin/token-bundles?per_page=100&include_inactive=false',
    );
    const data = await response.json();
    availableBundles.value = data.items ?? [];
  } catch {
    availableBundles.value = [];
  }
}

function set(key: string, value: unknown): void {
  emit('update:config', { ...props.config, [key]: value });
}

function setBundleIds(bundleIds: string[]): void {
  set('bundle_ids', bundleIds);
}

onMounted(() => {
  loadBundles();
});
</script>

<style scoped>
.field-hint {
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: var(--vbwd-text-muted, #6b7280);
}
</style>
