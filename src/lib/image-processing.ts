export async function processImage(imageData: string) {
  try {
    // Remove the data URL prefix to get just the base64 data
    const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, '');
    const binaryData = atob(base64Data);
    const bytes = new Uint8Array(binaryData.length);
    
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }

    const response = await fetch(
      // https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning
      "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
      {
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: bytes,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to process image');
    }

    const result = await response.json();
    return result[0]?.generated_text || 'Unable to generate description';
  } catch (error) {
    console.error('Error processing image:', error);
    return 'Sorry, there was an error processing the image. Please try again.';
  }
}
