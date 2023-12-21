// Define interfaces for GitHub API response and repository information
export interface GitHubRepo {
	name: string;
	description: string;
	stargazers_count: number;
	created_at: number;
	svn_url: string;
	homepage: string;
}

// Define the GitHub API URL
const githubApiUrl = "https://api.github.com/users/wizenheimer/repos";

// Function to fetch and process repositories
const fetchRepos = async (): Promise<GitHubRepo[]> => {
	// Make a GET request to the GitHub API
	const response = await fetch(githubApiUrl, { next: { revalidate: 3600 } });
	// const response = await fetch(githubApiUrl, { cache: "no-store" });

	// Check if the request was successful
	if (!response.ok) {
		throw new Error(
			`GitHub API request failed: ${response.status} ${response.statusText}`
		);
	}

	// Parse the JSON response
	const data: GitHubRepo[] = await response.json();

	return data;
};

// Call the fetchRepos function
export default fetchRepos();
