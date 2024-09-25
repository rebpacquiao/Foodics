<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { getPosts, getPostComment } from '../../services/blog'
import { onMounted, ref } from 'vue'
import { useStore } from '@/stores/store'
const store = useStore()

interface Post {
  id: number
  title: string
  body: string
  date: string
}

const expandedPosts = ref(new Set())
const selectedPost = ref<Post | null>(null)
interface Comment {
  id: number
  body: string
}

const comments = ref<Comment[]>([])
const isModalOpen = ref(false)

const fetchPosts = async () => {
  const response = await getPosts()
  store.setPosts(response)
}

const fetchComments = async (postId: number) => {
  const response = await getPostComment(postId)
  comments.value = response
}

const truncateText = (text: any, length = 100) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

const toggleExpand = (postId: number) => {
  if (expandedPosts.value.has(postId)) {
    expandedPosts.value.delete(postId)
  } else {
    expandedPosts.value.add(postId)
  }
}

const isExpanded = (postId: number) => {
  return expandedPosts.value.has(postId)
}

const openModal = async (post: any) => {
  selectedPost.value = post
  await fetchComments(post.id)
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedPost.value = null
  comments.value = []
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
          <div
            v-for="post in store.paginatedPosts"
            :key="post.id"
            class="group shadow-lg rounded-2xl"
          >
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
                class="text-xl text-black font-medium leading-8 mb-5 truncate overflow-hidden whitespace-nowrap cursor-pointer"
                @click="openModal(post)"
              >
                {{ post.title }}
              </h4>
              <p class="text-gray-500 leading-6 mb-10">
                {{ isExpanded(post.id) ? post.body : truncateText(post.body) }}
              </p>
              <a
                href="javascript:;"
                @click="toggleExpand(post.id)"
                class="cursor-pointer text-sm text-indigo-600 font-semibold"
              >
                {{ isExpanded(post.id) ? 'Show less' : 'Read more..' }}
              </a>
            </div>
          </div>
        </div>
        <div class="flex justify-center mt-8">
          <button
            @click="store.prevPage"
            :disabled="store.currentPage === 1"
            class="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span class="px-4 py-2 mx-1">{{ store.currentPage }} / {{ store.totalPages }}</span>
          <button
            @click="store.nextPage"
            :disabled="store.currentPage === store.totalPages"
            class="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>

    <!-- Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-2xl font-semibold text-gray-900 dark:text-black">
            {{ selectedPost?.title }}
          </h4>
        </div>
        <p class="text-gray-700 dark:text-black mb-4">{{ selectedPost?.body }}</p>
        <div class="mb-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Comments</h4>
          <ul class="list-disc list-inside">
            <li
              v-for="comment in comments"
              :key="comment.id"
              class="text-gray-700 bg-gray dark:text-black"
            >
              {{ comment.body }}
            </li>
          </ul>
        </div>
        <div class="flex justify-end">
          <button
            @click="closeModal"
            class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
