export interface Task {
  id: number
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface TaskFormData {
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
}