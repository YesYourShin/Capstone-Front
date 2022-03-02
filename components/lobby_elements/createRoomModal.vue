<template lang="">
  <div class="w-full">
    <div class="grid grid-cols-6 gap-6">
      <div class="col-span-3">
        <label class="block text-sm font-medium text-gray-700" for="room-name"
          >방 제목</label
        >
        <input
          class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          type="text"
          name="room-name"
          placeholder="방 제목을 입력하세요"
        />
      </div>
      <div class="col-span-3">
        <label class="block text-sm font-medium text-gray-700" for="room-name"
          >비밀번호</label
        >
        <input
          class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          type="password"
          name="password"
        />
      </div>
      <div class="col-span-3">
        <label class="block text-sm font-medium text-gray-700" for="mode"
          >모드</label
        >
        <select
          class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          name="mode"
          id="mode"
        >
          <option value="normal">일반 모드</option>
          <option value="extended">확장 모드</option>
        </select>
      </div>
      <div class="col-span-3">
        <label class="block text-sm font-medium text-gray-700" for="max-player"
          >인원 수</label
        >
        <select
          class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          name="max-player"
          id="max-player"
        >
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang=""></style>
