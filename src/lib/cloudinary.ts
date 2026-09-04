async function generateSignature(params: Record<string, string>, apiSecret: string) {
  const sortedKeys = Object.keys(params).sort();
  const queryToSign = sortedKeys.map((key) => `${key}=${params[key]}`).join('&');
  const stringToSign = queryToSign + apiSecret;

  const encoder = new TextEncoder();
  const data = encoder.encode(stringToSign);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

function getCloudinaryConfig() {
  const cloudName = import.meta.env.CLOUDINARY_NAME || process.env.CLOUDINARY_NAME;
  const apiKey = import.meta.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY;
  const apiSecret = import.meta.env.CLOUDINARY_SECRET || process.env.CLOUDINARY_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing Cloudinary configuration");
  }

  return { cloudName, apiKey, apiSecret };
}

/**
 * Generate signed params for client-side direct upload to Cloudinary.
 * Client uses these params to POST directly to Cloudinary upload API.
 * No file bytes pass through our server.
 */
export async function generateSignedUploadParams(folder: string) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const fullFolder = `umkm-builder/${folder}`;

  const params: Record<string, string> = {
    folder: fullFolder,
    timestamp,
  };

  const signature = await generateSignature(params, apiSecret);

  return {
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder: fullFolder,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  };
}

export async function uploadToCloudinary(file: File, folder: string) {
  try {
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Format gambar harus PNG, JPG, JPEG, atau WEBP");
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("Ukuran gambar maksimal 10MB");
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const params: Record<string, string> = {
      folder: `umkm-builder/${folder}`,
      timestamp,
      transformation: "c_limit,h_1080,w_1920",
    };

    const signature = await generateSignature(params, apiSecret);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", params.folder);
    formData.append("transformation", params.transformation);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Cloudinary upload failed: ${errorText}`);
    }

    const result = await res.json();
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      version: result.version,
    };
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error(
      "CLOUDINARY_UPLOAD_PROCESS_FAILED:",
      error instanceof Error ? error.message : error,
    );
    throw new Error(`IMAGE_PROCESSING_FAILED: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
  }
}

export async function deleteFromCloudinary(publicId: string) {
  try {
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const params = {
      public_id: publicId,
      timestamp,
    };
    const signature = await generateSignature(params, apiSecret);
    
    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Cloudinary delete failed: ${errorText}`);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("CLOUDINARY_DELETE_ERROR", error);
  }
}
