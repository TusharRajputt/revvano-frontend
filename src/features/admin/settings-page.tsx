import { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Upload, Trash2, Play } from 'lucide-react';
import { settingsService } from '@/services';
import { MOOD_LIST } from '@/constants';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: settingsService.getSettings,
  });

  const [announcementText, setAnnouncementText] = useState('');
  const [savingAnnouncement, setSavingAnnouncement] = useState(false);
  const [uploadingMood, setUploadingMood] = useState<string | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Sync local textarea state once settings load (only the first time)
  const [initialized, setInitialized] = useState(false);
  if (settings && !initialized) {
    setAnnouncementText(settings.announcementText);
    setInitialized(true);
  }

  const refreshSettings = (updated: Awaited<ReturnType<typeof settingsService.getSettings>>) => {
    queryClient.setQueryData(['site-settings'], updated);
  };

  const handleSaveAnnouncement = async () => {
    if (!announcementText.trim()) {
      toast({ title: 'Announcement text cannot be empty', variant: 'destructive' });
      return;
    }
    setSavingAnnouncement(true);
    try {
      const updated = await settingsService.updateAnnouncement(announcementText);
      refreshSettings(updated);
      toast({ title: 'Announcement banner updated' });
    } catch {
      toast({ title: 'Could not update announcement', variant: 'destructive' });
    } finally {
      setSavingAnnouncement(false);
    }
  };

  const handleMoodImageChange = async (moodKey: string, file: File | undefined) => {
    if (!file) return;
    setUploadingMood(moodKey);
    try {
      const updated = await settingsService.updateMoodImage(moodKey, file);
      refreshSettings(updated);
      toast({ title: 'Mood image updated' });
    } catch {
      toast({ title: 'Could not upload image', variant: 'destructive' });
    } finally {
      setUploadingMood(null);
    }
  };

  const handleVideoUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploadingVideo(true);
    try {
      const updated = await settingsService.uploadVideo(file, videoTitle);
      refreshSettings(updated);
      setVideoTitle('');
      if (videoInputRef.current) videoInputRef.current.value = '';
      toast({ title: 'Video uploaded' });
    } catch {
      toast({ title: 'Could not upload video. Check file size/format.', variant: 'destructive' });
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      const updated = await settingsService.deleteVideo(videoId);
      refreshSettings(updated);
      toast({ title: 'Video removed' });
    } catch {
      toast({ title: 'Could not remove video', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading settings...</div>;
  }

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h1 className="font-heading text-3xl mb-1">Site Settings</h1>
        <p className="text-sm text-muted-foreground">Manage what customers see on your homepage.</p>
      </div>

      {/* Announcement banner */}
      <section className="border border-border p-6">
        <h2 className="font-medium mb-1">Announcement Banner</h2>
        <p className="text-xs text-muted-foreground mb-4">
          The scrolling text bar at the very top of every page.
        </p>
        <textarea
          value={announcementText}
          onChange={(e) => setAnnouncementText(e.target.value)}
          rows={2}
          className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-accent"
          placeholder="Complimentary shipping on orders over ₹4,999 — Wear Your Mood."
        />
        <Button onClick={handleSaveAnnouncement} disabled={savingAnnouncement} className="mt-3">
          {savingAnnouncement ? 'Saving...' : 'Save Banner'}
        </Button>
      </section>

      {/* Mood images */}
      <section className="border border-border p-6">
        <h2 className="font-medium mb-1">Homepage Mood Images</h2>
        <p className="text-xs text-muted-foreground mb-4">
          The 4 photos shown in the "Shop by Mood" section on your homepage.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {MOOD_LIST.map((mood) => {
            const currentImage = settings?.moodImages?.[mood.key] || mood.image;
            return (
              <div key={mood.key} className="space-y-2">
                <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                  <img src={currentImage} alt={mood.label} className="w-full h-full object-cover" />
                  {uploadingMood === mood.key && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs">
                      Uploading...
                    </div>
                  )}
                </div>
                <p className="text-xs font-medium text-center">{mood.label}</p>
                <label className="flex items-center justify-center gap-1.5 text-xs border border-border py-1.5 cursor-pointer hover:bg-muted transition-colors">
                  <Upload className="h-3 w-3" /> Change
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleMoodImageChange(mood.key, e.target.files?.[0])}
                  />
                </label>
              </div>
            );
          })}
        </div>
      </section>

      {/* Videos / Reels */}
      <section className="border border-border p-6">
        <h2 className="font-medium mb-1">Homepage Reels & Videos</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Short videos shown in a "Reels & Reveals" section on your homepage. This section only appears once you've uploaded at least one video.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            placeholder="Video title (optional)"
            className="flex-1 border border-border px-3 py-2 text-sm focus:outline-none focus:border-accent"
          />
          <label className="flex items-center justify-center gap-1.5 text-sm border border-border px-4 py-2 cursor-pointer hover:bg-muted transition-colors whitespace-nowrap">
            <Upload className="h-4 w-4" /> {uploadingVideo ? 'Uploading...' : 'Upload Video'}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              className="hidden"
              disabled={uploadingVideo}
              onChange={(e) => handleVideoUpload(e.target.files?.[0])}
            />
          </label>
        </div>

        {settings && settings.videos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {settings.videos.map((video) => (
              <div key={video.id} className="space-y-2">
                <div className="relative aspect-[9/16] bg-black overflow-hidden flex items-center justify-center">
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <Play className="h-6 w-6 text-white/50" />
                  )}
                </div>
                <p className="text-xs truncate">{video.title || 'Untitled'}</p>
                <button
                  onClick={() => handleDeleteVideo(video.id)}
                  className="flex items-center justify-center gap-1.5 text-xs border border-destructive text-destructive py-1.5 w-full hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-3 w-3" /> Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No videos uploaded yet.</p>
        )}
      </section>
    </div>
  );
}
