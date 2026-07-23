<template>
  <div class="animate-pulse">
    <div class="h-8 w-56 bg-[#415a77] rounded mb-6" />

    <div class="bg-[#1b263b] rounded-lg p-4 sm:p-6 mb-6">
      <div class="h-4 w-28 bg-[#415a77] rounded mb-3" />
      <div class="h-14 w-full bg-[#415a77]/50 rounded-lg" />
    </div>

    <div class="bg-[#1b263b] rounded-lg p-4 sm:p-6 mb-6">
      <div class="h-4 w-32 bg-[#415a77] rounded mb-6" />
      <div class="space-y-4">
        <div v-for="n in 3" :key="n" class="space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="h-6 w-6 rounded-full bg-[#415a77]" />
              <div class="h-5 w-24 bg-[#415a77] rounded" />
            </div>
            <div class="h-5 w-20 bg-[#415a77] rounded" />
          </div>
          <div class="grid grid-cols-2 gap-4 ml-8 pb-4 border-b border-[#415a77]/30 last:border-0 last:pb-0">
            <div>
              <div class="h-3 w-20 bg-[#415a77] rounded mb-1" />
              <div class="h-4 w-24 bg-[#415a77] rounded" />
            </div>
            <div>
              <div class="h-3 w-20 bg-[#415a77] rounded mb-1" />
              <div class="h-4 w-24 bg-[#415a77] rounded" />
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 pt-4 border-t border-[#415a77]/30 space-y-2">
        <div class="flex justify-between">
          <div class="h-4 w-24 bg-[#415a77] rounded" />
          <div class="h-4 w-20 bg-[#415a77] rounded" />
        </div>
        <div class="flex justify-between">
          <div class="h-4 w-24 bg-[#415a77] rounded" />
          <div class="h-4 w-20 bg-[#415a77] rounded" />
        </div>
      </div>
    </div>

    <div class="bg-[#1b263b] rounded-lg p-4 sm:p-6">
      <div class="h-4 w-36 bg-[#415a77] rounded mb-4" />
      <div class="space-y-2">
        <div v-for="n in 5" :key="n" class="flex items-center justify-between p-3 rounded-lg bg-[#1b263b]/50">
          <div class="flex items-center gap-3">
            <div class="h-6 w-6 rounded-full bg-[#415a77]" />
            <div class="space-y-1">
              <div class="h-4 w-20 bg-[#415a77] rounded" />
              <div class="h-3 w-28 bg-[#415a77] rounded" />
            </div>
          </div>
          <div class="text-right space-y-1">
            <div class="h-4 w-16 bg-[#415a77] rounded" />
            <div class="h-3 w-12 bg-[#415a77] rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
