import { defineStore } from 'pinia'

interface Post {
  id: number
  title: string
  body: string
  date: string
}

export const useStore = defineStore('main', {
  state: () => ({
    currentPage: 1,
    postsPerPage: 10,
    posts: [] as Post[],
    isModalOpen: false,
    selectedPost: null,
    comments: [],
    searchTerm: ''
  }),
  getters: {
    totalPages(state) {
      return Math.ceil(state.posts.length / state.postsPerPage)
    },
    paginatedPosts(state) {
      const start = (state.currentPage - 1) * state.postsPerPage
      const end = start + state.postsPerPage
      return state.posts.slice(start, end)
    },
    filteredPosts(state) {
      if (!state.searchTerm) return state.posts
      return state.posts.filter((post) =>
        (post as { title: string }).title.toLowerCase().includes(state.searchTerm.toLowerCase())
      )
    }
  },
  actions: {
    setPosts(posts: Post[]) {
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
    },
    setSearchTerm(term: string) {
      this.searchTerm = term
    }
  }
})
