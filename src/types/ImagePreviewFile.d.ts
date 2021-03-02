interface ImagePreviewFile extends File {
  preview: string;
  progress: number;
  isError: boolean;
  uploadUrl?: string;
}