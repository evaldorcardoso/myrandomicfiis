<template>
  <div class="animate-pulse">
    <div class="flex items-center justify-between mb-6">
      <div class="h-8 w-32 bg-[#415a77] rounded" />
      <div class="h-10 w-10 bg-[#415a77] rounded-lg" />
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
      <div v-for="n in 6" :key="n" class="rounded-lg bg-[#1b263b] p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="h-3 w-24 bg-[#415a77] rounded" />
          <div class="h-5 w-5 bg-[#415a77] rounded" />
        </div>
        <div class="h-7 w-32 bg-[#415a77] rounded mb-2" />
        <div class="h-4 w-20 bg-[#415a77] rounded" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
      <div class="rounded-lg bg-[#1b263b] p-6">
        <div class="h-5 w-40 bg-[#415a77] rounded mb-6" />
        <div class="flex items-center justify-center">
          <div class="h-48 w-48 rounded-full bg-[#415a77]/50" />
        </div>
      </div>
      <div class="rounded-lg bg-[#1b263b] p-6">
        <div class="h-5 w-32 bg-[#415a77] rounded mb-4" />
        <div class="space-y-3">
          <div v-for="n in 5" :key="n" class="flex items-center gap-3">
            <div class="h-8 w-8 rounded-full bg-[#415a77]" />
            <div class="flex-1 space-y-1">
              <div class="h-4 w-24 bg-[#415a77] rounded" />
              <div class="h-2 w-full bg-[#415a77] rounded" />
            </div>
            <div class="h-4 w-16 bg-[#415a77] rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
