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
            v-for="post in store.filteredPosts.slice(
              (store.currentPage - 1) * store.postsPerPage,
              store.currentPage * store.postsPerPage
            )"
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
      class="fixed inset-0 z-9999 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto"
      >
        <div class="mb-4">
          <section class="relative">
            <div class="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
              <div class="w-full flex-col justify-start items-start gap-6 inline-flex">
                <div class="flex justify-between items-center">
                  <h4 class="text-2xl font-semibold text-gray-900 dark:text-black">
                    {{ selectedPost?.title }}
                  </h4>
                </div>
                <p class="text-gray-700 dark:text-black">{{ selectedPost?.body }}</p>

                <div class="w-full flex-col justify-start items-start lg:gap-9 gap-6 flex">
                  <div class="w-full relative flex justify-between gap-2">
                    <input
                      type="text"
                      class="w-full py-3 px-5 rounded-lg border border-gray-300 bg-white shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed"
                      placeholder="Write comments here...."
                    />
                    <a href="" class="absolute right-6 top-[18px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M11.3011 8.69906L8.17808 11.8221M8.62402 12.5909L8.79264 12.8821C10.3882 15.638 11.1859 17.016 12.2575 16.9068C13.3291 16.7977 13.8326 15.2871 14.8397 12.2661L16.2842 7.93238C17.2041 5.17273 17.6641 3.79291 16.9357 3.06455C16.2073 2.33619 14.8275 2.79613 12.0679 3.71601L7.73416 5.16058C4.71311 6.16759 3.20259 6.6711 3.09342 7.7427C2.98425 8.81431 4.36221 9.61207 7.11813 11.2076L7.40938 11.3762C7.79182 11.5976 7.98303 11.7083 8.13747 11.8628C8.29191 12.0172 8.40261 12.2084 8.62402 12.5909Z"
                          stroke="#111827"
                          stroke-width="1.6"
                          stroke-linecap="round"
                        />
                      </svg>
                    </a>
                  </div>
                  <div class="w-full flex-col justify-start items-start gap-8 flex">
                    <div
                      v-for="comment in comments"
                      :key="comment.id"
                      class="w-full flex-col justify-start items-end gap-5 flex"
                    >
                      <div
                        class="w-full p-6 bg-white rounded-2xl border border-gray-200 flex-col justify-start items-start gap-8 flex"
                      >
                        <div class="w-full flex-col justify-center items-start gap-3.5 flex">
                          <div class="w-full justify-between items-center inline-flex">
                            <div class="justify-start items-center gap-2.5 flex">
                              <div
                                class="w-10 h-10 bg-gray-300 rounded-full justify-start items-start gap-2.5 flex"
                              >
                                <img
                                  class="rounded-full object-cover"
                                  src="https://pagedone.io/asset/uploads/1714988283.png"
                                  alt="Jenny wilson image"
                                />
                              </div>
                              <div class="flex-col justify-start items-start gap-1 inline-flex">
                                <h5 class="text-gray-900 text-sm font-semibold leading-snug">
                                  {{ comment.name }}
                                </h5>
                                <h6 class="text-gray-500 text-xs font-normal leading-5">
                                  1 hr ago
                                </h6>
                              </div>
                            </div>
                            <div class="w-6 h-6 relative">
                              <div class="w-full h-fit flex">
                                <div class="relative w-full">
                                  <div
                                    class="absolute left-0 top-0 py-2.5 px-4 text-gray-300"
                                  ></div>
                                  <button
                                    id="dropdown-button"
                                    data-target="dropdown-1"
                                    class="w-full justify-center dropdown-toggle flex-shrink-0 z-10 flex items-center text-base font-medium text-center text-gray-900 bg-transparent absolute right-0 top-0"
                                    type="button"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                    >
                                      <path
                                        d="M12.0161 16.9893V17.0393M12.0161 11.9756V12.0256M12.0161 6.96191V7.01191"
                                        stroke="black"
                                        stroke-width="2.5"
                                        stroke-linecap="round"
                                      />
                                    </svg>
                                  </button>
                                  <div
                                    id="dropdown-1"
                                    class="absolute top-10 right-0 z-20 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 open hidden"
                                  >
                                    <ul
                                      class="py-2 text-sm text-gray-700 dark:text-gray-200"
                                      aria-labelledby="dropdown-button"
                                    >
                                      <li>
                                        <a
                                          href="#"
                                          class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                          >Edit</a
                                        >
                                      </li>
                                      <li>
                                        <a
                                          href="#"
                                          class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                          >Save</a
                                        >
                                      </li>
                                      <li>
                                        <a
                                          href="#"
                                          class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                          >Delete</a
                                        >
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p class="text-gray-800 text-sm font-normal leading-snug">
                            {{ comment.body }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
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
