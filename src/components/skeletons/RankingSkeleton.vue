<template>
  <div class="animate-pulse">
    <div class="flex items-center justify-between mb-6">
      <div class="h-8 w-40 bg-[#415a77] rounded" />
      <div class="h-10 w-10 bg-[#415a77] rounded-lg" />
    </div>

    <div class="flex gap-2 mb-4">
      <div v-for="n in 5" :key="n" class="h-8 w-20 bg-[#415a77] rounded-full" />
    </div>

    <div class="space-y-3">
      <div v-for="n in 8" :key="n" class="rounded-lg bg-[#1b263b] p-4">
        <div class="flex items-center gap-4">
          <div class="h-7 w-7 rounded-full bg-[#415a77]" />
          <div class="flex-1 space-y-2">
            <div class="h-5 w-20 bg-[#415a77] rounded" />
            <div class="h-3 w-40 bg-[#415a77] rounded" />
          </div>
          <div class="h-7 w-20 bg-[#415a77] rounded" />
          <div class="hidden sm:block h-5 w-16 bg-[#415a77] rounded" />
          <div class="hidden sm:block h-5 w-16 bg-[#415a77] rounded" />
          <div class="hidden sm:block h-5 w-14 bg-[#415a77] rounded" />
        </div>
      </div>
    </div>
  </div>
</template>
