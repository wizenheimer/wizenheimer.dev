import { notFound } from "next/navigation";
import fetchRepos from "@/services/github";
import { Header } from "./header";

export const revalidate = 60;

type Props = {
	params: {
		name: string;
	};
};

export async function generateStaticParams(): Promise<Props["params"][]> {
	const allRepos = await fetchRepos;
	const allProjects = allRepos.filter(
		(project) => project.stargazers_count > 0
	);

	return allProjects.map((project) => ({
		name: project.name,
	}));
}

export default async function PostPage({ params }: Props) {
	const name = params?.name;
	const allRepos = await fetchRepos;
	const allProjects = allRepos.filter(
		(project) => project.stargazers_count > 0
	);
	const project = allProjects.find((project) => project.name === name);

	if (!project) {
		notFound();
	}

	const views = 0;

	return (
		<div className="bg-zinc-50 min-h-screen">
			<Header project={project} />
			<article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
				{project.description}
			</article>
		</div>
	);
}
