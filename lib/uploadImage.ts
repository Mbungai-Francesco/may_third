import cloudinary from "./cloudinary";

export async function uploadImageToCloud(
	file: Buffer,
	folder = "wishes",
): Promise<string> {
	return new Promise((resolve, reject) => {
		cloudinary.uploader
			.upload_stream({ folder }, (error, result) => {
				if (error || !result) return reject(error);
				resolve(result.secure_url);
			})
			.end(file);
	});
}
