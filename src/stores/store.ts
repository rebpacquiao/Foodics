import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    currentPage: 1,
    postsPerPage: 10,
    posts: [],
    isModalOpen: false,
    selectedPost: null,
    comments: []
  }),
  getters: {
    totalPages(state) {
      return Math.ceil(state.posts.length / state.postsPerPage)
    },
    paginatedPosts(state) {
      const start = (state.currentPage - 1) * state.postsPerPage
      const end = start + state.postsPerPage
      return state.posts.slice(start, end)
    }
  },
  actions: {
    setPosts(posts) {
      this.posts = posts
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    closeModal() {
      this.isModalOpen = false
    }
  }
})
