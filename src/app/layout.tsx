import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	metadataBase: new URL("https://wizenheimer.dev"),
	title: {
		default: "wizenheimer.dev",
		template: "%s | wizenheimer.dev",
	},
	description: "Co-founder of cyyrus.com and founder of byyrd.co",
	openGraph: {
		title: "wizenheimer.dev",
		description: "Co-founder of cyyrus.com and founder of byyrd.co",
		url: "https://wizenheimer.dev",
		siteName: "wizenheimer.dev",
		images: [
			{
				url: "./favicon.ico",
				width: 1920,
				height: 1080,
			},
		],
		locale: "en-US",
		type: "website",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	twitter: {
		title: "wizenheimer",
		card: "summary_large_image",
	},
	icons: {
		shortcut: "./favicon.ico",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={inter.className}>
			<head></head>
			<body
				className={`bg-black ${
					process.env.NODE_ENV === "development"
						? "debug-screens"
						: undefined
				}`}
			>
				{children}
			</body>
		</html>
	);
}
