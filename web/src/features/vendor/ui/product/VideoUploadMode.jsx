import { useEffect, useState } from "react";
import { UploadCloud, Video, X, Trash2, ExternalLink } from "lucide-react";
import Modal from "../../../../components/ui/Modal";
import {
  uploadProductVideoApi,
  // deleteProductVideoApi,
} from "../../../../api/product.api";
import sendApiRequest from "../../../../utils/sendApiRequest";
import { dismissToast, showSuccess } from "../../../../utils/toast";

const VideoUploadModal = ({ open, onClose, product }) => {
  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setVideos(product.videos || []);
      setVideo(null);
    }
  }, [product]);

  if (!open || !product) return null;

  const handleVideoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please select a valid video.");
      return;
    }

    setVideo(file);
  };

  const handleUpload = async () => {
    if (!video || uploading) return;

    setUploading(true);

    const response = await sendApiRequest(() =>
      uploadProductVideoApi(product._id, video),
    );

    setUploading(false);

    if (!response) return;

    dismissToast();
    showSuccess("Video uploaded successfully.");

    if (response.data?.videos) {
      setVideos(response.data.videos);
    } else if (response.data?.product?.videos) {
      setVideos(response.data.product.videos);
    }

    setVideo(null);
  };

  // Connect your delete API here later
  const handleDelete = async (videoUrl) => {
    /*
    const response = await sendApiRequest(() =>
      deleteProductVideoApi(product._id, videoUrl)
    );

    if (!response) return;

    dismissToast();
    showSuccess("Video deleted successfully");

    setVideos(videos.filter((v) => v !== videoUrl));
    */

    // Temporary UI update
    setVideos((prev) => prev.filter((v) => v !== videoUrl));
  };

  return (
    <Modal title="Upload Product Video" onClose={onClose} maxWidth="max-w-lg">
      <div className="space-y-6">
        {/* Product */}
        <div className="flex items-center gap-3">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-14 h-14 rounded-xl object-cover"
          />

          <div>
            <p className="font-semibold">{product.name}</p>
            <p className="text-xs text-gray-500">{videos.length} Video(s)</p>
          </div>
        </div>

        {/* Existing Videos */}
        <div>
          <h4 className="font-medium mb-3">Uploaded Videos</h4>

          {videos.length === 0 ? (
            <p className="text-sm text-gray-500">No videos uploaded yet.</p>
          ) : (
            <div className="space-y-2">
              {videos.map((videoUrl, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-primary" />

                    <span className="text-sm">Video {index + 1}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-200 rounded-lg"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => handleDelete(videoUrl)}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload */}
        <label className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center cursor-pointer hover:border-primary transition">
          <UploadCloud className="w-10 h-10 text-primary mb-2" />

          <p className="font-medium">Choose a video</p>

          <p className="text-xs text-gray-500">MP4, MOV, AVI</p>

          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleVideoChange}
          />
        </label>

        {/* Selected File */}
        {video && (
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
            <div className="flex items-center gap-3">
              <Video className="w-5 h-5 text-primary" />

              <div>
                <p className="text-sm font-medium">{video.name}</p>

                <p className="text-xs text-gray-500">
                  {(video.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button onClick={() => setVideo(null)}>
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">
            Cancel
          </button>

          <button
            disabled={!video || uploading}
            onClick={handleUpload}
            className="px-5 py-2 rounded-lg bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading Video..." : "Upload"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default VideoUploadModal;
