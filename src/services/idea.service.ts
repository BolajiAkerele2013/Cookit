import api from './api';

export interface Idea {
  id: string;
  name: string;
  description: string;
  problemCategory: string;
  solution: string;
  visibility: 'public' | 'private';
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  userRole: string;
  equityPercentage?: number;
  debtAmount?: number;
}

export const ideaService = {
  async createIdea(data: {
    name: string;
    description: string;
    problemCategory: string;
    solution: string;
    visibility: 'public' | 'private';
  }): Promise<Idea> {
    try {
      const response = await api.post<Idea>('/api/ideas', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.error || 'Failed to create idea');
    }
  },

  async getUserIdeas(): Promise<Idea[]> {
    try {
      const response = await api.get<Idea[]>('/api/ideas');
      return response.data;
    } catch (error: any) {
      throw new Error(error?.error || 'Failed to fetch ideas');
    }
  },

  async getIdea(id: string): Promise<Idea> {
    try {
      const response = await api.get<Idea>(`/api/ideas/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.error || 'Failed to fetch idea');
    }
  },

  async updateIdea(id: string, data: Partial<Idea>): Promise<Idea> {
    try {
      const response = await api.put<Idea>(`/api/ideas/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.error || 'Failed to update idea');
    }
  }
};
