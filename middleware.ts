import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Function to get config values with fallbacks (since we can't import client-side config in middleware)
function getConfigValue(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

// Import the ASCII art from animation.tsx
const FULL_ASCII = `
██╗    ██╗██╗███████╗███████╗███╗   ██╗██╗  ██╗███████╗██╗███╗   ███╗███████╗██████╗ 
██║    ██║██║╚══███╔╝██╔════╝████╗  ██║██║  ██║██╔════╝██║████╗ ████║██╔════╝██╔══██╗
██║ █╗ ██║██║  ███╔╝ █████╗  ██╔██╗ ██║███████║█████╗  ██║██╔████╔██║█████╗  ██████╔╝
██║███╗██║██║ ███╔╝  ██╔══╝  ██║╚██╗██║██╔══██║██╔══╝  ██║██║╚██╔╝██║██╔══╝  ██╔══██╗
╚███╔███╔╝██║███████╗███████╗██║ ╚████║██║  ██║███████╗██║██║ ╚═╝ ██║███████╗██║  ██║
 ╚══╝╚══╝ ╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝
                                                                                     
`;

function generateFullContent(): string {
  const heroTitle = getConfigValue(
    "NEXT_PUBLIC_HERO_TITLE",
    "your favourite engineer's favourite engineer"
  );
  const heroDescription = getConfigValue(
    "NEXT_PUBLIC_HERO_DESCRIPTION",
    "my tiny corner on the internet"
  );
  const websiteUrl = getConfigValue(
    "NEXT_PUBLIC_WEBSITE_URL",
    "https://wizenheimer.dev"
  );
  const twitterUrl = getConfigValue(
    "NEXT_PUBLIC_TWITTER_URL",
    "https://x.com/0xNayan"
  );
  const githubUrl = getConfigValue(
    "NEXT_PUBLIC_GITHUB_URL",
    "https://github.com/wizenheimer"
  );
  const email = getConfigValue("NEXT_PUBLIC_EMAIL", "xnayankumar@gmail.com");
  const authorName = getConfigValue("NEXT_PUBLIC_AUTHOR_NAME", "Nayan Kumar");

  return `${FULL_ASCII}

${heroTitle.toUpperCase()}
${"-".repeat(heroTitle.length)}
${heroDescription}

CURRENTLY
---------
* software engineer at couchbase (ai r&d core)
* building subsignal - helping VCs track and reconnect with startups they passed on

LINKS
-----
[W] Website : ${websiteUrl}
[T] Twitter : ${twitterUrl}
[G] GitHub  : ${githubUrl}
[E] Email   : ${email}

Made with ♥ by ${authorName}

`;
}

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";

  // Handle curl requests for both apex and www domains
  if (userAgent.toLowerCase().includes("curl")) {
    // Return the ASCII content directly for both domains
    return new NextResponse(generateFullContent(), {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  // For non-curl requests, proceed with normal routing
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
