import Link from "next/link";
import { Star } from "lucide-react";
import { Teardown } from "./page";

type Props = {
	teardown: Teardown;
};

export const TeardownDetailView: React.FC<Props> = ({ teardown }) => {
	return (
		<Link href={`${teardown.url}`}>
			<article className="p-4 md:p-8">
				<div className="flex justify-between gap-2 items-center">
					<span className="text-xs duration-1000 text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange">
						{teardown.vertical ? (
							<span>{teardown.vertical}</span>
						) : (
							<span>diverse</span>
						)}
					</span>
					<span className="text-zinc-500 text-xs  flex items-center gap-1">
						<Star className="w-4 h-4" />{" "}
						{Intl.NumberFormat("en-US", {
							notation: "compact",
						}).format(teardown.stars)}
					</span>
				</div>
				<h2 className="z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200 group-hover:text-white font-display">
					{teardown.company}
				</h2>
				<p className="z-20 mt-4 text-sm  duration-1000 text-zinc-400 group-hover:text-zinc-200">
					{teardown.title}
				</p>
			</article>
		</Link>
	);
};
