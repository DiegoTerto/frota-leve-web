import api from "@/lib/axios-config";

export function getAll(page: number, size: number = 10) {
  return api.get('/api/race', {
    params: {
      page: page - 1, size
    }
  })
}