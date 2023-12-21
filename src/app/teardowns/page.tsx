import React from "react";
import { Navigation } from "@/components/nav";
import { Card } from "@/components/card";
import { TeardownDetailView } from "./teardown";

export interface Teardown {
	title: string;
	company: string;
	vertical: string;
	published: number;
	url: string;
	stars: number;
}

const teardowns: Teardown[] = [
	{
		title: "Geographic Expansion Case Study",
		company: "HyperVerge",
		vertical: "SaaS",
		published: 10.23,
		url: "https://www.canva.com/design/DAFvdiS2S9g/_2XsAlD5ow6Kyaf6YnvcjQ/edit?utm_content=DAFvdiS2S9g&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
		stars: 55,
	},
	{
		title: "Reducing Undercover Rides in Ola",
		company: "Ola",
		vertical: "Ridehailing",
		published: 12.22,
		url: "https://www.canva.com/design/DAFUSqKg1pM/wThuUXg1UqsgLwmbNppiWg/edit?utm_content=DAFUSqKg1pM&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
		stars: 95,
	},
	{
		title: "Increasing AOV",
		company: "Dunzo",
		vertical: "Marketplaces",
		published: 9.22,
		url: "https://www.canva.com/design/DAFN2_PbiQA/dBgBwJOxEaFLUZduMR0awA/edit?utm_content=DAFN2_PbiQA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
		stars: 329,
	},
	{
		title: "Product Integration Case Study",
		company: "ASL",
		vertical: "EdTech",
		published: 10.22,
		url: "https://www.canva.com/design/DAFPgTfD2n8/YpxReE_-dy-Q8s4Kd78tNw/edit?utm_content=DAFPgTfD2n8&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
		stars: 80,
	},
	{
		title: "Margin Expansion",
		company: "Fampay",
		vertical: "Fintech",
		published: 10.22,
		url: "https://www.canva.com/design/DAFOiWbrShc/ADk0dvRuAXmi6b318SebtA/edit?utm_content=DAFOiWbrShc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
		stars: 82,
	},
	{
		title: "Refining Gamification",
		company: "Jupiter",
		vertical: "Fintech",
		published: 9.22,
		url: "https://www.canva.com/design/DAFNQT5LLbc/IoN-2nmMMv4bw-wRBE_qSQ/edit?utm_content=DAFNQT5LLbc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
		stars: 110,
	},
];

export default async function TeardownPage() {
	return (
		<div className="relative pb-16">
			<Navigation />
			<div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
				<div className="max-w-2xl mx-auto lg:mx-0">
					<h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
						Teardowns
					</h2>
					<p className="mt-4 text-zinc-400">
						Case Studies I&apos;ve published over the years
					</p>
				</div>
				<div className="w-full h-px bg-zinc-800" />

				<div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
					<div className="grid grid-cols-1 gap-4">
						{teardowns
							.filter((_, i) => i % 3 === 0)
							.map((teardown) => (
								<Card key={teardown.company}>
									<TeardownDetailView teardown={teardown} />
								</Card>
							))}
					</div>
					<div className="grid grid-cols-1 gap-4">
						{teardowns
							.filter((_, i) => i % 3 === 1)
							.map((teardown) => (
								<Card key={teardown.company}>
									<TeardownDetailView teardown={teardown} />
								</Card>
							))}
					</div>
					<div className="grid grid-cols-1 gap-4">
						{teardowns
							.filter((_, i) => i % 3 === 2)
							.map((teardown) => (
								<Card key={teardown.company}>
									<TeardownDetailView teardown={teardown} />
								</Card>
							))}
					</div>
				</div>
			</div>
		</div>
	);
}
