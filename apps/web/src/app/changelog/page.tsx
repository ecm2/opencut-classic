import type { Metadata } from "next";
import { BasePage } from "@/app/base-page";
import { Separator } from "@/components/ui/separator";
import {
	type Release as ReleaseType,
	getSortedReleases,
} from "@/changelog/utils";
import {
	ReleaseArticle,
	ReleaseMeta,
	ReleaseTitle,
	ReleaseDescription,
	ReleaseChanges,
} from "@/changelog/components/release";

export const metadata: Metadata = {
	title: "更新日志 - OpenCut",
	description: "OpenCut 的新功能",
	openGraph: {
		title: "更新日志 - OpenCut",
		description: "记录 OpenCut 的每次更新、改进与修复。",
		type: "website",
		images: [
			{
				url: "/open-graph/changlog.jpg",
				width: 1200,
				height: 630,
				alt: "OpenCut Changelog",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "更新日志 - OpenCut",
		description: "OpenCut 的新功能",
		images: ["/open-graph/changlog.jpg"],
	},
};

export default function ChangelogPage() {
	const releases = getSortedReleases();

	return (
		<BasePage title="更新日志" description="查看 OpenCut 的新功能">
			<div className="mx-auto w-full max-w-3xl">
				<div className="relative">
					<div
						aria-hidden
						className="absolute top-2 bottom-0 left-[5px] w-px bg-border hidden sm:block"
					/>

					<div className="flex flex-col">
						{releases.map((release, releaseIndex) => (
							<div key={release.version} className="flex flex-col">
								<ReleaseEntry release={release} />
								{releaseIndex < releases.length - 1 && (
									<Separator className="my-10 sm:ml-1.5" />
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</BasePage>
	);
}

function ReleaseEntry({ release }: { release: ReleaseType }) {
	return (
		<ReleaseArticle variant="list" isLatest={release.isLatest}>
			<ReleaseMeta release={release} />
			<div className="flex flex-col gap-4">
				<ReleaseTitle as="h2" href={`/changelog/${release.version}`}>
					{release.title}
				</ReleaseTitle>
				{release.description && (
					<ReleaseDescription>{release.description}</ReleaseDescription>
				)}
			</div>
			<ReleaseChanges release={release} />
		</ReleaseArticle>
	);
}
