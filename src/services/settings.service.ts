import { api } from './api';

export interface SiteVideo {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
}

export interface SiteSettings {
  announcementText: string;
  moodImages: Record<string, string>;
  videos: SiteVideo[];
}

interface RawVideo {
  _id: string;
  title: string;
  url: string;
  thumbnail: string;
}

interface RawSettings {
  announcementText: string;
  moodImages: Record<string, string>;
  videos: RawVideo[];
}

const mapSettings = (s: RawSettings): SiteSettings => ({
  announcementText: s.announcementText,
  moodImages: s.moodImages || {},
  videos: (s.videos || []).map((v) => ({ id: v._id, title: v.title, url: v.url, thumbnail: v.thumbnail })),
});

export const settingsService = {
  async getSettings(): Promise<SiteSettings> {
    const { data } = await api.get('/settings');
    return mapSettings(data.settings);
  },

  async updateAnnouncement(announcementText: string): Promise<SiteSettings> {
    const { data } = await api.patch('/settings/announcement', { announcementText });
    return mapSettings(data.settings);
  },

  async updateMoodImage(moodKey: string, file: File): Promise<SiteSettings> {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await api.patch(`/settings/mood-image/${moodKey}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return mapSettings(data.settings);
  },

  async uploadVideo(file: File, title: string): Promise<SiteSettings> {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    const { data } = await api.post('/settings/videos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return mapSettings(data.settings);
  },

  async deleteVideo(videoId: string): Promise<SiteSettings> {
    const { data } = await api.delete(`/settings/videos/${videoId}`);
    return mapSettings(data.settings);
  },
};
