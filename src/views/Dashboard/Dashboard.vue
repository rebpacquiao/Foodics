<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { getPosts } from '../../services/blog'
import { onMounted, ref, computed } from 'vue'

const posts = ref([])
const currentPage = ref(1)
const postsPerPage = 10
const expandedPosts = ref(new Set())

const fetchPosts = async () => {
  const response = await getPosts()
  posts.value = response
}

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return posts.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(posts.value.length / postsPerPage)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const truncateText = (text, length = 100) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

const toggleExpand = (postId) => {
  if (expandedPosts.value.has(postId)) {
    expandedPosts.value.delete(postId)
  } else {
    expandedPosts.value.add(postId)
  }
}

const isExpanded = (postId) => {
  return expandedPosts.value.has(postId)
}

onMounted(() => {
  fetchPosts()
})
</script>

<template>
  <DefaultLayout>
    <section class="py-24 bg-white dark:bg-black">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 class="font-manrope text-4xl font-bold text-gray-900 dark:text-white text-center mb-16">
          Our latest blog
        </h2>
        <div class="grid grid-cols-1 gap-y-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
          <div v-for="post in paginatedPosts" :key="post.id" class="group rounded-2xl">
            <div class="flex items-center">
              <img
                src="https://pagedone.io/asset/uploads/1696244356.png"
                class="rounded-t-2xl w-full object-cover"
              />
            </div>
            <div
              class="p-4 lg:p-6 transition-all dark:bg-white duration-300 rounded-b-2xl group-hover:bg-gray-50"
            >
              <span class="text-indigo-600 font-medium mb-3 block">{{ post.date }}</span>
              <h4
                class="text-xl text-gray-900 font-medium leading-8 mb-5 truncate overflow-hidden whitespace-nowrap"
              >
                {{ post.title }}
              </h4>
              <p class="text-gray-500 leading-6 mb-10">
                {{ isExpanded(post.id) ? post.body : truncateText(post.body) }}
              </p>
              <a
                href="javascript:;"
                @click="toggleExpand(post.id)"
                class="cursor-pointer text-lg text-indigo-600 font-semibold"
              >
                {{ isExpanded(post.id) ? 'Show less' : 'Read more..' }}
              </a>
            </div>
          </div>
        </div>
        <div class="flex justify-center mt-8">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span class="px-4 py-2 mx-1">{{ currentPage }} / {{ totalPages }}</span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>
