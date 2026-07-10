<template>
  <svg
    class="ui-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
    aria-hidden="true"
  >
    <template v-if="name === 'format'">
      <path d="M4 6h10" />
      <path d="M4 12h16" />
      <path d="M4 18h10" />
      <path d="M18 4l2 2-2 2" />
      <path d="M18 16l2 2-2 2" />
    </template>
    <template v-else-if="name === 'viewer'">
      <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
      <circle cx="12" cy="12" r="3" />
    </template>
    <template v-else-if="name === 'tree'">
      <path d="M12 5v14" />
      <path d="M7 10h10" />
      <path d="M7 19h4" />
      <path d="M13 19h4" />
      <circle cx="12" cy="5" r="2" />
      <circle cx="7" cy="10" r="2" />
      <circle cx="17" cy="10" r="2" />
      <circle cx="11" cy="19" r="2" />
      <circle cx="17" cy="19" r="2" />
    </template>
    <template v-else-if="name === 'validate'">
      <circle cx="12" cy="12" r="8" />
      <path d="m9 12 2 2 4-4" />
    </template>
    <template v-else-if="name === 'minify'">
      <path d="M7 7h10v10H7z" />
      <path d="m10 10 4 4" />
      <path d="m14 10-4 4" />
    </template>
    <template v-else-if="name === 'typescript'">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M9 9h6" />
      <path d="M12 9v6" />
      <path d="M9 15h6" />
    </template>
    <template v-else-if="name === 'file'">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5" />
    </template>
    <template v-else-if="name === 'trash'">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 10v6" />
      <path d="M14 10v6" />
    </template>
    <template v-else-if="name === 'copy'">
      <rect x="9" y="9" width="10" height="11" rx="2" />
      <path d="M15 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2" />
    </template>
    <template v-else-if="name === 'download'">
      <path d="M12 4v10" />
      <path d="m8 10 4 4 4-4" />
      <path d="M5 20h14" />
    </template>
    <template v-else-if="name === 'folder'">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    </template>
    <template v-else-if="name === 'expand'">
      <path d="M8 4H4v4" />
      <path d="m4 4 6 6" />
      <path d="M16 20h4v-4" />
      <path d="m20 20-6-6" />
      <path d="M20 8V4h-4" />
      <path d="m20 4-6 6" />
      <path d="M4 16v4h4" />
      <path d="m4 20 6-6" />
    </template>
    <template v-else-if="name === 'sun'">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
    </template>
    <template v-else-if="name === 'github'">
      <path d="M9 19c-4.5 1.5-5-2-7-2" />
      <path d="M15 22v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 19 4.77 5.07 5.07 0 0 0 18.91 1S17.73.65 15 2.48a13.38 13.38 0 0 0-6 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </template>
    <template v-else-if="name === 'spark'">
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" />
    </template>
  </svg>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    name:
      | 'format'
      | 'viewer'
      | 'tree'
      | 'validate'
      | 'minify'
      | 'typescript'
      | 'file'
      | 'trash'
      | 'copy'
      | 'download'
      | 'folder'
      | 'expand'
      | 'sun'
      | 'github'
      | 'spark';
    strokeWidth?: number;
  }>(),
  {
    strokeWidth: 1.8,
  },
);
</script>
