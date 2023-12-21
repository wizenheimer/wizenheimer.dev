import { GitHubRepo } from "@/services/github";
import Link from "next/link";
import { Star } from "lucide-react";

type Props = {
	project: GitHubRepo;
};

export const Article: React.FC<Props> = ({ project }) => {
	return (
		<Link href={`/projects/${project.name}`}>
			<article className="p-4 md:p-8">
				<div className="flex justify-between gap-2 items-center">
					<span className="text-xs duration-1000 text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange">
						{project.created_at ? (
							<time
								dateTime={new Date(
									project.created_at
								).toISOString()}
							>
								{Intl.DateTimeFormat(undefined, {
									dateStyle: "medium",
								}).format(new Date(project.created_at))}
							</time>
						) : (
							<span>SOON</span>
						)}
					</span>
					<span className="text-zinc-500 text-xs  flex items-center gap-1">
						<Star className="w-4 h-4" />{" "}
						{Intl.NumberFormat("en-US", {
							notation: "compact",
						}).format(project.stargazers_count)}
					</span>
				</div>
				<h2 className="z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200 group-hover:text-white font-display">
					{project.name}
				</h2>
				<p className="z-20 mt-4 text-sm  duration-1000 text-zinc-400 group-hover:text-zinc-200">
					{project.description}
				</p>
			</article>
		</Link>
	);
};
