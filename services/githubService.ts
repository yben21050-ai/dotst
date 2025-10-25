
interface GitHubUploadOptions {
  token: string;
  repo: string; // e.g., 'username/repo-name'
  path: string; // e.g., 'path/to/file.json'
  message: string;
  content: string;
}

/**
 * Uploads a file to a GitHub repository.
 * NOTE: This function makes direct API calls from the client and includes the Personal Access Token.
 * This is INSECURE for a production application. In a real-world scenario, this logic
 * should be handled by a secure backend proxy service that manages the API token.
 */
export const uploadToGitHub = async (options: GitHubUploadOptions): Promise<void> => {
  const { token, repo, path, message, content } = options;
  const url = `https://api.github.com/repos/${repo}/contents/${path}`;

  // Base64 encode the file content
  const encodedContent = btoa(unescape(encodeURIComponent(content)));

  const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
  };

  try {
    // First, try to get the file to see if it exists and get its SHA
    let sha: string | undefined;
    try {
        const getResponse = await fetch(url, { headers });
        if (getResponse.ok) {
            const fileData = await getResponse.json();
            sha = fileData.sha;
        }
    } catch (e) {
        // File likely doesn't exist, which is fine. We'll create it.
    }
    
    // Create or update the file
    const putResponse = await fetch(url, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        content: encodedContent,
        sha, // Include SHA if updating an existing file
      }),
    });

    if (!putResponse.ok) {
      const errorData = await putResponse.json();
      throw new Error(`GitHub API Error: ${errorData.message || 'Failed to upload file.'}`);
    }

  } catch (error) {
    console.error('Error uploading to GitHub:', error);
    throw error;
  }
};
