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
  name: string
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
                        <div class="w-full justify-between items-center inline-flex">
                          <div class="justify-start items-center gap-4 flex">
                            <div class="justify-start items-center gap-1.5 flex">
                              <a href="">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M7.04962 9.99504L7 10M12 10L11.9504 10.005M17 10L16.9504 10.005M10.5 3H13.5C16.7875 3 18.4312 3 19.5376 3.90796C19.7401 4.07418 19.9258 4.25989 20.092 4.46243C21 5.56878 21 7.21252 21 10.5V12.4777C21 13.8941 21 14.6023 20.8226 15.1779C20.4329 16.4427 19.4427 17.4329 18.1779 17.8226C17.6023 18 16.8941 18 15.4777 18C15.0811 18 14.8828 18 14.6985 18.0349C14.2966 18.1109 13.9277 18.3083 13.6415 18.6005C13.5103 18.7345 13.4003 18.8995 13.1803 19.2295L13.1116 19.3326C12.779 19.8316 12.6126 20.081 12.409 20.198C12.1334 20.3564 11.7988 20.3743 11.5079 20.2462C11.2929 20.1515 11.101 19.9212 10.7171 19.4605L10.2896 18.9475C10.1037 18.7244 10.0108 18.6129 9.90791 18.5195C9.61025 18.2492 9.23801 18.0748 8.83977 18.0192C8.70218 18 8.55699 18 8.26662 18C7.08889 18 6.50002 18 6.01542 17.8769C4.59398 17.5159 3.48406 16.406 3.12307 14.9846C3 14.5 3 13.9111 3 12.7334V10.5C3 7.21252 3 5.56878 3.90796 4.46243C4.07418 4.25989 4.25989 4.07418 4.46243 3.90796C5.56878 3 7.21252 3 10.5 3Z"
                                    stroke="black"
                                    stroke-width="1.6"
                                    stroke-linecap="round"
                                  />
                                </svg>
                              </a>
                              <h5 class="text-gray-900 text-sm font-normal leading-snug">
                                2 Replies
                              </h5>
                            </div>
                            <div class="justify-start items-center gap-1.5 flex">
                              <a href="">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M16 14C16 15.6569 14 17 12 17C10 17 8 15.6569 8 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM10 9C10 9.55228 9.55228 10 9 10C8.44772 10 8 9.55228 8 9C8 8.44772 8.44772 8 9 8C9.55228 8 10 8.44772 10 9ZM16 9C16 9.55228 15.5523 10 15 10C14.4477 10 14 9.55228 14 9C14 8.44772 14.4477 8 15 8C15.5523 8 16 8.44772 16 9Z"
                                    stroke="#111827"
                                    stroke-width="1.6"
                                    stroke-linecap="round"
                                  />
                                </svg>
                              </a>
                              <h5 class="text-gray-900 text-sm font-normal leading-snug">
                                Reactions
                              </h5>
                            </div>
                          </div>
                          <div class="justify-end items-center gap-1 flex">
                            <h5 class="text-gray-500 text-sm font-normal leading-snug">30</h5>
                            <div class="justify-start items-start flex -space-x-2 overflow-hidden">
                              <div
                                class="p-1.5 ring-1 ring-white bg-gray-100 rounded-full border border-white justify-center items-center flex"
                              >
                                <img
                                  class="w-3 h-3"
                                  src="https://pagedone.io/asset/uploads/1716545141.png"
                                  alt="Thumbs Up emoji"
                                />
                              </div>
                              <div
                                class="p-1.5 ring-1 ring-white bg-gray-100 rounded-full border border-white justify-center items-center flex"
                              >
                                <img
                                  class="w-3 h-3"
                                  src="https://pagedone.io/asset/uploads/1716545183.png"
                                  alt="Smiling eyes emoji"
                                />
                              </div>
                              <div
                                class="p-1.5 ring-1 ring-white bg-gray-100 rounded-full border border-white justify-center items-center flex"
                              >
                                <img
                                  class="w-3 h-3"
                                  src="https://pagedone.io/asset/uploads/1716545217.png"
                                  alt="hugging face emoji"
                                />
                              </div>
                            </div>
                          </div>
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
